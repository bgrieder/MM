/**
 * Created by Bruno Grieder.
 */

import {Iterator} from '../API/Iterator'
import {Iterable} from '../API/Iterable'
import {Monad} from '../API/Monad'
import {IterableImpl, iterable} from './IterableImpl'
import {iterator} from './IteratorImpl'

export class MonadImpl<A> extends IterableImpl<A> implements Monad<A> {

    private _isForward: boolean
    private _isBackward: boolean

    constructor( it: Iterable<A> ) {
        super( it.fit, it.bit, it.length, it.fArray )

        if ( !(this._isForward = (typeof it.fit !== 'undefined')) ) {
            this._fit = (): Iterator<A> => { throw "No forward iterator" }
        }
        if ( !(this._isBackward = (typeof it.bit !== 'undefined')) ) {
            this._bit = (): Iterator<A> => { throw "No backward iterator" }
        }
    }

    protected _size( backward?: boolean ): number {

        if ( this._length >= 0 ) {
            return this._length
        }
        let it = backward ? this.bit() : this.fit()
        if ( !!it ) {
            let count = 0
            while ( it.iterate() ) {
                count++
            }
            this._length = count
            return count
        }
        throw "size: no iterators"
    }


    /**
     * Whether the sequence can be iterated forward
     * @see isBackward()
     */
    get isForward() {
        return this._isForward
    }

    /**
     * Whether the sequence can be iterated backward
     * @see isForward()
     */
    get isBackward() {
        return this._isBackward
    }


    public map<U>( f: ( value: A ) => U ): Monad<U> {

        const getNIterator = ( it: Iterator<A> ): Iterator<U> => iterator<U>(
            () => it.iterate(),
            () => f( it.current() )
        )

        const nfit: () => Iterator<U> = this.isForward ? () => getNIterator( this.fit() ) : undefined
        const nbit: () => Iterator<U> = this.isBackward ? () => getNIterator( this.bit() ) : undefined
        return this.newInstance<U>( iterable( nfit, nbit, this.length ) )
    }

    /**
     * Converts this sequence of iterables into a sequence formed by the elements of the iterables.
     * e.g. Seq( Seq(1,2), Seq(3,4) ).flatten() = Seq(1,2,3,4)
     */
    public flatten<U>(): Monad<U> {


        const getNIterator = ( it: Iterator<A>, forward: boolean ): Iterator<U> => {

            let usingMain = true
            let current: U = undefined
            let subIt: Iterator<U>
            let len = 0

            const iterateInMain = (): boolean => {

                const hasNext = it.iterate()
                if ( hasNext ) {

                    const val: any = it.current()
                    if ( val instanceof IterableImpl ) {
                        //switch to sub iterator
                        const iterable = (<Iterable<U>>val)
                        const hasSubIt = forward ? iterable.fit : iterable.bit
                        if ( hasSubIt ) {
                            usingMain = false
                            subIt = hasSubIt()
                            current = undefined
                            return iterateInSub()
                        }
                        else {
                            return iterateInMain()
                        }
                    }
                    else {
                        len++
                        current = val
                        return true
                    }
                }
                else {
                    //done
                    current = undefined
                    this._length = len
                    return false
                }
            }

            const iterateInSub = (): boolean => {

                const hasNext = subIt.iterate()
                if ( hasNext ) {
                    len++
                    current = subIt.current()
                    return true
                }
                else {
                    //switch back to main
                    usingMain = true
                    return iterateInMain()
                }

            }

            return iterator(
                () => (usingMain ? iterateInMain() : iterateInSub()),
                () => { return current}
            )
        }

        const nfit: () => Iterator<U> = this.isForward ? () => getNIterator( this.fit(), true ) : undefined
        const nbit: () => Iterator<U> = this.isBackward ? () => getNIterator( this.bit(), false ) : undefined
        return this.newInstance<U>( iterable( nfit, nbit, -1 ) )
    }


    /**
     * Builds a new monad by applying a function to all elements of this monad.
     * Contrarily to <code>map()</code>, the function is expected to return a sequence
     *
     * Calling <code>flatMap(f)</code> is identical to calling <code>map(f).flatten()</code>
     *
     * @see map()
     */
    flatMap<U>( f: ( value: A ) => Monad<U> ): Monad<U> {
        return this.map<Monad<U>>( f ).flatten<U>()
    }

    /**
     * Calculates the size of this sequence iterating forward if its <code>length</code> is unknown
     * otherwise returns its <code>length</code>
     *
     * The <code>length</code> parameter will be set with result of calling <code>size()</code>
     */
    size(): number {
        return this._size( !this.isForward )
    }

    /**
     * Builds a new monad with all the elements of this monad which satisfy a predicate.
     */
    public filter( f: ( value: A ) => boolean ): Monad<A> {

        let len = 0

        const getNIterator = ( it: Iterator<A> ): Iterator<A> => {

            let current: A = undefined
            return iterator<A>(
                () => {
                    let match = false
                    let hasNext: boolean
                    while ( !match && (hasNext = it.iterate()) ) {
                        const v = it.current()
                        match = f( v )
                        if ( match ) {
                            current = v
                            len++
                        }
                        else {
                            current = undefined
                        }
                    }
                    if ( !hasNext ) {
                        this._length = len
                    }
                    return match
                },
                () => {
                    if ( current ) {
                        return current
                    }
                    else {
                        throw new Error( 'no such element' )
                    }
                }
            )
        }

        const nfit: () => Iterator<A> = this.isForward ? () => getNIterator( this.fit() ) : undefined
        const nbit: () => Iterator<A> = this.isBackward ? () => getNIterator( this.bit() ) : undefined
        return this.newInstance<A>( iterable( nfit, nbit, -1 ) )

    }

    protected newInstance<U>( it: Iterable<U> ): Monad<U> {
        return new MonadImpl( it )
    }
}