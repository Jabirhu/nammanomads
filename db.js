const { Pool } = require('pg');

// This will automatically read the DATABASE_URL environment variable 
// provided by Render, Supabase, or Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for most cloud databases like Supabase/Neon/Render
  }
});

module.exports = pool;