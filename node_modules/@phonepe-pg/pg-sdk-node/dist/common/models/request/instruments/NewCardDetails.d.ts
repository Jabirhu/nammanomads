import { BillingAddress } from './BillingAddress';
import { Expiry } from './Expiry';
export declare class NewCardDetails {
    encryptedCardNumber: string;
    encryptionKeyId: number;
    encryptedCvv: string;
    expiry: Expiry;
    cardHolderName?: string;
    billingAddress?: BillingAddress;
    constructor(encryptedCardNumber: string, encryptedCvv: string, encryptionKeyId: number, expiry: Expiry, cardHolderName?: string);
    static builder: () => NewCardDetailsBuilder;
}
declare class NewCardDetailsBuilder {
    private _encryptedCardNumber;
    private _encryptionKeyId;
    private _encryptedCvv;
    private _cardHolderName?;
    private _expiry;
    /**
     * SETTERS
     */
    encryptedCardNumber: (encryptedCardNumber: string) => this;
    encryptedCvv: (encryptedCvv: string) => this;
    encryptionKeyId: (encryptionKeyId: number) => this;
    expiry: (expiry: Expiry) => this;
    cardHolderName: (cardHolderName?: string) => this;
    build: () => NewCardDetails;
}
export {};
