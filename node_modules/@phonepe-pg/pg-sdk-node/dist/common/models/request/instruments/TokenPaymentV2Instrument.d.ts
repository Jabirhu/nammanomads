import { PaymentV2Instrument } from './PaymentV2Instrument';
import { TokenDetails } from './TokenDetails';
export declare class TokenPaymentV2Instrument extends PaymentV2Instrument {
    tokenDetails: TokenDetails;
    authMode?: string;
    merchantUserId?: string;
    constructor(tokenDetails: TokenDetails, authMode?: string, merchantUserId?: string);
    static builder: () => TokenPaymentV2InstrumentBuilder;
}
declare class TokenPaymentV2InstrumentBuilder {
    private _tokenDetails;
    private _authMode?;
    private _merchantUserId?;
    tokenDetails: (tokenDetails: TokenDetails) => this;
    authMode: (authMode?: string) => this;
    merchantUserId: (merchantUserId?: string) => this;
    build: () => TokenPaymentV2Instrument;
}
export {};
