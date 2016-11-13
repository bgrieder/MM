import { Iterable } from './Iterable';
import { Seq } from './Seq';
export interface List<A> extends Seq<A> {
    get(): A[];
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
    push(a: A): List<A>;
}
