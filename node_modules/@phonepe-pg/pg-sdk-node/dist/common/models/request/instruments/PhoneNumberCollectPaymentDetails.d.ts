import { CollectPaymentDetails } from './CollectPaymentDetails';
export declare class PhoneNumberCollectPaymentDetails extends CollectPaymentDetails {
    phoneNumber: string;
    constructor(phoneNumber: string);
    static builder: () => PhoneNumberCollectPaymentDetailsBuilder;
}
declare class PhoneNumberCollectPaymentDetailsBuilder {
    private _phoneNumber;
    phoneNumber: (phoneNumber: string) => this;
    build: () => PhoneNumberCollectPaymentDetails;
}
export {};
