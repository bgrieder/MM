import { Iterable } from './API/Iterable';
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
export declare function eq<A>(a: A, b: A): boolean;
export declare class IterableImpl<A> implements Iterable<A> {
    protected _fit: () => Iterator<A>;
    protected _bit: () => Iterator<A>;
    protected _length: number;
    protected _fArray: () => A[];
    constructor(it: Iterable<A>);
    readonly fit: () => Iterator<A>;
    readonly bit: () => Iterator<A>;
    readonly length: number;
    toArray(): A[];
    equals(other: Iterable<A>): boolean;
}
export declare function iterable<A>(fit?: () => Iterator<A>, bit?: () => Iterator<A>, length?: number, toArray?: () => A[]): Iterable<A>;
export declare function fiterable<A>(it: Iterable<A>): Iterable<A>;
