import { NewCardDetails } from './NewCardDetails';
import { PaymentV2Instrument } from './PaymentV2Instrument';
export declare class CardPaymentV2Instrument extends PaymentV2Instrument {
    cardDetails: NewCardDetails;
    authMode?: string;
    savedCard?: boolean;
    merchantUserId?: string;
    constructor(cardDetails: NewCardDetails, authMode?: string, merchantUserId?: string, savedCard?: boolean);
    static builder: () => CardPaymentV2InstrumentBuilder;
}
declare class CardPaymentV2InstrumentBuilder {
    private _cardDetails;
    private _authMode?;
    private _savedCard?;
    private _merchantUserId?;
    cardDetails: (cardDetails: NewCardDetails) => this;
    authMode: (authMode?: string) => this;
    savedCard: (savedCard?: boolean) => this;
    merchantUserId: (merchantUserId?: string) => this;
    build: () => CardPaymentV2Instrument;
}
export {};
