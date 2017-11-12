export interface Iterator<A> {
    next(): {
        done: boolean;
        value?: A;
    };
}
export interface Iterable<A> {
    [Symbol.iterator](): Iterator<A>;
    length?: number;
    reverseIterator?: () => Iterator<A>;
}
