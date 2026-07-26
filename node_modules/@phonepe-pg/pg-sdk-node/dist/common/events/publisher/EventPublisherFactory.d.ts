import { AxiosInstance } from 'axios';
import { EventPublisher } from './EventPublisher';
export declare class EventPublisherFactory {
    private httpClient;
    private hostUrl;
    private static cachedEventPublisher;
    constructor(httpClient: AxiosInstance, hostUrl: string);
    getEventPublisher(shouldPublishEvents: boolean): EventPublisher;
}
