import { Iterator } from './API/Iterator';
export declare class IteratorImpl<A> implements Iterator<A> {
    private _iterate;
    private _current;
    constructor(iterator: Iterator<A>);
    iterate(): boolean;
    current(): A;
}
export declare function iterator<A>(iterate: () => boolean, current: () => A): Iterator<A>;
export declare function fiterator<A>(iterator: Iterator<A>): Iterator<A>;
export declare function concat<A>(firstIt: Iterator<A>, secondIt: Iterator<A>): Iterator<A>;
