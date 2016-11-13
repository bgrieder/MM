import { Iterable } from './Iterable';
import { Seq } from './SeqImpl';
export declare class Option<A> extends Seq<A> {
    constructor(it: Iterable<A>);
    protected newInstance<U>(it: Iterable<U>, ...args: any[]): Some<U>;
    get(): A;
    private _get();
    isEmpty(): boolean;
    getOrElse<U>(elseVal: () => U): A | U;
    getOrNull(): A;
    getOrUndefined(): A;
    map<U>(f: (value: A) => U): Option<U>;
    fold<U>(ifEmpty: () => U, f: (value: A) => U): U;
    filter(f: (value: A) => boolean): Option<A>;
    flatten<U>(): Option<U>;
    flatMap<U>(f: (value: A) => Option<U>): Option<U>;
    filterNot(test: (value: A) => boolean): Option<A>;
    exists(test: (value: A) => boolean): boolean;
    forAll(test: (value: A) => boolean): boolean;
    forEach<U>(f: (value: A) => U): void;
    collect<U>(partialFunction: {
        someFn?: (value: A) => U;
    }): Option<U>;
    orElse(alternative: () => Option<A>): Option<A>;
    equals(option: Option<A>): boolean;
}
export declare class Some<A> extends Option<A> {
}
export declare class None extends Option<any> {
}
export declare function some<A>(val?: A): Some<A>;
export declare function fsome<A>(it: Iterable<A>): Some<A>;
export declare function none(): None;
