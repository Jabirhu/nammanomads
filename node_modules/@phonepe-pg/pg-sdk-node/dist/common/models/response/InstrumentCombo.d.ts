import { AccountPaymentInstrumentV2 } from './paymentinstruments/AccountInstrumentV2';
import { CreditCardPaymentInstrumentV2 } from './paymentinstruments/CreditCardPaymentInstrumentV2';
import { DebitCardPaymentInstrumentV2 } from './paymentinstruments/DebitCardPaymentInstrumentV2';
import { EgvPaymentInstrumentV2 } from './paymentinstruments/EgvPaymentInstrumentV2';
import { NetbankingPaymentInstrumentV2 } from './paymentinstruments/NetbankingPaymentInstrumentV2';
import { WalletPaymentInstrumentV2 } from './paymentinstruments/WalletPaymentInstrumentV2';
import { PgPaymentRail } from './rails/PgPaymentRail';
import { PpiEgvPaymentRail } from './rails/PpiEgvPaymentRail';
import { PpiWalletPaymentRail } from './rails/PpiWalletPaymentRail';
import { UpiPaymentRail } from './rails/UpiPaymentRail';
export declare class InstrumentCombo {
    instrument: AccountPaymentInstrumentV2 | CreditCardPaymentInstrumentV2 | DebitCardPaymentInstrumentV2 | EgvPaymentInstrumentV2 | NetbankingPaymentInstrumentV2 | WalletPaymentInstrumentV2;
    rail: UpiPaymentRail | PgPaymentRail | PpiEgvPaymentRail | PpiWalletPaymentRail;
    amount: number;
}
