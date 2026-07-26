import { BaseEvent } from '../models/BaseEvent';
import { EventType } from '../models/enums/EventType';
import { EventData } from '../models/EventData';
export declare class BaseEventBuilder {
    private _merchantOrderId;
    private _eventName;
    private _eventTime;
    private _data;
    /**
     * SETTERS
     **/
    setMerchantOrderId: (merchantOrderId: string) => this;
    setEventName: (eventName: EventType) => this;
    setEventTime: (eventTime: number) => this;
    setData: (data: EventData) => this;
    build: () => BaseEvent;
}
