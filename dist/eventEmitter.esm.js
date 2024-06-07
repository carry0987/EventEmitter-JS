class EventEmitter {
    // Initialize callbacks with an empty object
    callbacks = {};
    init(event) {
        if (event && !this.callbacks[event]) {
            this.callbacks[event] = [];
        }
    }
    checkListener(listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('The listener must be a function');
        }
    }
    hasEvent(event) {
        return this.callbacks[event] !== undefined;
    }
    listeners() {
        return this.callbacks;
    }
    addListener(event, listener) {
        return this.on(event, listener);
    }
    clearListener(event) {
        if (event) {
            this.callbacks[event] = [];
        }
        else {
            this.callbacks = {};
        }
        return this;
    }
    on(event, listener) {
        this.checkListener(listener);
        this.init(event);
        this.callbacks[event].push(listener);
        return this;
    }
    off(event, listener) {
        this.checkListener(listener);
        const eventName = event;
        this.init();
        if (!this.callbacks[eventName] || this.callbacks[eventName].length === 0) {
            // There is no callbacks with this key
            return this;
        }
        this.callbacks[eventName] = this.callbacks[eventName].filter((value) => value != listener);
        return this;
    }
    emit(event, ...args) {
        const eventName = event;
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
            }
            catch (e) {
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
        }
        else {
            // If no promises, return true
            return true;
        }
    }
    once(event, listener) {
        this.checkListener(listener);
        const onceListener = (...args) => {
            // Use a sync wrapper to ensure the listener is removed immediately after execution
            const result = listener(...args);
            // Remove the listener immediately
            this.off(event, onceListener);
            // Handle async listeners by wrapping the result in Promise.resolve
            return result instanceof Promise ? result : Promise.resolve(result);
        };
        return this.on(event, onceListener);
    }
}

const version = '1.4.0';

export { EventEmitter, version };
