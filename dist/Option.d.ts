/// <reference types="node" />
import { Collection } from './Collection';
export declare class Option<A> extends Collection<A> {
    static from<A>(optVal: any): Option<A>;
    collect<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    collectFirst<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    exists(p: (value: A) => boolean): boolean;
    filter(f: (value: A) => boolean): Option<A>;
    filterNot(f: (value: A) => boolean): Option<A>;
    find(p: (value: A) => boolean): Option<A>;
    flatMap<U>(f: (value: A) => Option<U>): Option<U>;
    flatten<U>(): Option<U>;
    forall(p: (value: A) => boolean): boolean;
    foreach(f: (value: A) => void): void;
    readonly get: A;
    getOrElse<U>(elseVal: () => U): A | U;
    readonly headOption: Option<A>;
    readonly isDefined: boolean;
    readonly last: A;
    readonly lastOption: Option<A>;
    map<U>(f: (value: A) => U): Option<U>;
    readonly nonEmpty: boolean;
    orElse(alternative: () => Option<A>): Option<A>;
    readonly orNull: A;
    orThrow(message: () => string): A;
    readonly orUndefined: A;
    readonly toPromise: Promise<A>;
}
export declare function some<A>(value: A): Option<A>;
export declare function none(): Option<any>;
export declare function option<A>(value: A | Iterable<A>): Option<A>;
