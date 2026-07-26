import { BaseEventBuilder } from '../builders/BaseEventBuilder';
import { EventType } from './enums/EventType';
import { EventData } from './EventData';
export declare class BaseEvent {
    merchantOrderId: string;
    eventName: EventType;
    eventTime: number;
    data: EventData;
    constructor(merchantOrderId: string, eventName: EventType, eventTime: number, data: EventData);
    static builder(): BaseEventBuilder;
}
