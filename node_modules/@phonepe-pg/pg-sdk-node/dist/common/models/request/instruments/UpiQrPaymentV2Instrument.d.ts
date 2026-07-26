import { PaymentV2Instrument } from './PaymentV2Instrument';
export declare class UpiQrPaymentV2Instrument extends PaymentV2Instrument {
    constructor();
    static builder: () => UpiQrPaymentV2InstrumentBuilder;
}
declare class UpiQrPaymentV2InstrumentBuilder {
    build: () => UpiQrPaymentV2Instrument;
}
export {};
