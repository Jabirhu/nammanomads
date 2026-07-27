require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const axios = require('axios');
const FormData = require('form-data');
const { StandardCheckoutClient, Env } = require('@phonepe-pg/pg-sdk-node');


const app = express();
const PORT = process.env.PORT || 3000;

// PhonePe Gateway Client Initialization
const clientId = process.env.PHONEPE_CLIENT_ID;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
const env = Env.SANDBOX; // Switch to Env.PRODUCTION for live deployments

const phonepeClient = new StandardCheckoutClient(clientId, clientSecret, clientVersion, env);

// Resend Email Initialization
const resend = new Resend(process.env.RESEND_API_KEY);

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    socketTimeout: 30000,
    connectionTimeout: 30000,
    family: 4 // Forces IPv4 to bypass Render network routing restrictions
});

// PostgreSQL Database Connection Pool Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for cloud databases like Supabase, Neon, or Render
    }
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database.');
});

pool.on('error', (err) => {
    console.error('Unexpected database error on idle client', err);
});

// Initialize Tables & Auto-Seed Built-In Admin Account Safely
const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                mobile TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'player',
                is_verified BOOLEAN DEFAULT FALSE,
                otp_code TEXT,
                otp_expires BIGINT
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                title TEXT,
                date TEXT,
                time TEXT,
                location TEXT,
                price TEXT,
                slots INTEGER,
                total_slots INTEGER DEFAULT 22
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                game_id INTEGER REFERENCES games(id),
                status TEXT DEFAULT 'PENDING',
                withdrawal_reason TEXT DEFAULT '',
                transaction_id TEXT UNIQUE,
                utr_number TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id SERIAL PRIMARY KEY,
                image_url TEXT,
                caption TEXT
            )
        `);

        // Ensure columns exist if tables were created previously without them
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE`);
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE`);
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code TEXT`);
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires BIGINT`);

        const adminMobile = '9353863794';
        const adminResult = await pool.query(`SELECT * FROM users WHERE mobile = $1`, [adminMobile]);
        
        if (adminResult.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('Nico@mads987', 10);
            await pool.query(
                `INSERT INTO users (name, mobile, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6)`,
                ['Namma Nomads Admin', adminMobile, 'admin@nammanomads.com', hashedPassword, 'admin', true]
            );
            console.log('Built-in Admin account initialized successfully.');
        }
    } catch (err) {
        console.error('Database initialization error:', err.message);
    }
};

initializeDatabase();

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Crucial fix: Trust proxy for Render / HTTPS load balancers
app.set('trust proxy', 1);

// Secure Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Multer Config with Memory Storage (Essential for Render & ImgBB API uploads)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|heic/;
        const ext = path.extname(file.originalname).toLowerCase();
        const extname = allowedTypes.test(ext);
        const mimetype = allowedTypes.test(file.mimetype) || ext === '.heic';

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only standard image files (JPG, PNG, WEBP) are allowed!'));
    }
});

// 1. Make user globally available to all EJS views first
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 2. Multer error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes('Only standard image files')) {
        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.status(400).json({ success: false, message: 'Invalid photo or picture not supported!' });
        }
        return res.send(`<script>alert('Invalid photo or picture not supported!'); window.history.back();</script>`);
    }
    next(err);
});

const isAdminUser = (user) => {
    return user && (user.role === 'admin' || user.isAdmin === true || user.mobile === '9353863794');
};

// --- ROUTES ---
app.get('/', async (req, res) => {
    try {
        const gamesResult = await pool.query("SELECT * FROM games");
        const games = gamesResult.rows;

        const galleryResult = await pool.query("SELECT * FROM gallery");
        const gallery = galleryResult.rows || [];

        if (!games || games.length === 0) {
            return res.render('index', { games: [], gallery, userBookings: {} });
        }

        const now = new Date();
        const activeGames = games.filter(game => {
            if (!game.date) return false;

            let year, month, day;
            if (game.date.includes('-')) {
                [year, month, day] = game.date.split('-');
            } else if (game.date.includes('/')) {
                const parts = game.date.split('/');
                if (parts[2] && parts[2].length === 4) {
                    day = parts[0];
                    month = parts[1];
                    year = parts[2];
                } else {
                    year = parts[2];
                    month = parts[0];
                    day = parts[1];
                }
            } else {
                return true; 
            }

            const startTimeMatch = game.time ? game.time.match(/(\d+):(\d+)\s*(AM|PM)/i) : null;
            let hours = 0;
            let minutes = 0;
            
            if (startTimeMatch) {
                hours = parseInt(startTimeMatch[1], 10);
                minutes = parseInt(startTimeMatch[2], 10);
                const period = startTimeMatch[3].toUpperCase();
                
                if (period === 'PM' && hours < 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
            }

            const gameDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes);
            return gameDateTime > now;
        });

        if (activeGames.length === 0) {
            return res.render('index', { games: [], gallery, userBookings: {} });
        }

        let userBookings = {};
        const userId = req.session && req.session.user ? req.session.user.id : null;

        if (userId) {
            const bookingsResult = await pool.query("SELECT game_id, status FROM bookings WHERE user_id = $1 AND status != 'Withdrawn'", [userId]);
            bookingsResult.rows.forEach(row => {
                userBookings[row.game_id] = row.status; 
            });
        }

        for (let game of activeGames) {
            const countResult = await pool.query("SELECT COUNT(*) as count FROM bookings WHERE game_id = $1 AND status IN ('Confirmed', 'SUCCESS')", [game.id]);
            game.registeredCount = (countResult.rows && countResult.rows[0]) ? parseInt(countResult.rows[0].count, 10) : 0;
        }

        res.render('index', { games: activeGames, gallery, userBookings });
    } catch (err) {
        console.error("Database error on home route:", err.message);
        return res.status(500).send("Database error");
    }
});

app.post('/login', async (req, res) => {
    const { mobile, password, is_admin_form } = req.body;

    if (!mobile || !password) {
        return res.send("<script>alert('All fields are required'); window.location.href='/';</script>");
    }

    if (is_admin_form === 'true') {
        try {
            const userResult = await pool.query(`SELECT * FROM users WHERE mobile = $1`, [mobile]);
            const user = userResult.rows[0];

            if (!user) {
                await bcrypt.compare(password, '$2a$10$invalidhashdummyvaluetoensuretimingsafety123456');
                return res.send("<script>alert('Invalid Admin Credentials!'); window.location.href='/';</script>");
            }

            let match = false;
            if (user.password.startsWith('$2')) {
                match = await bcrypt.compare(password, user.password);
            } else {
                match = (password === user.password);
            }

            if (match && (user.role === 'admin' || mobile === '9353863794')) {
                req.session.regenerate((err) => {
                    if (err) return res.status(500).send("Session error");
                    req.session.user = { 
                        id: user.id,
                        mobile: user.mobile, 
                        email: user.email,
                        name: user.name, 
                        role: user.role,
                        isAdmin: true 
                    };
                    return res.redirect('/admin/dashboard');
                });
            } else {
                return res.send("<script>alert('Invalid Admin Credentials!'); window.location.href='/';</script>");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            return res.send("<script>alert('An error occurred during admin login.'); window.location.href='/';</script>");
        }
        return;
    }

    if (mobile === '9353863794') {
        return res.send("<script>alert('try with different number!!'); window.location.href='/';</script>");
    }

    try {
        const identifier = mobile.trim();
        
        const userResult = await pool.query(
            `SELECT * FROM users WHERE mobile = $1 OR email = $2`, 
            [identifier, identifier.toLowerCase()]
        );
        const user = userResult.rows[0];

        if (!user) {
            await bcrypt.compare(password, '$2a$10$invalidhashdummyvaluetoensuretimingsafety123456');
            return res.send("<script>alert('Invalid Mobile/Email or Password'); window.location.href='/';</script>");
        }

        if (user.is_verified === false) {
            return res.send("<script>alert('Please verify your email address first using OTP.'); window.location.href='/';</script>");
        }

        let match = false;
        if (user.password.startsWith('$2')) {
            match = await bcrypt.compare(password, user.password);
        } else {
            match = (password === user.password);
        }

        if (match) {
            req.session.regenerate((err) => {
                if (err) return res.status(500).send("Session error");
                
                req.session.user = { 
                    id: user.id, 
                    mobile: user.mobile, 
                    email: user.email,
                    name: user.name, 
                    role: user.role,
                    isAdmin: user.role === 'admin'
                };
                
                const redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                return res.redirect(redirectTo);
            });
        } else {
            return res.send("<script>alert('Invalid Mobile/Email or Password'); window.location.href='/';</script>");
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.send("<script>alert('An error occurred during login.'); window.location.href='/';</script>");
    }
});

// Custom Signup with Email OTP Integration
app.post('/signup', async (req, res) => {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
        return res.send("<script>alert('All fields including email are required!'); window.location.href='/';</script>");
    }

    if (mobile === '9353863794') {
        return res.send("<script>alert('This mobile number cannot be registered here!'); window.location.href='/';</script>");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    try {
        const existing = await pool.query(`SELECT * FROM users WHERE mobile = $1 OR email = $2`, [cleanMobile, cleanEmail]);
        
        if (existing.rows.length > 0) {
            const usr = existing.rows[0];
            if (usr.is_verified) {
                return res.send("<script>alert('Mobile number or Email already registered and verified!'); window.location.href='/';</script>");
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = Date.now() + 10 * 60 * 1000; 

                await pool.query(
                    `UPDATE users SET name = $1, password = $2, otp_code = $3, otp_expires = $4, email = $5, mobile = $6 WHERE id = $7`,
                    [name.trim(), hashedPassword, otpCode, otpExpires, cleanEmail, cleanMobile, usr.id]
                );

                await resend.emails.send({
                    from: 'Namma Nomads <onboarding@resend.dev>',
                    to: cleanEmail,
                    subject: 'Namma Nomads - Verify Your Email',
                    text: `Hello ${name},\n\nYour 6-digit verification code is: ${otpCode}\n\nIt expires in 10 minutes.`
                });

                return res.redirect(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; 

        await pool.query(
            `INSERT INTO users (name, mobile, email, password, role, is_verified, otp_code, otp_expires) VALUES ($1, $2, $3, $4, 'player', false, $5, $6)`,
            [name.trim(), cleanMobile, cleanEmail, hashedPassword, otpCode, otpExpires]
        );

        await resend.emails.send({
            from: 'Namma Nomads <onboarding@resend.dev>',
            to: cleanEmail,
            subject: 'Namma Nomads - Verify Your Email',
            text: `Hello ${name},\n\nYour 6-digit verification code is: ${otpCode}\n\nIt expires in 10 minutes.`
        });

        return res.redirect(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
    } catch (error) {
        console.error("Signup error:", error.message);
        if (error.code === '23505') {
            return res.send("<script>alert('A user with this mobile number or email already exists.'); window.location.href='/';</script>");
        }
        return res.send("<script>alert('Error during registration or email dispatch!'); window.location.href='/';</script>");
    }
});

// OTP Verification Form / Route Support
app.get('/verify-otp', (req, res) => {
    const email = req.query.email || '';
    res.render('verify-otp', { email });
});

app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        const user = userResult.rows[0];

        if (!user) {
            return res.render('verify-otp', { errorMessage: 'Invalid or expired OTP.', email: normalizedEmail });
        }

        if (user.otp_code !== otp || Date.now() > Number(user.otp_expires)) {
            return res.render('verify-otp', { errorMessage: 'Incorrect or expired OTP code.', email: normalizedEmail });
        }

        await pool.query(
            'UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expires = NULL WHERE id = $1',
            [user.id]
        );

        return res.redirect('/?login=open');
    } catch (err) {
        console.error('Error during OTP verification:', err);
        return res.status(500).send('Server error during verification.');
    }
});

app.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        const currentDate = new Date().toISOString().split('T')[0];
        let currentCount = user.otp_count || 0;
        let lastDate = user.last_otp_date;

        if (lastDate !== currentDate) {
            currentCount = 0;
            lastDate = currentDate;
        }

        if (currentCount >= 4) {
            return res.status(429).json({ 
                success: false, 
                message: 'Daily OTP limit reached (maximum 4 times per day). Try again tomorrow.' 
            });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const newExpires = Date.now() + 10 * 60 * 1000;

        await pool.query(
            `UPDATE users SET otp_code = $1, otp_expires = $2, otp_count = $3, last_otp_date = $4 WHERE id = $5`,
            [newOtp, newExpires, currentCount + 1, currentDate, user.id]
        );

        await resend.emails.send({
            from: 'Namma Nomads <onboarding@resend.dev>',
            to: normalizedEmail,
            subject: 'Your Resent Namma Nomads Verification Code',
            text: `Your new 6-digit verification code is: ${newOtp}\n\nIt expires in 10 minutes.`
        });

        return res.json({ success: true, message: 'New OTP sent successfully!' });
    } catch (err) {
        console.error('Error resending OTP:', err.message);
        return res.status(500).json({ success: false, message: 'Server error while resending OTP.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.get('/admin', (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.redirect('/login');
    }
    res.redirect('/admin/dashboard');
});

app.get('/admin/dashboard', async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.send("<script>alert('Access Denied! Admin only.'); window.location='/';</script>");
    }

    try {
        const gamesResult = await pool.query(`SELECT * FROM games`);
        const galleryResult = await pool.query(`SELECT * FROM gallery`);
        
        const now = new Date();
        const safeGames = gamesResult.rows || [];

        const processedGames = safeGames.map(game => {
            let gameDateObj = new Date(game.date);
            if (!game.date) {
                gameDateObj = now;
            }
            const isFinished = gameDateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            return {
                ...game,
                status: isFinished ? 'finished' : 'active'
            };
        });

        processedGames.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.render('admin-dashboard', { 
            games: processedGames, 
            gallery: galleryResult.rows || [],
            user: req.session.user 
        });
    } catch (err) {
        console.error("Admin dashboard error:", err);
        res.status(500).send("Server error");
    }
});

app.get('/admin/registrations', async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.redirect('/');
    }

    try {
        const gamesResult = await pool.query(`SELECT * FROM games ORDER BY date DESC, time ASC`);
        res.render('admin-registrations', { 
            games: gamesResult.rows || [], 
            game: null, 
            bookings: [], 
            user: req.session.user 
        });
    } catch (err) {
        res.render('admin-registrations', { games: [], game: null, bookings: [], user: req.session.user });
    }
});

const handleGameAttendees = async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.redirect('/');
    }

    const gameId = req.params.id || req.params.gameId;

    try {
        const gamesResult = await pool.query(`SELECT * FROM games ORDER BY date DESC, time ASC`);
        const games = gamesResult.rows || [];

        const gameResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        const game = gameResult.rows[0];

        if (!game) {
            return res.render('admin-registrations', { games, game: null, bookings: [], user: req.session.user });
        }

        const query = `
            SELECT bookings.id as booking_id, users.name as userName, users.mobile as userPhone, bookings.status, bookings.withdrawal_reason, bookings.utr_number, games.price
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN games ON bookings.game_id = games.id
            WHERE bookings.game_id = $1
            ORDER BY bookings.id ASC
        `;

        const bookingsResult = await pool.query(query, [gameId]);
        res.render('admin-registrations', { games, game, bookings: bookingsResult.rows || [], user: req.session.user });
    } catch (err) {
        console.error("Attendees error:", err);
        res.render('admin-registrations', { games: [], game: null, bookings: [], user: req.session.user });
    }
};

app.get('/admin/game/:id', handleGameAttendees);
app.get('/admin/attendees/:gameId', handleGameAttendees);

app.post('/admin/create-game', async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.status(403).send('Unauthorized');
    }
    let { title, date, time, location, price, slots } = req.body;
    const maxSlots = slots ? parseInt(slots, 10) : 22;

    if (date && date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
            date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    
    try {
        await pool.query(
            `INSERT INTO games (title, date, time, location, price, slots, total_slots) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, date, time, location, price, maxSlots, maxSlots]
        );
    } catch (err) {
        console.error("Error creating game:", err.message);
    }
    res.redirect('/admin/dashboard');
});

