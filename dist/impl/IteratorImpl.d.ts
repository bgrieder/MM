import { Iterator } from '../API/Iterator';
export declare class IteratorImpl<A> implements Iterator<A> {
    private _iterate;
    private _current;
    constructor(iterate: () => boolean, current: () => A);
    iterate(): boolean;
    current(): A;
    concat(otherIt: Iterator<A>): Iterator<A>;
    equals(otherIt: Iterator<A>): boolean;
}
export declare function iterator<A>(iterate: () => boolean, current: () => A): Iterator<A>;
export declare function fiterator<A>(iterator: Iterator<A>): Iterator<A>;
