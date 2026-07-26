import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
export declare class NetBankingPayRequestBuilder {
    private _merchantOrderId;
    private _amount;
    private _constraints?;
    private _metaInfo?;
    private _bankId;
    private _merchantUserId?;
    private _redirectUrl?;
    private _expireAfter?;
    /**
     * SETTERS
     */
    merchantOrderId: (merchantOrderId: string) => this;
    amount: (amount: number) => this;
    metaInfo: (metaInfo: MetaInfo) => this;
    constraints: (constraints: InstrumentConstraint[]) => this;
    bankId: (bankId: string) => this;
    merchantUserId: (merchantUserId: string) => this;
    redirectUrl: (redirectUrl: string) => this;
    expireAfter: (expireAfter: number) => this;
    build: () => CustomCheckoutPayRequest;
}
