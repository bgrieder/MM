import { Iterable } from '../API/Iterable';
import { SeqImpl } from './SeqImpl';
export declare class List<A> extends SeqImpl<A> {
    constructor(it: Iterable<A>);
    protected newInstance<U>(it: Iterable<U>, ...args: any[]): List<U>;
    get: () => A[];
    map<U>(f: (value: A) => U): List<U>;
    filter(f: (value: A) => boolean): List<A>;
    flatten<U>(): List<U>;
    flatMap<U>(f: (value: A) => List<U>): List<U>;
    size(): number;
    takeFirst(n: number): List<A>;
    reverse(): List<A>;
    concat(it: Iterable<A>): List<A>;
    prepend(a: A): List<A>;
    append(a: A): List<A>;
    push: (a: A) => List<A>;
}
export declare function list<A>(...vals: A[]): List<A>;
export declare function array<A>(array: A[]): List<A>;
export declare function flist<A>(it: Iterable<A>): List<A>;