// --- ImgBB Permanent Photo Upload Route ---
// --- ImgBB Permanent Photo Upload Route ---
app.post('/admin/upload-photo', upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No file uploaded.');
        }

        const file = req.files[0]; 
        const caption = req.body.caption || ''; // Grab the caption from the form
        const base64Image = file.buffer.toString('base64');

        const formData = new URLSearchParams();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64Image);

        const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData);
        const imageUrl = imgbbResponse.data.data.url;

        // Save image URL and caption using your PostgreSQL pool connection
        await pool.query('INSERT INTO gallery (image_url, caption) VALUES ($1, $2)', [imageUrl, caption]);

        res.redirect('/admin/dashboard#photos-section');
    } catch (err) {
        console.error('Upload Error Details:', err.response?.data || err.message);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});

app.post('/admin/delete-game/:id', async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.status(403).send('Unauthorized');
    }
    const gameId = req.params.id;
    try {
        await pool.query(`DELETE FROM bookings WHERE game_id = $1`, [gameId]);
        await pool.query(`DELETE FROM games WHERE id = $1`, [gameId]);
    } catch (err) {
        console.error("Error deleting game:", err);
    }
    res.redirect('/admin/dashboard');
});

app.get('/book/:id', async (req, res) => {
    const gameId = req.params.id;

    if (!req.session.user) {
        req.session.redirectTo = `/book/${gameId}`;
        return res.redirect('/'); 
    }

    const userId = req.session.user.id;

    const checkQuery = `
        SELECT bookings.*, games.title, games.date 
        FROM bookings 
        JOIN games ON bookings.game_id = games.id 
        WHERE bookings.user_id = $1 AND bookings.game_id = $2 AND bookings.status NOT IN ('Withdrawn', 'FAILED')
    `;

    try {
        const existingResult = await pool.query(checkQuery, [userId, gameId]);
        if (existingResult.rows.length > 0) {
            const existingBooking = existingResult.rows[0];
            return res.send(`<script>alert('You already have an active/pending booking for this game (${existingBooking.title} - ${existingBooking.date}).'); window.location.href='/';</script>`);
        }

        const gameResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        const game = gameResult.rows[0];

        if (!game) {
            return res.status(404).send("<script>alert('Game not found!'); window.location='/';</script>");
        }
        
        res.render('checkout', { game, user: req.session.user });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Database error");
    }
});

