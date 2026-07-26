import { PaymentV2Instrument } from './PaymentV2Instrument';
export declare class NetBankingPaymentV2Instrument extends PaymentV2Instrument {
    bankId: string;
    merchantUserId?: string;
    constructor(bankId: string, merchantUserId?: string);
    static builder: () => NetBankingPaymentV2InstrumentBuilder;
}
declare class NetBankingPaymentV2InstrumentBuilder {
    private _bankId;
    private _merchantUserId?;
    bankId: (bankId: string) => this;
    merchantUserId: (merchantUserId?: string) => this;
    build: () => NetBankingPaymentV2Instrument;
}
export {};
