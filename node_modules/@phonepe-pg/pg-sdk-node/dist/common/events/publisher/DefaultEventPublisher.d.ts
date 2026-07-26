import { BaseEvent } from '../models/BaseEvent';
import { EventPublisher } from './EventPublisher';
export declare class DefaultEventPublisher extends EventPublisher {
    setAuthTokenSupplier(authTokenSupplier: () => Promise<string>): void;
    startPublishingEvents(authTokenSupplier: () => Promise<string>): void;
    send(event: BaseEvent): void;
}
