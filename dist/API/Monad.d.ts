import { Iterable } from './Iterable';
export interface Monad<A> extends Iterable<A> {
    isForward: boolean;
    isBackward: boolean;
    map<U>(f: (value: A) => U): Monad<U>;
    flatMap<U>(f: (value: A) => Monad<U>): Monad<U>;
    flatten<U>(): Monad<U>;
    filter(f: (value: A) => boolean): Monad<A>;
    size(): number;
}
