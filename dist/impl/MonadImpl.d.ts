import { Iterable } from '../API/Iterable';
import { Monad } from '../API/Monad';
import { IterableImpl } from './IterableImpl';
export declare class MonadImpl<A> extends IterableImpl<A> implements Monad<A> {
    private _isForward;
    private _isBackward;
    constructor(it: Iterable<A>);
    protected _size(backward?: boolean): number;
    readonly isForward: boolean;
    readonly isBackward: boolean;
    map<U>(f: (value: A) => U): Monad<U>;
    flatten<U>(): Monad<U>;
    flatMap<U>(f: (value: A) => Monad<U>): Monad<U>;
    size(): number;
    filter(f: (value: A) => boolean): Monad<A>;
    protected newInstance<U>(it: Iterable<U>): Monad<U>;
}
