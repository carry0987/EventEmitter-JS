import { describe, beforeEach, test, expect, vi } from 'vitest';
import { EventEmitter } from '../src/index';
import { Events } from './interface/event';

describe('EventEmitter', () => {
    let emitter: EventEmitter<Events>;

    function maybeAwait(result: boolean | Promise<boolean>): Promise<boolean> {
        return result instanceof Promise ? result : Promise.resolve(result);
    }

    beforeEach(() => {
        emitter = new EventEmitter<Events>();
    });

    test('should add and emit an event (async)', async () => {
        const callback = vi.fn();
        emitter.on('event1', callback);

        await emitter.emit('event1', 'test');

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should emit an event (sync)', () => {
        const callback = vi.fn();
        emitter.on('event1', callback);

        emitter.emit('event1', 'test');

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should remove a listener (async)', async () => {
        const callback = vi.fn();
        emitter.on('event1', callback);
        emitter.off('event1', callback);

        await emitter.emit('event1', 'test');

        expect(callback).not.toHaveBeenCalled();
    });

    test('should remove a listener (sync)', () => {
        const callback = vi.fn();
        emitter.on('event1', callback);
        emitter.off('event1', callback);

        emitter.emit('event1', 'test');

        expect(callback).not.toHaveBeenCalled();
    });

    test('should add and emit multiple events (async)', async () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        emitter.on('event1', callback1);
        emitter.on('event2', callback2);

        await emitter.emit('event1', 'test');
        await emitter.emit('event2', 123);

        expect(callback1).toHaveBeenCalledWith('test');
        expect(callback2).toHaveBeenCalledWith(123);
    });

    test('should add and emit multiple events (sync)', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        emitter.on('event1', callback1);
        emitter.on('event2', callback2);

        emitter.emit('event1', 'test');
        emitter.emit('event2', 123);

        expect(callback1).toHaveBeenCalledWith('test');
        expect(callback2).toHaveBeenCalledWith(123);
    });

    test('should clear all listeners (async)', async () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        emitter.on('event1', callback1);
        emitter.on('event2', callback2);
        
        emitter.clearListener();

        await emitter.emit('event1', 'test');
        await emitter.emit('event2', 123);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
    });

    test('should clear all listeners (sync)', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        emitter.on('event1', callback1);
        emitter.on('event2', callback2);
        
        emitter.clearListener();

        emitter.emit('event1', 'test');
        emitter.emit('event2', 123);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
    });

    test('should add and emit a once event (async)', async () => {
        const callback = vi.fn();
        emitter.once('event1', callback);

        await emitter.emit('event1', 'test');
        await emitter.emit('event1', 'test');

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should add and emit a once event (sync)', () => {
        const callback = vi.fn();
        emitter.once('event1', callback);

        emitter.emit('event1', 'test');
        emitter.emit('event1', 'test');

        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not emit if there are no listeners (async)', async () => {
        const result = await emitter.emit('event1', 'test');
        const resolvedResult = await maybeAwait(result);
        expect(resolvedResult).toBe(false);
    });

    test('should not emit if there are no listeners (sync)', () => {
        const result = emitter.emit('event1', 'test');
        expect(result).toBe(false);
    });

    test('should have event when it exists', () => {
        const callback = vi.fn();
        emitter.on('event1', callback);

        expect(emitter.hasEvent('event1')).toBe(true);
    });

    test('should not have event when it does not exist', () => {
        expect(emitter.hasEvent('event1')).toBe(false);
    });
});
