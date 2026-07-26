/**
 * Creates a request to initiate a refund -> RefundRequest.builder()
 */
export declare class RefundRequest {
    merchantRefundId: string;
    originalMerchantOrderId: string;
    amount: number;
    constructor(merchantRefundId: string, originalMerchantOrderId: string, amount: number);
    static builder: () => RefundRequestBuilder;
}
declare class RefundRequestBuilder {
    private _merchantRefundId;
    private _originalMerchantOrderId;
    private _amount;
    merchantRefundId: (merchantRefundId: string) => RefundRequestBuilder;
    originalMerchantOrderId: (originalMerchantOrderId: string) => RefundRequestBuilder;
    amount: (amount: number) => RefundRequestBuilder;
    build: () => RefundRequest;
}
export {};
