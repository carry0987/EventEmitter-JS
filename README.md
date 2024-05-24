# EventEmitter-JS
[![NPM](https://img.shields.io/npm/v/@carry0987/event-emitter.svg)](https://www.npmjs.com/package/@carry0987/event-emitter)  
`EventEmitter` is a TypeScript library that provides a simple yet powerful event-handling mechanism. It allows you to define and manage events in your application, supporting standard event operations such as `on`, `off`, `emit`, `once`, and more.

## Features
- Lightweight and easy to use
- Type-safe event handling
- Support for one-time event listeners with `once`
- Flexible event management

## Installation
To install the `EventEmitter` library, use the following command:

```bash
npm i @carry0987/event-emitter --save-dev
```

## Usage

### Importing the Library
First, import the `EventEmitter` class into your TypeScript file:

```typescript
import { EventEmitter } from '@carry0987/event-emitter';
```

### Defining Event Types
Define your event types for type safety. For example:

```typescript
interface MyEvents {
    greet: [string];
    farewell: [string];
}
```

### Creating an EventEmitter Instance
Create an instance of `EventEmitter` with your event types:

```typescript
const emitter = new EventEmitter<MyEvents>();
```

### Adding Event Listeners
Use the `on` method to add event listeners:

```typescript
emitter.on('greet', (message) => {
    console.log(message);
});
```

### Emitting Events
Emit events using the `emit` method:

```typescript
emitter.emit('greet', 'Hello, world!');
```

### Removing Event Listeners
Remove event listeners with the `off` method:

```typescript
const greetListener = (message: string) => {
    console.log(message);
};

emitter.on('greet', greetListener);
emitter.off('greet', greetListener);
```

### One-time Event Listeners
Use the `once` method to add a listener that will be called only once:

```typescript
emitter.once('farewell', (message) => {
    console.log(message);
});

emitter.emit('farewell', 'Goodbye, world!'); // Listener will be called
emitter.emit('farewell', 'Goodbye again!');  // Listener will not be called
```

## API

### `on(event: EventName, listener: (...args: any[]) => void): EventEmitter`
Registers an event listener for the specified event.

### `off(event: EventName, listener: (...args: any[]) => void): EventEmitter`
Removes the specified event listener.

### `emit(event: EventName, ...args: any[]): boolean`
Emits the specified event, calling all registered listeners with the provided arguments.

### `once(event: EventName, listener: (...args: any[]) => void): EventEmitter`
Registers a one-time event listener for the specified event. The listener will be called at most once after being added.

### `listeners(): { [event: string]: ((...args: any[]) => void)[] }`
Returns an object containing all registered event listeners.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
