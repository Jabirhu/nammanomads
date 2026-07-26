import { InstrumentConstraint } from './InstrumentConstraint';
/**
 * Used to create an Account Constraint which can be send with the pay request
 */
export declare class AccountConstraint extends InstrumentConstraint {
    accountNumber: string;
    ifsc: string;
    constructor(accountNumber: string, ifsc: string);
    static builder: () => AccountConstraintBuilder;
}
declare class AccountConstraintBuilder {
    private _accountNumber;
    private _ifsc;
    accountNumber: (accountNumber: string) => this;
    ifsc: (ifsc: string) => this;
    build: () => AccountConstraint;
}
export {};
