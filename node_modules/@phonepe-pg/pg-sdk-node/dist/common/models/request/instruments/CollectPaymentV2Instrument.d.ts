import { CollectPaymentDetails } from './CollectPaymentDetails';
import { PaymentV2Instrument } from './PaymentV2Instrument';
export declare class CollectPaymentV2Instrument extends PaymentV2Instrument {
    details: CollectPaymentDetails;
    message?: string;
    constructor(details: CollectPaymentDetails, message?: string);
    static builder: () => CollectPaymentV2InstrumentBuilder;
}
declare class CollectPaymentV2InstrumentBuilder {
    private _details;
    private _message?;
    /**
     * SETTERS
     */
    details: (details: CollectPaymentDetails) => this;
    message: (message?: string) => this;
    build: () => CollectPaymentV2Instrument;
}
export {};
