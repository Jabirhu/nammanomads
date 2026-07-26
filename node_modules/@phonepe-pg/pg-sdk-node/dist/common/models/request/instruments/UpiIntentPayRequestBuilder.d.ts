import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
export declare class UpiIntentPayRequestBuilder {
    private _merchantOrderId;
    private _amount;
    private _metaInfo?;
    private _constraints?;
    private _deviceOS?;
    private _merchantCallBackScheme?;
    private _targetApp?;
    private _expireAfter?;
    /**
     * SETTERS
     */
    merchantOrderId: (merchantOrderId: string) => this;
    amount: (amount: number) => this;
    metaInfo: (metaInfo: MetaInfo) => this;
    constraints: (constraints: InstrumentConstraint[]) => void;
    deviceOS: (deviceOS: string) => this;
    merchantCallBackScheme: (merchantCallBackScheme: string) => this;
    targetApp: (targetApp: string) => this;
    expireAfter: (expireAfter: number) => this;
    build: () => CustomCheckoutPayRequest;
}
