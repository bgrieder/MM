/**
 * Created by Bruno Grieder.
 */

import {Iterator} from '../API/Iterator'
import {eq} from './Utils'

export class IteratorImpl<A> implements Iterator<A> {

    private _iterate: () => boolean
    private _current: () => A

    constructor( iterate: () => boolean, current: () => A ) {
        this._iterate = () => iterate()
        this._current = () => current()
    }

    public iterate(): boolean { return this._iterate() }

    public current(): A { return this._current()}

    concat( otherIt: Iterator<A> ): Iterator<A> {
        let useLeft = true;
        return iterator<A>(
            () => {
                if ( useLeft ) {
                    if ( this.iterate() ) {
                        return true
                    }
                    else {
                        useLeft = false
                        return otherIt.iterate()
                    }
                }
                else {
                    return otherIt.iterate()
                }
            },
            () => useLeft ? this.current() : otherIt.current()
        )
    }

    equals( otherIt: Iterator<A> ): boolean {
        let len = 0;
        let hasNext = this.iterate();
        let otherHasNext = otherIt.iterate();
        while ( hasNext && otherHasNext ) {
            len++
            const v = this.current();
            const o = otherIt.current();
            if ( !eq( v, o ) ) {
                return false
            }
            hasNext = this.iterate()
            otherHasNext = otherIt.iterate()
        }
        if ( !hasNext ) {
            return !otherHasNext
        }
        return false
    }
}


export function iterator<A>( iterate: () => boolean, current: () => A ): Iterator<A> {
    return new IteratorImpl( iterate, current )
}

//noinspection JSUnusedGlobalSymbols
export function fiterator<A>( iterator: Iterator<A> ): Iterator<A> {
    return new IteratorImpl( iterator.iterate, iterator.current )
}


