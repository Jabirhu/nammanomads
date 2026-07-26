import { MerchantUrls } from './MerchantUrls';
import { PaymentFlow } from '../../../../common/models/PaymentFlow';
import { PaymentV2Instrument } from '../../../../common/models/request/instruments/PaymentV2Instrument';
export declare class PgPaymentFlow extends PaymentFlow {
    paymentMode: PaymentV2Instrument;
    merchantUrls?: MerchantUrls;
    constructor(paymentMode: PaymentV2Instrument, redirectUrl?: string);
    static builder: () => PgPaymentFlowBuilder;
}
declare class PgPaymentFlowBuilder {
    private _paymentMode;
    private _redirectUrl?;
    /**
     * SETTERS FOR PG PAYMENT FLOW
     */
    paymentMode: (paymentMode: PaymentV2Instrument) => this;
    redirectUrl: (redirectUrl?: string) => this;
    build: () => PgPaymentFlow;
}
export {};
