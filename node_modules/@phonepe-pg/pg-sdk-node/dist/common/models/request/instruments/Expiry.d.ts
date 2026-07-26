export declare class Expiry {
    month: string;
    year: string;
    constructor(month: string, year: string);
    static builder: () => ExpiryBuilder;
}
declare class ExpiryBuilder {
    private _expiryMonth;
    private _expiryYear;
    expiryMonth: (expiryMonth: string) => this;
    expiryYear: (expiryYear: string) => this;
    build: () => Expiry;
}
export {};