// --- PAYMENT / PHONEPE / BOOKING API ROUTES ---
app.post('/api/phonepe/create-order', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { game_id } = req.body;
    const userId = req.session.user.id;

    try {
        const gameResult = await pool.query("SELECT * FROM games WHERE id = $1", [game_id]);
        const game = gameResult.rows[0];

        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }

        const merchantTransactionId = "NM_" + Date.now();
        const amount = game.price;
        const upiId = process.env.UPI_ID || "9353863794@ybl"; 
        const payeeName = "Namma Nomads";

        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${merchantTransactionId}`;

        await pool.query(
            "INSERT INTO bookings (game_id, user_id, transaction_id, status) VALUES ($1, $2, $3, $4)",
            [game_id, userId, merchantTransactionId, 'PENDING']
        );
            
        res.json({ 
            success: true, 
            redirectUrl: upiLink, 
            transactionId: merchantTransactionId 
        });
    } catch (dbErr) {
        console.error("Database insert error:", dbErr.message);
        return res.status(500).json({ success: false, message: "Database error" });
    }
});

app.get('/api/phonepe/redirect', async (req, res) => {
    const { id } = req.query; 
    if (!id) return res.redirect('/');

    try {
        const statusResponse = await phonepeClient.getStatus(id);
        
        const bookingResult = await pool.query("SELECT * FROM bookings WHERE transaction_id = $1", [id]);
        const booking = bookingResult.rows[0];

        if (!booking) return res.redirect('/');

        const newStatus = (statusResponse && statusResponse.getState() === 'COMPLETED') ? 'SUCCESS' : 'FAILED';
        await pool.query("UPDATE bookings SET status = $1, utr_number = $2 WHERE transaction_id = $3", [newStatus, id, id]);
        
        if (newStatus === 'SUCCESS') {
            return res.redirect('/booking-success?game=' + booking.game_id);
        } else {
            return res.redirect('/booking-failed');
        }
    } catch (error) {
        console.error("Status check error:", error);
        res.redirect('/');
    }
});

app.post('/api/phonepe/webhook', express.json(), async (req, res) => {
    try {
        const responsePayload = req.body;
        
        if (responsePayload && responsePayload.success) {
            const transactionId = responsePayload.data.merchantTransactionId;
            await pool.query("UPDATE bookings SET status = 'SUCCESS', utr_number = $1 WHERE transaction_id = $2", [transactionId, transactionId]);
        }
        
        res.status(200).send({ status: "OK" });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send({ status: "ERROR" });
    }
});

app.post('/withdraw', async (req, res) => {
    if (!req.session.user) return res.status(403).send('Unauthorized');

    const { booking_id, game_id, reason } = req.body;
    const userId = req.session.user.id;
    const withdrawalReason = reason ? reason.trim().substring(0, 255) : 'No reason provided';

    try {
        const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id = $1 AND user_id = $2`, [booking_id, userId]);
        const booking = bookingResult.rows[0];

        if (!booking) {
            return res.status(404).send("<script>alert('Booking not found!'); window.location='/my-bookings';</script>");
        }

        const wasConfirmed = (booking.status && (booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'success'));

        await pool.query(`UPDATE bookings SET status = 'Withdrawn', withdrawal_reason = $1 WHERE id = $2`, [withdrawalReason, booking_id]);

        if (wasConfirmed) {
            const nextQueueResult = await pool.query(`SELECT * FROM bookings WHERE game_id = $1 AND status = 'Waitlist' ORDER BY id ASC LIMIT 1`, [game_id]);
            const nextInQueue = nextQueueResult.rows[0];
            if (nextInQueue) {
                await pool.query(`UPDATE bookings SET status = 'Confirmed' WHERE id = $1`, [nextInQueue.id]);
            }
        }
        res.redirect('/my-bookings');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Database error");
    }
});

