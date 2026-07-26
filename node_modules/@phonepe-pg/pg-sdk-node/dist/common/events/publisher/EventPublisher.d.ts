import { BaseEvent } from '../models/BaseEvent';
export declare abstract class EventPublisher {
    abstract setAuthTokenSupplier(authTokenSupplier: () => Promise<string>): void;
    abstract startPublishingEvents(authTokenSupplier: () => Promise<string>): void;
    abstract send(event: BaseEvent): void;
}
