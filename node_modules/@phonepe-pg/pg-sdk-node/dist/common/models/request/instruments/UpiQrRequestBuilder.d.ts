import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
export declare class UpiQrRequestBuilder {
    private _merchantOrderId;
    private _amount;
    private _metaInfo?;
    private _constraints?;
    private _expireAfter?;
    /**
     * SETTERS
     */
    merchantOrderId: (merchantOrderId: string) => this;
    amount: (amount: number) => this;
    metaInfo: (metaInfo: MetaInfo) => this;
    constraints: (constraints: InstrumentConstraint[]) => this;
    expireAfter: (expireAfter: number) => this;
    build: () => CustomCheckoutPayRequest;
}
