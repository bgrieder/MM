import { Iterator } from '../API/Iterator';
import { Iterable } from '../API/Iterable';
export declare class IterableImpl<A> implements Iterable<A> {
    protected _fit: () => Iterator<A>;
    protected _bit: () => Iterator<A>;
    protected _length: number;
    protected _fArray: () => A[];
    constructor(fit?: () => Iterator<A>, bit?: () => Iterator<A>, length?: number, fArray?: () => A[]);
    readonly fit: () => Iterator<A>;
    readonly bit: () => Iterator<A>;
    readonly length: number;
    readonly fArray: () => A[];
    toArray(): A[];
    equals(other: Iterable<A>): boolean;
}
export declare function iterable<A>(fit?: () => Iterator<A>, bit?: () => Iterator<A>, length?: number, toArray?: () => A[]): Iterable<A>;
export declare function fiterable<A>(it: Iterable<A>): Iterable<A>;
