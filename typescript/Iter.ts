/**
 * Created by Bruno Grieder.
 */


//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
export interface Iterator<A> {
    next(): {
        done: boolean
        value?: A
    }
}

export interface Iterable<A> {
    [Symbol.iterator](): Iterator<A>
    length?: number
    reverseIterator?: () => Iterator<A>
}

