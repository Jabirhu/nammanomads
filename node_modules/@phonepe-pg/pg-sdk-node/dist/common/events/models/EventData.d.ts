import { DeviceContext, PaymentFlowType, PgV2InstrumentType } from '../../models';
import { EventDataBuilder } from '../builders/EventDataBuilder';
import { EventState } from './enums/EventState';
import { FlowType } from './enums/FlowType';
export declare class EventData {
    flowType: FlowType;
    paymentFlow?: PaymentFlowType;
    sdkType: string;
    sdkVersion: string;
    apiPath?: string;
    amount?: number;
    targetApp?: string;
    deviceContext?: DeviceContext;
    expireAfter?: number;
    merchantRefundId?: string;
    originalMerchantOrderId?: string;
    transactionId?: string;
    eventState: EventState;
    paymentInstrument?: PgV2InstrumentType;
    cachedTokenIssuedAt?: number;
    cachedTokenExpiresAt?: number;
    tokenFetchAttemptTimestamp?: number;
    exceptionClass?: string;
    exceptionMessage?: string;
    exceptionCode?: string;
    exceptionHttpStatusCode?: number;
    exceptionData?: {
        [key: string]: object;
    };
    constructor(builder: EventDataBuilder);
    static builder(): EventDataBuilder;
}
