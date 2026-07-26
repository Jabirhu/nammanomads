import { BaseEvent } from './models/BaseEvent';
export declare class EventQueueHandler {
    queue: BaseEvent[];
    maxSize: number;
    private mutex;
    constructor(maxSize: number);
    add: (event: BaseEvent) => Promise<void>;
    isEmpty: () => boolean;
    size: () => number;
    poll: () => Promise<BaseEvent | undefined>;
}
