import { PaymentFlow } from '../../../../common/models/PaymentFlow';
export declare class PgCheckoutPaymentFlow extends PaymentFlow {
    private message?;
    private merchantUrls?;
    constructor(message?: string, redirectUrl?: string);
    static builder(): PgCheckoutPaymentFlowBuilder;
}
declare class PgCheckoutPaymentFlowBuilder {
    private _message?;
    private _redirectUrl?;
    /**
     * SETTERS FOR PG_CHECKOUT PAYMENT FLOW
     */
    message(message?: string): this;
    redirectUrl(redirectUrl?: string): this;
    build(): PgCheckoutPaymentFlow;
}
export {};
