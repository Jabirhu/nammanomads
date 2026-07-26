import { CollectPaymentDetails } from './CollectPaymentDetails';
export declare class VpaCollectPaymentDetails extends CollectPaymentDetails {
    vpa: string;
    constructor(vpa: string);
    static builder: () => VpaCollectPaymentDetailsBuilder;
}
declare class VpaCollectPaymentDetailsBuilder {
    private _vpa;
    vpa: (vpa: string) => this;
    build: () => VpaCollectPaymentDetails;
}
export {};