app.get('/booking-success', async (req, res) => {
    if (!req.session.user) return res.redirect('/');
    const gameId = String(req.query.game);

    try {
        const gameResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        res.render('success', { game: gameResult.rows[0] || {}, user: req.session.user });
    } catch (err) {
        res.render('success', { game: {}, user: req.session.user });
    }
});

app.get('/booking-failed', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.send("<script>alert('Payment failed or cancelled.'); window.location.href='/';</script>");
});

app.get('/my-bookings', async (req, res) => {
    if (!req.session.user) return res.redirect('/');
    
    const userId = req.session.user.id;
    const query = `
        SELECT bookings.*, games.title, games.date, games.time, games.location, games.price 
        FROM bookings 
        JOIN games ON bookings.game_id = games.id 
        WHERE bookings.user_id = $1
        ORDER BY bookings.id DESC
    `;

    try {
        const bookingsResult = await pool.query(query, [userId]);
        res.render('my-bookings', { bookings: bookingsResult.rows || [], user: req.session.user });
    } catch (err) {
        console.error(err);
        res.render('my-bookings', { bookings: [], user: req.session.user });
    }
});

app.post('/admin/delete-photo/:id', async (req, res) => {
    if (!isAdminUser(req.session.user)) {
        return res.status(403).send('Unauthorized');
    }
    
    const photoId = req.params.id;

    try {
        await pool.query(`DELETE FROM gallery WHERE id = $1`, [photoId]);
    } catch (err) {
        console.error("Error deleting photo:", err.message);
    }
    res.redirect('/admin/dashboard#photos-section');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Namma Nomads server running at http://localhost:${PORT}`);
});