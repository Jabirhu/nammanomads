import { AxiosInstance } from 'axios';
import { CredentialConfig } from '../configs/CredentialConfig';
import { Env } from '../../Env';
import { OAuthResponse } from './OAuthResponse';
import { EventPublisher } from '../events/publisher/EventPublisher';
export declare class TokenService {
    private credentialConfig;
    static oAuthResponse: OAuthResponse | null;
    private httpCommand;
    private eventPublisher;
    private mutex;
    set oAuthResponse(oAuthResponse: OAuthResponse);
    constructor(httpClient: AxiosInstance, credentialConfig: CredentialConfig, env: Env, eventPublisher: EventPublisher);
    private prepareRequestHeaders;
    private formatCachedToken;
    private getCurrentTime;
    getOAuthToken: () => Promise<string>;
    private fetchTokenFromPhonePe;
    forceRefreshToken: () => Promise<void>;
    private isCachedTokenValid;
    private prepareFormBody;
}
