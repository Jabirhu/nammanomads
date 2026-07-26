export declare class BillingAddress {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    constructor(line1?: string, line2?: string, city?: string, state?: string, zip?: string, country?: string);
    static builder(): BillingAddressBuilder;
}
declare class BillingAddressBuilder {
    private _line1?;
    private _line2?;
    private _city?;
    private _state?;
    private _zip?;
    private _country?;
    /**
     * SETTERS
     */
    line1: (line1: string) => void;
    line2: (line2: string) => void;
    city: (city: string) => void;
    state: (state: string) => void;
    zip: (zip: string) => void;
    country: (country: string) => void;
    build: () => BillingAddress;
}
export {};
