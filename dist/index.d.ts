type EventArgs<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [void] ? [] : [T];

declare class EventEmitter<EventTypes> {
    private callbacks;
    private static version;
    private init;
    get version(): string;
    listeners(): {
        [event: string]: ((...args: any[]) => void)[];
    };
    addListener<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void): EventEmitter<EventTypes>;
    on<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void): EventEmitter<EventTypes>;
    off<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void): EventEmitter<EventTypes>;
    emit<EventName extends keyof EventTypes>(event: EventName, ...args: EventArgs<EventTypes[EventName]>): boolean;
    once<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void): EventEmitter<EventTypes>;
}

export { type EventArgs, EventEmitter as default };
