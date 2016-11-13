/**
 * Created by Bruno Grieder on 25 05 2015.
 */
"use strict";
function eq(a, b) {
    if (typeof b === 'object') {
        var feq = b['equals'];
        return (feq && feq.call(b, a)) || (a === b);
    }
    return (a === b);
}
exports.eq = eq;
////////////////////////////////////////////////////////////////////////////
///
/// ITERABLE
///
////////////////////////////////////////////////////////////////////////////
var IterableImpl = (function () {
    function IterableImpl(it) {
        this._fit = it.fit;
        this._bit = it.bit;
        this._length = it.length;
        this._fArray = it.fArray;
    }
    Object.defineProperty(IterableImpl.prototype, "fit", {
        //protected newInstance<U>( it: Iterable<U>, ...args: any[] ): Iterable<U> {
        //    return new Iterable( it )
        //}
        get: function () { return this._fit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IterableImpl.prototype, "bit", {
        get: function () { return this._bit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IterableImpl.prototype, "length", {
        get: function () { return this._length < 0 ? -1 : this._length; },
        enumerable: true,
        configurable: true
    });
    IterableImpl.prototype.toArray = function () {
        //if ( typeof this._fArray === 'undefined' ) {
        var counter = 0;
        var v = [];
        var it = this.fit();
        while (it.iterate()) {
            counter++;
            v.push(it.current());
        }
        this._length = counter;
        //this._fArray = () => v
        //}
        //return this._fArray()
        return v;
    };
    /**
     * Tests whether all elements are equal in each iterable iterating forward
     * Equality of elements is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    IterableImpl.prototype.equals = function (other) {
        var it = this.fit();
        var oit = other.fit();
        var len = 0;
        var hasNext = it.iterate();
        var otherHasNext = oit.iterate();
        while (hasNext && otherHasNext) {
            len++;
            var v = it.current();
            var o = oit.current();
            if (!eq(v, o)) {
                return false;
            }
            hasNext = it.iterate();
            otherHasNext = oit.iterate();
        }
        if (!hasNext) {
            this._length = len;
            return !otherHasNext;
        }
        return false;
    };
    return IterableImpl;
}());
exports.IterableImpl = IterableImpl;
function iterable(fit, bit, length, toArray) {
    return new IterableImpl({
        fit: fit,
        bit: bit,
        length: (typeof length !== 'undefined' ? length : -1),
        toArray: toArray
    });
}
exports.iterable = iterable;
function fiterable(it) {
    return new IterableImpl(it);
}
exports.fiterable = fiterable;
////////////////////////////////////////////////////////////////////////////
///
/// MONAD
///
////////////////////////////////////////////////////////////////////////////
//export interface BaseMonad<A> extends Iterable<A> {
//
//    map<U>( f: ( value: A ) => U ): BaseMonad<U>;
//
//    flatMap<U>( f: ( value: A ) => BaseMonad<U> ): BaseMonad<U>
//
//    flatten<U>():BaseMonad<U>
//
//    filter( f: ( value: A ) => boolean ): BaseMonad<A>
//
//    /**
//     * Will return the length if known, otherwise will
//     * fully iterate the content to determine it.
//     *
//     * Once <code>size()</code> has been called, <code>length</code>
//     * will contain the same value<code>undefined</code>
//     */
//    size(): number
//
//}
//export class BaseMonadImpl<A> extends IterableImpl<A> implements BaseMonad<A> {
//
//    protected newInstance<U>( it: Iterable<U>, ...args: any[] ): BaseMonad<U> {
//        return new BaseMonadImpl( it )
//    }
//
//    public map<U>( f: ( value: A ) => U ): BaseMonad<U> {
//
//        var getNIterator = ( it: Iterator<A> ): Iterator<U> => iterator<U>(
//            () => it.iterate(),
//            () => f( it.current() )
//        )
//
//        var nfit: () => Iterator<U> = ()=> this.fit ? getNIterator( this.fit() ) : throwIterator<U>()
//        var nbit: () => Iterator<U> = ()=> this.bit ? getNIterator( this.bit() ) : throwIterator<U>( true )
//        return this.newInstance<U>( iterable( nfit, nbit, this.length ) )
//    }
//
//    public filter( f: ( value: A ) => boolean ): BaseMonad<A> {
//
//        var len = 0
//
//        var getNIterator = ( it: Iterator<A> ): Iterator<A> => {
//
//            var current: A = undefined
//            return iterator<A>(
//                () => {
//                    var match = false
//                    var hasNext
//                    while ( !match && (hasNext = it.iterate()) ) {
//                        var v = it.current()
//                        match = f( v )
//                        if ( match ) {
//                            current = v
//                            len++
//                        }
//                        else {
//                            current = undefined
//                        }
//                    }
//                    if ( !hasNext ) {
//                        this._length = len
//                    }
//                    return match
//                },
//                () => {
//                    if ( current ) {
//                        return current
//                    }
//                    else {
//                        throw new Error( 'no such element' )
//                    }
//                }
//            )
//        }
//
//        var nfit: () => Iterator<A> = ()=> this.fit ? getNIterator( this.fit() ) : throwIterator<A>()
//        var nbit: () => Iterator<A> = ()=> this.bit ? getNIterator( this.bit() ) : throwIterator<A>( true )
//        return this.newInstance<A>( iterable( nfit, nbit, -1 ) )
//
//    }
//
//    public flatten<U>(): BaseMonad<U> {
//
//
//        var getNIterator = ( it: Iterator<A>, forward: boolean ): Iterator<U> => {
//
//            var usingMain = true
//            var current: U = undefined
//            var subIt: Iterator<U>
//            var len = 0
//
//            var iterateInMain = (): boolean => {
//
//                var hasNext = it.iterate()
//                if ( hasNext ) {
//
//                    var val: any = it.current()
//                    if ( val instanceof IterableImpl ) {
//                        //switch to sub iterator
//                        var iterable = (<Iterable<U>>val)
//                        var hasSubIt = forward ? iterable.fit : iterable.bit
//                        if ( hasSubIt ) {
//                            usingMain = false
//                            subIt = hasSubIt()
//                            current = undefined
//                            return iterateInSub()
//                        }
//                        else {
//                            return iterateInMain()
//                        }
//                    }
//                    else {
//                        len++
//                        current = val
//                        return true
//                    }
//                }
//                else {
//                    //done
//                    current = undefined
//                    this._length = len
//                    return false
//                }
//            }
//
//            var iterateInSub = (): boolean => {
//
//                var hasNext = subIt.iterate()
//                if ( hasNext ) {
//                    len++
//                    current = subIt.current()
//                    return true
//                }
//                else {
//                    //switch back to main
//                    usingMain = true
//                    return iterateInMain()
//                }
//
//            }
//
//            return iterator(
//                () => (usingMain ? iterateInMain() : iterateInSub()),
//                () => { return current}
//            )
//        }
//
//        var nfit: () => Iterator<U> = ()=> this.fit ? getNIterator( this.fit(), true ) : throwIterator<U>()
//        var nbit: () => Iterator<U> = ()=> this.bit ? getNIterator( this.bit(), false ) : throwIterator<U>( true )
//        return this.newInstance<U>( iterable( nfit, nbit, -1 ) )
//    }
//
//    public flatMap<U>( f: ( value: A ) => BaseMonad<U> ): BaseMonad<U> {
//        return this.map<BaseMonad<U>>( f ).flatten<U>()
//    }
//
//
//    size(): number {
//        return this._size()
//    }
//
//    protected _size( backward?: boolean ): number {
//        if ( this.length >= 0 ) {
//            return this.length
//        }
//        var it = backward ? this.bit() : this.fit()
//        if ( !!it ) {
//            var count = 0
//            while ( it.iterate() ) {
//                count++
//            }
//            this._length = count
//            return count
//        }
//        throw "size: no iterators"
//    }
//}
