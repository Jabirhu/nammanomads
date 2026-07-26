import { MetaInfo } from '../MetaInfo';
import { PaymentDetail } from './PaymentDetail';
export declare class OrderStatusResponse {
    merchantOrderId?: string;
    merchantId?: string;
    orderId: string;
    state: string;
    amount: number;
    payableAmount?: number;
    feeAmount?: number;
    expireAt: number;
    errorCode?: string;
    detailedErrorCode?: string;
    metaInfo?: MetaInfo;
    paymentDetails: PaymentDetail[];
}
