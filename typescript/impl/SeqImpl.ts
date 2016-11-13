/**
 * Created by Bruno Grieder on 29 05 2015.
 */

import {Iterator} from '../API/Iterator'
import {Iterable} from '../API/Iterable'
import {Seq} from '../API/Seq'
import {iterable} from './IterableImpl'
import {iterator} from './IteratorImpl'
import {MonadImpl} from './MonadImpl'
import {eq} from './Utils'


export class SeqImpl<A> extends MonadImpl<A> implements Seq<A> {

    /**
     * Sets the default caching behaviour of sequences
     * @see useCache() for an explanation
     */
    public static caching: boolean = false


    protected _isCaching: boolean

    constructor( it: Iterable<A>, useCache?: boolean ) {
        super( it )
        this._isCaching = (typeof useCache !== 'undefined' ? useCache : SeqImpl.caching)
    }

    protected newInstance<U>( it: Iterable<U>, useCache?: boolean ): Seq<U> {
        return new SeqImpl( it, useCache )
    }


    /**
     * Whether the sequence is using a cache
     * @see useCache() foe an explanation
     * @see disableCache()
     * @see caching
     */
    get isCaching() {
        return this._isCaching
    }


    /**
     * Calling useCache() will cause subsequent operations on the sequence to cache results to speed up operations
     * at the expense of a higher memory usage.
     *
     * Caching is disabled by default but the default behaviour can be changed by setting
     * the static <code>Seq.caching</code> parameter to <code>true</code>
     *
     * Caches are usually used by operations performed at the end of the sequence e.g. calling
     * <code>takeLast(n)</code>, <code>dropLast(n)</code> or at the beginning of the sequence when calling
     * <code>reverse()</code> e.g. <code>takeFirst(n).reverse()</code> or <code>takeFirst(n).reverse()</code>
     *
     * Calling <code>toArray()</code> will cache the result into the <code>value</code> parameter of the sequence
     *
     * @see disableCache()
     * @see isCaching
     */
    useCache() {
        this._isCaching = true
    }

    /**
     * Calling disableCache() will prevent some operations on the list to cache results to speed up operations
     * hence limiting the memory usage.
     *
     * @see useCache() for a detailed explanation
     * @see isCaching
     */
    disableCache() {
        this._isCaching = false
    }

    /**
     * Builds a new sequence by applying a function to all elements of this sequence.
     */
    map<U>( f: ( value: A ) => U ): Seq<U> { return super.map( f ) as Seq<U>}

    flatten<U>(): Seq<U> { return super.flatten() as Seq<U> }

    flatMap<U>( f: ( value: A ) => Seq<U> ): Seq<U> { return super.flatMap( f ) as Seq<U> }

    filter( f: ( value: A ) => boolean ): Seq<A> { return super.filter( f ) as Seq<A> }

    //
    /**
     * Tests whether this sequence is empty.
     */
    isEmpty(): boolean {
        return this.length === 0 || ((this.length === -1) && !(this.isForward ? this.fit() : this.bit()).iterate())
    }


    /**
     * Builds a new sequence with all the elements of this sequence which do not specify a predicate.
     */
    filterNot( f: ( value: A ) => boolean ): Seq<A> {
        return this.filter( ( value: A ) => !f( value ) )
    }


    /**
     * Returns a new <code>Seq</code> with content iterating in the reverse order
     * note: If the Seq does not have a reverse Iterator, <code>reverse()</code> is a very costly operation in O^2/2
     */
    reverse(): Seq<A> {

        if ( this.isBackward ) {
            return this.newInstance( iterable( this.bit, this.isForward ? this.fit : undefined, this.length ) )
        }
        else if ( this.isForward ) {

            const getNIterator = ( nit: () => Iterator<A> ): Iterator<A> => {

                let next = this.size() - 1;
                let value: A;

                return iterator<A>(
                    () => {

                        if ( next === -1 ) {
                            return false
                        }

                        const it = nit();
                        let index = 0;
                        while ( index <= next ) {
                            it.iterate()
                            index++
                        }
                        value = it.current()
                        //console.log(" value: "+value)
                        next--
                        return true
                    },
                    () => value
                )
            };

            const nfit: () => Iterator<A> = this.isForward ? () => getNIterator( this.fit ) : undefined;
            const nbit: () => Iterator<A> = this.isBackward ? () => getNIterator( this.bit ) : undefined;
            return this.newInstance<A>( iterable( nfit, nbit, this.length ) )
        }
        else {
            throw "Sequence cannot be iterated"
        }
    }


