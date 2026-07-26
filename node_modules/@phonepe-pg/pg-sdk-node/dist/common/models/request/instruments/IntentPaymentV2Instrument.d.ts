import { PaymentV2Instrument } from './PaymentV2Instrument';
export declare class IntentPaymentV2Instrument extends PaymentV2Instrument {
    targetApp?: string;
    constructor(targetApp?: string);
    static builder: () => IntentPaymentV2InstrumentBuilder;
}
declare class IntentPaymentV2InstrumentBuilder {
    private _targetApp?;
    targetApp: (targetApp?: string) => IntentPaymentV2InstrumentBuilder;
    build: () => IntentPaymentV2Instrument;
}
export {};
