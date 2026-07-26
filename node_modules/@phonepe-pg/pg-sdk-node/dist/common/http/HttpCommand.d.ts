import { HttpMethodType } from './HttpMethodType';
import { AxiosInstance } from 'axios';
export declare class HttpCommand {
    private hostUrl;
    private httpClient;
    constructor(hostUrl: string, httpClient: AxiosInstance);
    private getCompleteUrl;
    request: <T>(url: string, method: HttpMethodType, headers?: {
        [key: string]: string;
    }, data?: object, params?: {
        [key: string]: string;
    }) => Promise<T>;
    private makeCall;
    private handleError;
}
