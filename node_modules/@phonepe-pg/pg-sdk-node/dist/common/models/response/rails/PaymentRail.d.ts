export declare abstract class PaymentRail {
    type: PaymentRailType;
}
export declare enum PaymentRailType {
    UPI = "UPI",
    PG = "PG",
    PPI_WALLET = "PPI_WALLET",
    PPI_EGV = "PPI_EGV"
}
