import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
export declare class TokenPayRequestBuilder {
    private _merchantOrderId;
    private _amount;
    private _encryptionKeyId;
    private _encryptedToken;
    private _encryptedCvv;
    private _cryptogram;
    private _panSuffix;
    private _expiryMonth;
    private _expiryYear;
    private _authMode?;
    private _redirectUrl?;
    private _cardHolderName?;
    private _merchantUserId?;
    private _metaInfo?;
    private _constraints?;
    private _expireAfter?;
    /**
     * SETTERS
     */
    merchantOrderId: (merchantOrderId: string) => this;
    amount: (amount: number) => this;
    metaInfo: (metaInfo: MetaInfo) => this;
    constraints: (constraints: InstrumentConstraint[]) => this;
    encryptedToken: (encryptedToken: string) => this;
    authMode: (authMode: string) => this;
    encryptionKeyId: (encryptionKeyId: number) => this;
    panSuffix: (panSuffix: string) => this;
    cryptogram: (cryptogram: string) => this;
    encryptedCvv: (encryptedCvv: string) => this;
    expiryMonth: (expiryMonth: string) => this;
    expiryYear: (expiryYear: string) => this;
    redirectUrl: (redirectUrl: string) => this;
    cardHolderName: (cardHolderName: string) => this;
    merchantUserId: (merchantUserId: string) => this;
    expireAfter: (expireAfter: number) => this;
    build: () => CustomCheckoutPayRequest;
}
