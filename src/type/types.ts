export type EventArgs<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [void] ? [] : [T];
