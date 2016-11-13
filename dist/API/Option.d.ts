import { Seq } from './Seq';
export interface Option<A> extends Seq<A> {
    get(): A;
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
