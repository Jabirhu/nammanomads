export declare class CredentialConfig {
    private _clientId;
    private _clientSecret;
    private _clientVersion;
    constructor(clientId: string, clientSecret: string, clientVersion: number);
    static builder(): CredentialConfigBuilder;
    /**
     * Getter Functions
     */
    get clientId(): string;
    get clientSecret(): string;
    get clientVersion(): number;
}
export declare class CredentialConfigBuilder {
    private _clientId;
    private _clientSecret;
    private _clientVersion;
    /**
     * Setters used for MerchantConfig builder
     */
    clientId: (clientId: string) => CredentialConfigBuilder;
    clientSecret: (clientSecret: string) => CredentialConfigBuilder;
    clientVersion: (clientVersion: number) => CredentialConfigBuilder;
    build: () => CredentialConfig;
}
