class EventEmitter {
    // Initialize callbacks with an empty object
    callbacks = {};
    static version = '1.0.0';
    init(event) {
        if (event && !this.callbacks[event]) {
            this.callbacks[event] = [];
        }
    }
    get version() {
        return EventEmitter.version;
    }
    listeners() {
        return this.callbacks;
    }
    addListener(event, listener) {
        return this.on(event, listener);
    }
    on(event, listener) {
        this.init(event);
        this.callbacks[event].push(listener);
        return this;
    }
    off(event, listener) {
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
        // If there are callbacks for this event
        if (this.callbacks[eventName].length > 0) {
            this.callbacks[eventName].forEach((value) => value(...args));
            return true;
        }
        return false;
    }
    once(event, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(event, onceListener);
        };
        return this.on(event, onceListener);
    }
}

export { EventEmitter as default };
