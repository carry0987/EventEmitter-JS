import { EventArgs } from '../type/types';

class EventEmitter<EventTypes> {
    // Initialize callbacks with an empty object
    private callbacks: { [event: string]: ((...args: any[]) => void | Promise<void>)[] } = {};

    private init(event?: string): void {
        if (event && !this.callbacks[event]) {
            this.callbacks[event] = [];
        }
    }

    private checkListener(listener: (...args: any[]) => void | Promise<void>): void {
        if (typeof listener !== 'function') {
            throw new TypeError('The listener must be a function');
        }
    }

    public hasEvent(event: string): boolean {
        return this.callbacks[event] !== undefined;
    }

    public listeners(): { [event: string]: ((...args: any[]) => void | Promise<void>)[] } {
        return this.callbacks;
    }

    public addListener<EventName extends keyof EventTypes>(
        event: EventName,
        listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>
    ): EventEmitter<EventTypes> {
        return this.on(event, listener);
    }

    public clearListener<EventName extends keyof EventTypes>(event?: EventName): EventEmitter<EventTypes> {
        if (event) {
            this.callbacks[event as string] = [];
        } else {
            this.callbacks = {};
        }

        return this;
    }

    public on<EventName extends keyof EventTypes>(
        event: EventName,
        listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>
    ): EventEmitter<EventTypes> {
        this.checkListener(listener);

        this.init(event as string);
        this.callbacks[event as string].push(listener);

        return this;
    }

    public off<EventName extends keyof EventTypes>(
        event: EventName,
        listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>
    ): EventEmitter<EventTypes> {
        this.checkListener(listener);

        const eventName = event as string;

        this.init();

        if (!this.callbacks[eventName] || this.callbacks[eventName].length === 0) {
            // There is no callbacks with this key
            return this;
        }

        this.callbacks[eventName] = this.callbacks[eventName].filter(
            (value) => value != listener
        );

        return this;
    }

    public async emit<EventName extends keyof EventTypes>(
        event: EventName,
        ...args: EventArgs<EventTypes[EventName]>
    ): Promise<boolean> {
        const eventName = event as string;

        // Initialize the event
        this.init(eventName);

        // If there are callbacks for this event
        if (this.callbacks[eventName].length > 0) {
            // Execute all callbacks and wait for them to complete if they are promises
            await Promise.all(this.callbacks[eventName].map(async (value) => await value(...args)));
            return true;
        }

        return false;
    }

    public once<EventName extends keyof EventTypes>(
        event: EventName,
        listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>
    ): EventEmitter<EventTypes> {
        this.checkListener(listener);

        const onceListener = async (...args: EventArgs<EventTypes[EventName]>) => {
            await listener(...args);
            this.off(event, onceListener);
        };

        return this.on(event, onceListener);
    }
}

export { EventEmitter };
