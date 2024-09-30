type EventArgs<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [void] ? [] : [T];

declare class EventEmitter<EventTypes> {
    private callbacks;
    /**
     * Initializes the callbacks for a given event. If the event does not already have
     * an entry in the callbacks object, a new empty array is created for it.
     * @param event - The name of the event to initialize. If not provided, it checks
     *                 for undefined events and initializes them if needed.
     */
    private init;
    /**
     * Checks if a listener is a valid function. Throws a TypeError if the listener
     * is not a function.
     * @param listener - The listener to check. Should be a function that either returns void
     *                   or a Promise that resolves to void.
     */
    private checkListener;
    /**
     * Checks whether a specific event has been registered within the emitter.
     * @param event - The name of the event to check for existence.
     * @returns A boolean indicating whether the event exists in the callbacks.
     */
    hasEvent(event: string): boolean;
    /**
     * Retrieves all the listeners currently registered to the emitter.
     * @returns An object containing all registered events and their associated listeners.
     *          Each key is a string representing the event name, mapping to an array of
     *          listener functions.
     */
    listeners(): {
        [event: string]: ((...args: any[]) => void | Promise<void>)[];
    };
    /**
     * Adds a listener function for the specified event. This method is an alias for the
     * `on` method, purely for semantic purposes.
     * @param event - The name of the event to listen to.
     * @param listener - The function to invoke when the event is emitted. Can be asynchronous.
     * @returns The instance of the EventEmitter for method chaining.
     */
    addListener<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): this;
    /**
     * Clears all listeners for a specific event or, if no event is provided, clears all
     * listeners for all events.
     * @param event - Optional. The name of the event whose listeners should be cleared.
     *                If omitted, all event listeners are cleared.
     * @returns The instance of the EventEmitter for method chaining.
     */
    clearListener<EventName extends keyof EventTypes>(event?: EventName): this;
    /**
     * Adds a listener for a specific event type. Initializes the event if it's not already
     * present and ensures the listener is valid.
     * @param event - The name of the event to listen to.
     * @param listener - The function to call when the event is emitted. Can return a promise.
     * @returns The instance of the EventEmitter for method chaining.
     */
    on<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): this;
    /**
     * Removes a listener from a specific event. If no listener is provided, all listeners
     * for the event are removed.
     * @param event - The name of the event to remove a listener from.
     * @param listener - Optional. The specific listener to remove. If not provided, all
     *                   listeners for the event are removed.
     * @returns The instance of the EventEmitter for method chaining.
     */
    off<EventName extends keyof EventTypes>(event: EventName, listener?: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): this;
    /**
     * Emits an event, invoking all registered listeners for that event with the provided
     * arguments. If any listener returns a promise, the method itself will return a promise
     * that resolves when all listeners have been processed.
     * @param event - The name of the event to emit.
     * @param args - Arguments to pass to each listener when invoked.
     * @returns A boolean or a promise resolving to a boolean indicating if listeners were
     *          successfully called and resolved/ran without error.
     */
    emit<EventName extends keyof EventTypes>(event: EventName, ...args: EventArgs<EventTypes[EventName]>): boolean | Promise<boolean>;
    /**
     * Adds a listener for a specific event that will only be invoked once. After the first
     * invocation, the listener will be automatically removed.
     * @param event - The name of the event to listen to once.
     * @param listener - The function to invoke once when the event is emitted.
     * @returns The instance of the EventEmitter for method chaining.
     */
    once<EventName extends keyof EventTypes>(event: EventName, listener: (...args: EventArgs<EventTypes[EventName]>) => void | Promise<void>): this;
}

declare const version: string;

export { type EventArgs, EventEmitter, version };
