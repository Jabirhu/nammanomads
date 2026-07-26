import { InstrumentConstraint } from '../InstrumentConstraint';
import { PgV2InstrumentType } from '../../PgV2InstrumentType';
export declare abstract class PaymentV2Instrument {
    type: PgV2InstrumentType;
    constraints?: InstrumentConstraint[];
    constructor(type: PgV2InstrumentType);
}
