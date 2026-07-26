import { MetaInfo } from '../MetaInfo';
import { PaymentDetail } from './PaymentDetail';
export declare class CallbackData {
    state: string;
    amount: number;
    expireAt: number;
    orderId: string;
    merchantId: string;
    merchantRefundId?: string;
    originalMerchantOrderId?: string;
    refundId?: string;
    merchantOrderId?: string;
    errorCode?: string;
    detailedErrorCode?: string;
    metaInfo?: MetaInfo;
    paymentDetails: PaymentDetail[];
}
