import { Expiry } from './Expiry';
export declare class TokenDetails {
    encryptedToken: string;
    encryptedCvv: string;
    encryptionKeyId: number;
    expiry: Expiry;
    cryptogram: string;
    panSuffix: string;
    cardHolderName?: string;
    eci?: string;
    atc?: string;
    constructor(encryptedToken: string, encryptedCvv: string, encryptionKeyId: number, expiry: Expiry, cryptogram: string, panSuffix: string, cardHolderName?: string, eci?: string, atc?: string);
    static builder: () => TokenDetailsBuilder;
}
declare class TokenDetailsBuilder {
    private _encryptedToken;
    private _encryptedCvv;
    private _encryptionKeyId;
    private _expiry;
    private _cryptogram;
    private _panSuffix;
    private _cardHolderName?;
    private _eci?;
    private _atc?;
    /**
     * SETTERS
     */
    encryptedToken: (encryptedToken: string) => this;
    encryptedCvv: (encryptedCvv: string) => this;
    encryptionKeyId: (encryptionKeyId: number) => this;
    expiry: (expiry: Expiry) => this;
    cryptogram: (cryptogram: string) => this;
    panSuffix: (panSuffix: string) => this;
    cardHolderName: (cardHolderName?: string) => this;
    eci: (eci: string) => this;
    atc: (atc: string) => this;
    build: () => TokenDetails;
}
export {};
