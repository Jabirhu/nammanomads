export declare class StandardCheckoutContants {
    static readonly PAY_API: string;
    static readonly ORDER_STATUS_API = "/checkout/v2/order/{ORDER_ID}/status";
    static readonly REFUND_API = "/payments/v2/refund";
    static readonly REFUND_STATUS_API = "/payments/v2/refund/{REFUND_ID}/status";
    static readonly ORDER_DETAILS = "details";
    static readonly TRANSACTION_STATUS_API = "/checkout/v2/transaction/{TRANSACTION_ID}/status";
    static readonly CREATE_ORDER_API = "/checkout/v2/sdk/order";
}
