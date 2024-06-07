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

    public emit<EventName extends keyof EventTypes>(
        event: EventName,
        ...args: EventArgs<EventTypes[EventName]>
    ): boolean | Promise<boolean> {
        const eventName = event as string;

        // Initialize the event
        this.init(eventName);

        // If there are no callbacks, return false
        if (this.callbacks[eventName].length <= 0) {
            return false;
        }

        // Get all results
        const results = this.callbacks[eventName].map(callback => {
            try {
                // Execute callback and capture the result
                const result = callback(...args);
                // If result is a promise, wrap it in Promise.resolve to handle uniformly
                return result instanceof Promise ? result : Promise.resolve(result);
            } catch (e) {
                console.error(`Error in event listener for event: ${eventName}`, e); // Logging error
                // Even if an error occurs, continue processing other callbacks
                return Promise.resolve();
            }
        });

        // Check if any result is a promise
        const hasPromise = results.some(result => result instanceof Promise);

        // If there is at least one promise, return a promise that resolves when all promises resolve
        if (hasPromise) {
            return Promise.all(results).then(() => true).catch((e) => {
                console.error(`Error handling promises for event: ${eventName}`, e); // Logging error
                return false;
            });
        } else {
            // If no promises, return true
            return true;
        }
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