    private _takeBuilder( n: number ): [( fit: Iterator<A> ) => Iterator<A>,( bit: Iterator<A> ) => Iterator<A>] {

        const getFIterator = ( it: Iterator<A> ): Iterator<A> => {
            let counter = 0;
            return iterator<A>(
                () => (counter++) < n && it.iterate(),
                () => it.current()
            )
        };

        const getBIterator = ( it: Iterator<A> ): Iterator<A> => {

            let hasSkipped = false;

            return iterator<A>(
                () => {
                    if ( !hasSkipped ) {
                        const len = this._size( true );
                        let counter = 0;
                        while ( counter++ < (len - n) ) { it.iterate() }
                        hasSkipped = true
                    }
                    return it.iterate()
                },
                () => it.current()
            )
        };
        return [ getFIterator, getBIterator ]
    }


    /**
     * Builds a new sequence made of the first n elements
     * Same as take()
     * @see take()
     */
    takeFirst( n: number ): Seq<A> {

        const its = this._takeBuilder( n );

        const nfit: () => Iterator<A> = this.isForward ? () => its[ 0 ]( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => its[ 1 ]( this.bit() ) : undefined;
        const len = (this._length >= 0 ? Math.min( this._length, n ) : -1);
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * Builds a new sequence made of the first n elements
     * Identical to takeFirst()
     * @see takeFirst()
     */
    take = this.takeFirst

    /**
     * Builds a new sequence made of the last n elements
     * Same as take()
     * @see take()
     */
    takeLast( n: number ): Seq<A> {

        const its = this._takeBuilder( n );

        const nfit: () => Iterator<A> = this.isForward ? () => its[ 1 ]( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => its[ 0 ]( this.bit() ) : undefined;
        const len = (this._length >= 0 ? Math.min( this._length, n ) : -1);
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }


    /**
     * Selects an element by its index in the sequence iterating forward
     * Throws if not found
     * Same as apply()
     * @see apply()
     */
    takeAt( index: number ): A {

        const res = this._takeAt( index );
        if ( res[ 0 ] ) {
            return res[ 1 ]
        }
        throw( "getAt: index out of bounds: " + index )
    }

    protected _takeAt( index: number ): [boolean, A] {

        const it = this.fit();
        let idx = -1;
        let len = 0;
        while ( it.iterate() ) {
            len++
            if ( ++idx == index ) {
                return [ true, it.current() ]
            }
        }
        this._length = len
        return [ false, undefined ]
    }

    /**
     * Selects an element by its index in the sequence iterating forward
     * Throws if not found
     * Same as takeAt()
     * @see takeAt
     */
    apply = this.takeAt

    /**
     * Selects an element by its index in the sequence iterating forward
     * Evaluates <code>elseVal</code> if not found
     * Same as applyOrElse
     * @see applyOrElse
     */
    takeAtOrElse( index: number, elseVal: ( index: number ) => A ): A {

        const res = this._takeAt( index );
        if ( res[ 0 ] ) {
            return res[ 1 ]
        }
        return elseVal( index )
    }

    /**
     * Selects an element by its index in the sequence iterating forward
     * Evaluates <code>elseVal</code> if not found
     * Same as getAtOrElse
     * @see takeAtOrElse
     */
    applyOrElse = this.takeAtOrElse


    /**
     * Returns a new sequence containing the elements of this sequence
     * followed by the elements of <code>it</code>.
     */
    concat( it: Iterable<A> ): Seq<A> {

        const nfit: () => Iterator<A> = this.isForward && it.fit ? () => this.fit().concat( it.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward && it.bit ? () => it.bit().concat( this.bit() ) : undefined;
        const len = (this._length < 0 || it.length < 0 ? -1 : this._length + it.length);
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * A new sequence containing <code>a</code> followed by the elements of this sequence
     */
    prepend( a: A ): Seq<A> {

        const eit = (): Iterator<A> => {

            let hasNext = true;
            return iterator(
                () => {
                    if ( hasNext ) {
                        hasNext = false
                        return true
                    }
                    return false
                },
                () => hasNext ? undefined : a
            )
        };

        const nfit: () => Iterator<A> = this.isForward ? () => eit().concat( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => this.bit().concat( eit() ) : undefined;
        const len = this._length < 0 ? -1 : this._length + 1;
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * A new sequence containing the elements of this sequence followed by <code>a</code>
     * Identical to push()
     * @see push()
     */
    append( a: A ): Seq<A> {
        const eit = (): Iterator<A> => {

            let hasNext = true;
            return iterator(
                () => {
                    if ( hasNext ) {
                        hasNext = false
                        return true
                    }
                    return false
                },
                () => hasNext ? undefined : a
            )
        };

        const nfit: () => Iterator<A> = this.isForward ? () => this.fit().concat( eit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => eit().concat( this.bit() ) : undefined;
        const len = this._length < 0 ? -1 : this._length + 1;
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * A new sequence containing the elements of this sequence followed by <code>a</code>
     * Identical to append()
     * @see append
     */
    push = this.append

    /**
     * Whether this <code>Seq</code> contains a value
     * Warning: equality is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    contains( value: A ): boolean {
        return this.indexOf( value ) !== -1
    }

    /**
     * Returns the index of an element iterating forward
     * Returns -1 otherwise
     * Warning: equality is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    indexOf( value: A ): number {

        if ( this._length === 0 ) {
            return -1
        }

        const it = this.fit();
        let index = -1;

        while ( it.iterate() ) {
            ++index
            const current = it.current();
            if ( eq( current, value ) ) {
                return index
            }
        }
        this._length = index + 1
        return -1
    }


    /**
     * Tests whether the function <code>test</code> returns <code>true</code> for any value in the sequence
     */
    exists( test: ( value: A ) => boolean ): boolean {
        const it = this.fit();
        let len = 0;
        while ( it.iterate() ) {
            len++
            if ( test( it.current() ) ) {
                return true
            }
        }
        this._length = len
        return false
    }

    /**
     * Tests whether every element of this sequence relates to the corresponding element of another sequence by satisfying a test predicate.
     */
    corresponds<B>( other: Seq<B>, test: ( thisVal: A, otherVal: B ) => boolean ): boolean {
        const it = this.fit();
        const oit = other.fit();
        let len = 0;
        while ( it.iterate() ) {
            len++
            if ( !oit.iterate() ) {
                return false
            }
            if ( !test( it.current(), oit.current() ) ) {
                return false
            }
        }
        this._length = len
        return true
    }

    /**
     * Counts the number of elements in the <code>Seq</code> which satisfies a test.
     */
    count( test: ( value: A ) => boolean ): number {
        const it = this.fit();
        let count = 0;
        let len = 0;
        while ( it.iterate() ) {
            len++
            if ( test( it.current() ) ) {
                count++
            }
        }
        this._length = len
        return count
    }


    private _dropBuilder( n: number ): [( fit: Iterator<A> ) => Iterator<A>,( bit: Iterator<A> ) => Iterator<A>] {

        const getFIterator = ( it: Iterator<A> ): Iterator<A> => {
            let index = -1;
            while ( ++index < n && it.iterate() ) { }
            return iterator<A>(
                () => it.iterate(),
                () => it.current()
            )
        };

        const getBIterator = ( it: Iterator<A> ): Iterator<A> => {
            const buffer: A[] = [];
            let index = -1;
            while ( ++index < n && it.iterate() ) {
                buffer.push( it.current() )
            }
            let hasMore = false;
            return iterator<A>(
                () => hasMore = it.iterate(),
                () => {
                    if ( hasMore ) {
                        buffer.push( it.current() )
                        return buffer.shift()
                    }
                    throw 'drop: no such element'
                }
            )
        };
        return [ getFIterator, getBIterator ]
    }

    /**
     * Builds a new sequence with all elements except the first n ones
     * (iterating forward)
     */
    dropFirst( n: number ): Seq<A> {
        const getIts = this._dropBuilder( n );
        const nfit: () => Iterator<A> = this.isForward ? () => getIts[ 0 ]( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => getIts[ 1 ]( this.bit() ) : undefined;
        const len = (this.length < 0 ? -1 : Math.max( 0, this.length - n ));
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * Builds a new sequence with all elements except the last n ones
     * (iterating forward)
     */
    dropLast( n: number ): Seq<A> {
        const getIts = this._dropBuilder( n );
        const nfit: () => Iterator<A> = this.isForward ? () => getIts[ 1 ]( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => getIts[ 0 ]( this.bit() ) : undefined;
        const len = (this.length < 0 ? -1 : Math.max( 0, this.length - n ));
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }


    /**
     * Builds a new sequence dropping the longest prefix of elements that satisfy the test
     * (iterating forward)
     */
    dropWhile( test: ( value: A ) => boolean ): Seq<A> {

        const getFIterator = ( it: Iterator<A> ): Iterator<A> => {
            let value: A;
            let drop: boolean;
            let initialRun = true;
            let hasNext = it.iterate();
            if ( hasNext ) {
                do {
                    value = it.current()
                    drop = test( value )
                    if ( drop ) {
                        hasNext = it.iterate()
                    }
                }
                while ( drop && hasNext )
            }
            return iterator<A>(
                () => {
                    if ( initialRun ) {
                        initialRun = false
                    }
                    else {
                        hasNext = it.iterate()
                        value = hasNext ? it.current() : undefined
                    }
                    return hasNext
                },
                () => value
            )
        };


        //FIXME: backward iterator uses a buffer. Should only be enabled if useCache is true
        const getBIterator = ( it: Iterator<A> ): Iterator<A> => {
            let buffer: A[] = [];
            let temp: A[] = [];
            let hasNext = false;
            let value: A;
            return iterator<A>(
                () => {
                    if ( buffer.length > 0 ) {
                        //anything in buffer, iterate over that first
                        hasNext = true
                        return true
                    }
                    else {
                        hasNext = it.iterate()
                        if ( hasNext ) {
                            do {
                                value = it.current()
                                var drop = test( value )
                                if ( drop ) {
                                    temp.push( value )
                                    hasNext = it.iterate()
                                }
                            }
                            while ( drop && hasNext )
                            if ( hasNext ) {
                                //value does not test, push temp to buffer + push value
                                buffer = temp
                                buffer.push( value )
                                temp = []
                            }
                        }
                    }
                    return hasNext
                },
                () => {
                    if ( hasNext ) {
                        return buffer.shift()
                    }
                    else {
                        throw("dropWhile: no such element")
                    }
                }
            )
        };

        const nfit: () => Iterator<A> = this.isForward ? () => getFIterator( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => getBIterator( this.bit() ) : undefined;
        return this.newInstance<A>( iterable( nfit, nbit, -1 ) )
    }

    /**
     * Removes elements from the sequence corresponding to the given indexes iterating forward
     * and returns a new sequence of the removed elements.
     *
     * WARNING: calling <code>dropAt()</code> followed by <code>reverse()</code>
     * will result in a call to <code>size()</code> which will iterate the whole sequence if
     * the length of the sequence is unknown
     */
    dropAt( ...indexes: number[] ): Seq<A> {

        const getFIterator = (): Iterator<A> => {

            let index: number = -1;
            let ids: number[];
            if ( indexes.length == 0 ) {
                return this.fit()
            }
            else if ( indexes.length == 1 ) {
                ids = indexes.slice()
            }
            else {
                ids = indexes.slice().sort( ( a, b ) => a - b ) //asc
            }
            let hasNext: boolean;
            const it = this.fit();

            //fetch first valid index
            let i: number;
            do { i = ids.shift() }
            while ( i < 0 )

            return iterator<A>(
                () => {
                    let drop: boolean;
                    do {
                        hasNext = it.iterate()
                        if ( typeof i !== 'undefined' && hasNext ) {
                            ++index
                            drop = index === i
                            if ( drop ) {
                                i = ids.shift()
                                if ( this._length > 0 ) { this._length = this._length - 1}
                            }
                        }
                        else {
                            drop = false
                        }
                    }
                    while ( hasNext && drop )
                    return hasNext
                },
                () => it.current()
            )
        };

        const getBIterator = (): Iterator<A> => {
            let index: number = -1;
            let ids: number[];
            if ( indexes.length == 0 ) {
                return this.bit()
            }
            else if ( indexes.length == 1 ) {
                ids = indexes.slice()
            }
            else {
                ids = indexes.slice().sort( ( a, b ) => b - a ) //desc
            }
            let hasNext: boolean;
            const it = this.bit();
            const len = this._size( true );

            //fetch first valid index
            let i: number;
            do { i = ids.shift() }
            while ( i > len - 1 )

            return iterator<A>(
                () => {
                    let drop: boolean;
                    do {
                        hasNext = it.iterate()
                        if ( typeof i !== 'undefined' && hasNext ) {
                            ++index
                            const revIndex = len - 1 - index;
                            drop = revIndex === i
                            if ( drop ) {
                                i = ids.shift()
                                if ( this._length > 0 ) { this._length = this._length - 1}
                            }
                        }
                        else {
                            drop = false
                        }
                    }
                    while ( hasNext && drop )
                    return hasNext
                },
                () => it.current()
            )
        };

        let len: number;
        if ( this._length < 0 ) {
            len = -1
        }
        else {
            len = Math.max( this._length - indexes.reduce( ( acc, i ) => acc + ( i < this._length ? 1 : 0 ), 0 ), 0 )
        }

        return this.newInstance<A>( iterable(
            this.isForward ? () => getFIterator() : undefined,
            this.isBackward ? () => getBIterator() : undefined,
            len
        ) )
    }

    /**
     * Computes the difference/intersection of this sequence with another sequence.
     * Contrarily to <code>diff()</code>, <code>difference()</code> will remove duplicates e.g.
     * the difference of (1,2,3,1) with (1) is (2,3). The two '1' elements are removed
     * @see diff()
     */
    difference( other: Seq<A> ): Seq<A> {

        const getIterator = ( it: Iterator<A>, backward ?: boolean ): Iterator<A> => {

            if ( other.length === 0 ) {
                return it
            }

            let value: A;
            let hasNext: boolean;
            let len = 0;
            return iterator<A>(
                () => {
                    hasNext = it.iterate()
                    let drop: boolean;
                    if ( hasNext ) {
                        len++
                        do {
                            value = it.current()
                            drop = backward ? other.reverse().contains( value ) : other.contains( value )
                            if ( drop ) {
                                hasNext = it.iterate()
                                if ( hasNext ) {
                                    len++
                                }
                            }
                        }
                        while ( drop && hasNext )
                    }
                    if ( hasNext ) {
                        return true
                    }
                    else {
                        this._length = len
                        return false
                    }
                },
                () => value
            )
        };

        let len: number;
        if ( this._length < 0 ) {
            len = -1
        }
        else {
            if ( other.length === 0 ) {
                len = this._length
            }
            else {
                len = -1
            }
        }

        const nfit: () => Iterator<A> = this.isForward ? () => getIterator( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => getIterator( this.bit(), true ) : undefined;
        return this.newInstance<A>( iterable( nfit, nbit, len ) )
    }

    /**
     * Computes the difference/intersection of this sequence with another sequence.
     * Contrarily to <code>difference()</code>, <code>diff()</code> will <em>not</em> remove duplicates e.g.
     * the diff() of (1,2,3,1) with (1) is (2,3,1). only the first '1' is removed
     * @see difference()
     */
    diff( other: Seq<A> ): Seq<A> {


        const getIterator = ( it: Iterator<A> ): Iterator<A> => {

            if ( other.length === 0 ) {
                return it
            }

            let len = 0;
            let value: A;
            let hasNext: boolean;
            let newOther: Seq<A> = other;
            return iterator<A>(
                () => {
                    hasNext = it.iterate()
                    if ( hasNext ) {
                        len++
                        do {
                            value = it.current()
                            var drop: number
                            if ( other.length === 0 ) {
                                drop = -1
                            }
                            else {
                                drop = newOther.indexOf( value )
                                if ( drop > -1 ) {
                                    (function ( drop: number ) {
                                        newOther = newOther.dropAt( drop )
                                    })( drop )
                                    hasNext = it.iterate()
                                    if ( hasNext ) {
                                        len++
                                    }
                                }
                            }
                        }
                        while ( (drop > -1) && hasNext )
                    }
                    if ( hasNext ) {
                        return true
                    }
                    else {
                        this._length = len
                        return false
                    }
                },
                () => value
            )
        };

        let len: number;
        if ( this._length < 0 ) {
            len = -1
        }
        else {
            if ( other.length === 0 ) {
                len = this._length
            }
            else {
                len = -1
            }
        }

        return this.newInstance<A>( iterable<A>(
            this.isForward ? () => getIterator( this.fit() ) : undefined,
            undefined, //TODO: diff: is it possible to build a reverse iterator without caching?
            len
        ) )
    }

    /**
     * Builds a new sequence from this sequence without any duplicate elements.
     */
    distinct(): Seq<A> {

        const getIterator = ( it: Iterator<A>, backward ?: boolean ): Iterator<A> => {

            if ( this._length === 0 || this._length === 1 ) {
                return it
            }

            let value: A;
            let hasNext: boolean;
            let len = 0;
            return iterator<A>(
                () => {
                    hasNext = it.iterate()
                    let drop: boolean;
                    if ( hasNext ) {
                        if ( ++len === 1 ) {
                            value = it.current()
                            return true
                        }
                        do {
                            value = it.current()
                            drop = backward ? this.reverse().takeFirst( len - 1 ).contains( value ) : this.takeFirst( len - 1 ).contains( value )
                            if ( drop ) {
                                hasNext = it.iterate()
                                if ( hasNext ) {
                                    len++
                                }
                            }
                        }
                        while ( drop && hasNext )
                    }
                    if ( hasNext ) {
                        return true
                    }
                    else {
                        this._length = len
                        return false
                    }
                },
                () => value
            )
        };

        let len: number;
        if ( this._length === 0 || this._length === 1 ) {
            len = this._length
        }
        else {
            len = -1
        }

        return this.newInstance<A>( iterable<A>(
            this.isForward ? () => getIterator( this.fit() ) : undefined,
            undefined, //TODO: distinct: is it possible to build a reverse iterator without caching?,
            len
        ) )

    }

    private _startsEndsWith(): [( thisIt: Iterator<A>, otherIt: Iterator<A> )=>boolean,( thisIt: Iterator<A>, otherIt: Iterator<A> )=>boolean] {

        const thisEndIt = ( thisIt: Iterator<A>, otherIt: Iterator<A> ): boolean => {

            let thisHasNext: boolean;
            let otherHasNext: boolean;
            let equals: boolean;
            do {
                thisHasNext = thisIt.iterate()
                otherHasNext = otherIt.iterate()
                equals = (thisHasNext && otherHasNext && eq( thisIt.current(), otherIt.current() ))
            }
            while ( thisHasNext && otherHasNext && equals )

            return !otherHasNext
        };

        const otherEndIt = ( thisIt: Iterator<A>, otherIt: Iterator<A> ): boolean => {

            const otherHasNext = otherIt.iterate();
            let index = -1;


            if ( otherHasNext ) {
                //FIXME: Algorithm needs review
                throw new Error('Algorithm not implemented for backward iterator')
                // const firstVal = otherIt.current();
                // //find first val in tit
                // while ( thisIt.iterate() ) {
                //     index++
                //     if ( eq( thisIt.current(), firstVal ) ) {
                //         const itToTest = thisIt.slice( index );
                //         if ( thisIt.equals( otherIt ) ) {
                //             return true
                //         }
                //         //keep searching
                //     }
                // }
                // //not found on tit - return false
                // return false
            }
            else {
                //it is an empty sequence, return true
                return true
            }
        };
        return [ thisEndIt, otherEndIt ]
    }


    /**
     * Tests whether this sequence ends with content ot the iterable
     */
    endsWith( it: Iterable<A> ): boolean {

        const [thisEndIt, otherEndIt] = this._startsEndsWith()

        if ( this.isBackward && it.bit ) {

            return thisEndIt( this.bit(), it.bit() )
        }
        else if ( this.isForward && it.fit ) {

            return otherEndIt( this.fit(), it.fit() )
        }
        throw "The two iterables do not iterate in the same direction"
    }

    /**
     * Tests whether this sequence starts with content ot the iterable
     */
    startsWith( it: Iterable<A> ): boolean {

        var [thisEndIt, otherEndIt] = this._startsEndsWith()

        if ( this.isForward && it.fit ) {

            return thisEndIt( this.fit(), it.fit() )
        }
        else if ( this.isBackward && it.bit ) {

            return otherEndIt( this.bit(), it.bit() )
        }
        throw "The two iterables do not iterate in the same direction"
    }

    // containsSlice( it: Iterable<A> ): boolean {
    //
    //     if ( this.isForward && it.fit ) {
    //
    //             const firstVal = otherIt.current();
    //             //find first val in tit
    //             while ( thisIt.iterate() ) {
    //                 index++
    //                 if ( eq( thisIt.current(), firstVal ) ) {
    //                     const seqToTest = this.slice( index );
    //                     if ( seqToTest.equals( otherIt ) ) {
    //                         return true
    //                     }
    //                     //keep searching
    //                 }
    //             }
    //             //not found on tit - return false
    //             return false
    //     }
    //     else if ( this.isBackward && it.bit ) {
    //
    //         return otherEndIt( this.bit(), it.bit() )
    //     }
    //     throw "The two iterables do not iterate in the same direction"
    //
    //
    // }


    /**
     * Builds a new sequence containing the elements
     * starting at index <code>from</code> included until index <code>until</code> excluded
     *
     * When <code>from</code> is not specified, <code>from</code> is defaulted to <code>0</code>
     *
     * When <code>until</code> is not specified all elements until the end of this sequence
     * are appended to the new sequence
     *
     * <code>slice()</code> returns a shallow copy of this sequence
     */
    slice( from?: number, until?: number ): Seq<A> {

        const fr = from ? from : 0;

        const getFit = ( it: Iterator<A> ): Iterator<A> => {

            let to: number;
            let sliced = false;
            let index = 0;

            return iterator(
                () => {
                    let hasNext: boolean;
                    if ( !sliced ) {
                        to = until ? until - 1 : Infinity
                        while ( index < fr && (hasNext = it.iterate()) ) {
                            index++
                        }
                        sliced = true
                    }
                    return (index++ <= to) ? it.iterate() : false
                },
                () => it.current()
            )
        };

        const getBit = ( it: Iterator<A> ): Iterator<A> => {

            let sliced = false;
            let index: number;

            return iterator(
                () => {
                    let hasNext: boolean;
                    if ( !sliced ) {
                        const len = this._size( true );
                        const to = (until ? Math.min( until, len ) : len ) - 1;
                        index = len - 1
                        while ( index > to && (hasNext = it.iterate()) ) {
                            index--
                        }
                        sliced = true
                    }
                    return (index-- >= fr) ? it.iterate() : false
                },
                () => it.current()
            )
        };

        const nfit: () => Iterator<A> = this.isForward ? () => getFit( this.fit() ) : undefined;
        const nbit: () => Iterator<A> = this.isBackward ? () => getBit( this.bit() ) : undefined;
        const len = this._length < 0 ? -1 : (until ? Math.min( until, this._length ) : this._length ) - Math.max( fr, 0 );
        return this.newInstance<A>( iterable( nfit, nbit, len ) )

    }


}


/**
 * Create a Seq from one or two iterators and optionally specify its length
 */
export function seq<A>( fit?: () => Iterator<A>, bit?: () =>Iterator<A>, length?: number ): Seq<A> {

    let hasIt = false;

    let _fit: () => Iterator<A>;
    if ( typeof fit === 'undefined' ) {
        _fit = (): Iterator<A> => { throw('No Iterator') }
    }
    else {
        _fit = fit
        hasIt = true
    }

    let _bit: () => Iterator<A>;
    if ( typeof bit === 'undefined' ) {
        _bit = (): Iterator<A> => { throw('No Iterator') }
    }
    else {
        _bit = bit
        hasIt = true
    }

    if ( !hasIt ) {
        throw( "Seq: cannot instantiate: no iterators" )
    }

    return new SeqImpl( iterable( _fit, _bit, length ) )
}

/**
 * Create a seq from a list ov values
 */
export function aseq<A>( ...vals: A[] ): Seq<A> {

    const fit = () => {
        let index = -1;
        const len = vals.length;
        return iterator(
            () => ++index < len,
            () => vals[ index ]
        )
    };

    const bit = () => {
        let index = vals.length;
        return iterator(
            () => (--index >= 0),
            () => vals[ index ]
        )
    };

    return fseq( iterable( fit, bit ) )
}


/**
 * Create a Seq from an Iterable
 */
export function fseq<A>( it: Iterable<A> ): Seq<A> {
    return seq( it.fit, it.bit, it.length )
}





