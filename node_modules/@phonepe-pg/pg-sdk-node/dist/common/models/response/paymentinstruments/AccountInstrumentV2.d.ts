import { PaymentInstrumentType } from './PaymentInstrumentType';
import { PaymentInstrumentV2 } from './PaymentInstrumentV2';
export declare class AccountPaymentInstrumentV2 extends PaymentInstrumentV2 {
    type: PaymentInstrumentType;
    maskedAccountNumber?: string;
    ifsc?: string;
    accountHolderName?: string;
    accountType?: string;
    unmaskedAccountNumber?: string;
}
