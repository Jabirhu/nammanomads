import { BaseEvent } from './BaseEvent';
export declare class BulkEvent {
    events: BaseEvent[];
    source: string;
    clientVersion: string;
    constructor(events: BaseEvent[], source: string, clientVersion: string);
    static builder: () => BulkEventBuilder;
}
declare class BulkEventBuilder {
    private _events;
    private _source;
    private _clientVersion;
    events: (eventList: BaseEvent[]) => this;
    source: (source: string) => this;
    clientVersion: (clientVersion: string) => this;
    build: () => BulkEvent;
}
export {};
