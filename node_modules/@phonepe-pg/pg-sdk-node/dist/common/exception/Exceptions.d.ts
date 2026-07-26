import { AxiosResponse } from 'axios';
export declare class PhonePeException extends Error {
    stack?: undefined;
    type: string;
    httpStatusCode?: number;
    message: string;
    data?: {
        [key: string]: object;
    };
    code?: string;
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ClientError extends PhonePeException {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class BadRequest extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class UnauthorizedAccess extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ForbiddenAccess extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ResourceNotFound extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ResourceConflict extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ResourceGone extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ResourceInvalid extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ExpectationFailed extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class TooManyRequests extends ClientError {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
export declare class ServerError extends PhonePeException {
    constructor(message: string, httpStatusCode?: number, error?: AxiosResponse);
}
