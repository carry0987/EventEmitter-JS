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
    async emit(event, ...args) {
        const eventName = event;
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
    once(event, listener) {
        this.checkListener(listener);
        const onceListener = async (...args) => {
            await listener(...args);
            this.off(event, onceListener);
        };
        return this.on(event, onceListener);
    }
}

const version = '1.3.0';

export { EventEmitter, version };
