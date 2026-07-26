import { PaymentInstrumentType } from './PaymentInstrumentType';
export declare abstract class InstrumentConstraint {
    type: PaymentInstrumentType;
    constructor(type: PaymentInstrumentType);
}
