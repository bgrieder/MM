import { Option } from './Option';
export declare class Try<A> {
    static from<A>(value: any): Try<A>;
    private readonly _computation;
    private _result;
    private _failed;
    protected constructor(computation: (...args: any[]) => A);
    private compute();
    private computeThrow();
    collect<B>(filter: () => boolean): (mapper: (value: A) => B) => Try<B>;
    readonly failed: Try<Error>;
    filter(f: () => boolean): Try<A>;
    flatMap<U>(f: (value: A) => Try<U>): Try<U>;
    flatten<U>(): Try<U>;
    fold<U>(ffailure: (e: Error) => U, fsuccess: (vale: A) => U): U;
    foreach(f: (value: A) => void): void;
    readonly get: A;
    getOrElse<U>(elseVal: () => U): A | U;
    readonly isFailure: boolean;
    readonly isSuccess: boolean;
    map<U>(f: (value: A) => U): Try<U>;
    orElse<U>(f: () => Try<U>): Try<A | U>;
    recover<U>(fn: (e: Error) => U): Try<A | U>;
    recoverWith<U>(fn: (e: Error) => Try<U>): Try<A | U>;
    readonly toOption: Option<A>;
    readonly toPromise: Promise<A>;
    transform<U>(ffailure: (e: Error) => Try<U>, fsuccess: (vale: A) => Try<U>): Try<U>;
}
export declare function tri<A>(computation: () => A): Try<A>;
