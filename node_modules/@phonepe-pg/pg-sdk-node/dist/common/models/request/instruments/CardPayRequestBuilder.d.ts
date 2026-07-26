import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
export declare class CardPayRequestBuilder {
    private _merchantOrderId;
    private _amount;
    private _encryptionKeyId;
    private _encryptedCardNumber;
    private _encryptedCvv;
    private _expiryMonth;
    private _expiryYear;
    private _authMode?;
    private _cardHolderName?;
    private _merchantUserId?;
    private _metaInfo?;
    private _redirectUrl?;
    private _savedCard?;
    private _constraints?;
    private _expireAfter?;
    /**
     * SETTERS
     */
    merchantOrderId: (merchantOrderId: string) => this;
    amount: (amount: number) => this;
    metaInfo: (metaInfo: MetaInfo) => this;
    constraints: (constraints: InstrumentConstraint[]) => this;
    encryptedCardNumber: (encryptedCardNumber: string) => this;
    authMode: (authMode: string) => this;
    encryptionKeyId: (encryptionKeyId: number) => this;
    encryptedCvv: (encryptedCvv: string) => this;
    expiryMonth: (expiryMonth: string) => this;
    expiryYear: (expiryYear: string) => this;
    redirectUrl: (redirectUrl: string) => this;
    cardHolderName: (cardHolderName: string) => this;
    savedCard: (savedCard: boolean) => this;
    merchantUserId: (merchantUserId: string) => this;
    expireAfter: (expireAfter: number) => this;
    build: () => CustomCheckoutPayRequest;
}
