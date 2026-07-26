import { PaymentRefundDetail } from './PaymentRefundDetail';
export declare class RefundStatusResponse {
    merchantId: string;
    merchantRefundId: string;
    originalMerchantOrderId: string;
    amount: number;
    state: string;
    paymentDetails: PaymentRefundDetail[];
}
