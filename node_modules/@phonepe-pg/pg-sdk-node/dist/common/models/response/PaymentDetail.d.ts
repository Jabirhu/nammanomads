import { PgV2InstrumentType } from '../PgV2InstrumentType';
import { InstrumentCombo } from './InstrumentCombo';
import { AccountPaymentInstrumentV2 } from './paymentinstruments/AccountInstrumentV2';
import { UpiPaymentRail } from './rails/UpiPaymentRail';
import { CreditCardPaymentInstrumentV2 } from './paymentinstruments/CreditCardPaymentInstrumentV2';
import { PgPaymentRail } from './rails/PgPaymentRail';
import { DebitCardPaymentInstrumentV2 } from './paymentinstruments/DebitCardPaymentInstrumentV2';
import { EgvPaymentInstrumentV2 } from './paymentinstruments/EgvPaymentInstrumentV2';
import { NetbankingPaymentInstrumentV2 } from './paymentinstruments/NetbankingPaymentInstrumentV2';
import { WalletPaymentInstrumentV2 } from './paymentinstruments/WalletPaymentInstrumentV2';
import { PpiEgvPaymentRail } from './rails/PpiEgvPaymentRail';
import { PpiWalletPaymentRail } from './rails/PpiWalletPaymentRail';
export declare class PaymentDetail {
    transactionId: string;
    paymentMode: PgV2InstrumentType;
    timestamp: number;
    amount: number;
    state: string;
    errorCode?: string;
    detailedErrorCode?: string;
    instrument?: AccountPaymentInstrumentV2 | CreditCardPaymentInstrumentV2 | DebitCardPaymentInstrumentV2 | EgvPaymentInstrumentV2 | NetbankingPaymentInstrumentV2 | WalletPaymentInstrumentV2;
    rail?: UpiPaymentRail | PgPaymentRail | PpiEgvPaymentRail | PpiWalletPaymentRail;
    splitInstruments?: InstrumentCombo[];
}
