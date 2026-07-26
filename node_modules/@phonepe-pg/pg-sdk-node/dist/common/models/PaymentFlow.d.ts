import { PaymentFlowType } from './PaymentFlowType';
export declare abstract class PaymentFlow {
    type: PaymentFlowType;
    constructor(paymentFlowType: PaymentFlowType);
}
