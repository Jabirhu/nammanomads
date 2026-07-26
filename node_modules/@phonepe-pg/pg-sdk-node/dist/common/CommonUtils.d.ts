declare enum SHA_ALGORITHM {
    SHA256 = "SHA256"
}
export declare class CommonUtils {
    static calculateSha256(args: object): string;
    static shaHex(data: string, algorithm: SHA_ALGORITHM): string;
    static isCallbackValid(username: string, password: string, authorization: string): boolean;
}
export {};
