type EventArgs<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [void] ? [] : [T];

declare class EventEmitter<EventTypes> {
    private callbacks;
    private init;
    private checkListener;
    hasEvent(event: string): boolean;
    listeners(): {
        [event: string]: ((...args: any[]) => void | Promise<void>)[];
    };
    addListener<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): EventEmitter<EventTypes>;
    clearListener<EventName extends keyof EventTypes>(event?: EventName): EventEmitter<EventTypes>;
    on<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): EventEmitter<EventTypes>;
    off<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): EventEmitter<EventTypes>;
    emit<EventName extends keyof EventTypes>(event: EventName, ...args: EventArgs<EventTypes[EventName]>): boolean | Promise<boolean>;
    once<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): EventEmitter<EventTypes>;
}

declare const version: string;

export { type EventArgs, EventEmitter, version };
