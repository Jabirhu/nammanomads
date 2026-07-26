import { AxiosInstance } from 'axios';
import { BaseEvent } from '../models/BaseEvent';
import { EventPublisher } from './EventPublisher';
import { EventQueueHandler } from '../EventQueueHandler';
export declare class QueuedEventPublisher extends EventPublisher {
    scheduler: boolean;
    private _queueHandler;
    private _authTokenSupplier;
    private _httpCommand;
    constructor(httpClient: AxiosInstance, hostUrl: string, queueHandler: EventQueueHandler);
    setAuthTokenSupplier(authTokenSupplier: () => Promise<string>): void;
    startPublishingEvents(authTokenSupplier: () => Promise<string>): void;
    send(event: BaseEvent): Promise<void>;
    run(): Promise<void>;
    sendEvents(): Promise<void>;
    sendBatchData(sdkEventList: BaseEvent[]): Promise<void>;
    getHeaders(): Promise<{
        [x: string]: string;
    }>;
    createEventBatches(): Promise<BaseEvent[][]>;
}
