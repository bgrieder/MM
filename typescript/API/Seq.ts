/**
 * Created by Bruno Grieder.
 */

import { Iterable } from './Iterable'
import {Monad} from './Monad'

/**
 * Sequences are iterable collections that always have a defined order of elements
 */
export interface Seq<A> extends Monad<A> {

    /**
     * Whether the sequence is using a cache
     * @see useCache() foe an explanation
     * @see disableCache()
     * @see caching
     */
    isCaching:boolean


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
    useCache(): void

    /**
     * Calling disableCache() will prevent some operations on the list to cache results to speed up operations
     * hence limiting the memory usage.
     *
     * @see useCache() for a detailed explanation
     * @see isCaching
     */
    disableCache(): void

    /**
     * Tests whether this sequence is empty.
     */
    isEmpty(): boolean

    /**
     * Builds a new sequence by applying a function to all elements of this sequence.
     */
    map<U>( f: ( value: A ) => U ): Seq<U>

    /**
     * Builds a new sequence with all the elements of this sequence which satisfy a predicate.
     */
    filter( f: ( value: A ) => boolean ): Seq<A>

    /**
     * Builds a new sequence with all the elements of this sequence which do not specify a predicate.
     */
    filterNot( f: ( value: A ) => boolean ): Seq<A>

    /**
     * Converts this sequence of iterables into a sequence formed by the elements of the iterables.
     * e.g. Seq( Seq(1,2), Seq(3,4) ).flatten() = Seq(1,2,3,4)
     */
    flatten<U>(): Seq<U>

    /**
     * Builds a new sequence by applying a function to all elements of this sequence.
     * Contrarily to <code>map()</code>, the function is expected to return a sequence
     *
     * Calling <code>flatMap(f)</code> is identical to calling <code>map(f).flatten()</code>
     *
     * @see map()
     */
    flatMap<U>( f: ( value: A ) => Seq<U> ): Seq<U>

    /**
     * Calculates the size of this sequence iterating forward if its <code>length</code> is unknown
     * otherwise returns its <code>length</code>
     *
     * The <code>length</code> parameter will be set with result of calling <code>size()</code>
     */
    size(): number

    /**
     * Returns a new <code>Seq</code> with content iterating in the reverse order
     * note: If the Seq does not have a reverse Iterator, <code>reverse()</code> is a very costly operation in O^2/2
     */
    reverse(): Seq<A>

    /**
     * Builds a new sequence made of the first n elements
     * Same as take()
     * @see take()
     */
    takeFirst( n: number ): Seq<A>

    /**
     * Builds a new sequence made of the first n elements
     * Identical to takeFirst()
     * @see takeFirst()
     */
    take( n: number ): Seq<A>

    /**
     * Builds a new sequence made of the last n elements
     * Same as take()
     * @see take()
     */
    takeLast( n: number ): Seq<A>

    /**
     * Selects an element by its index in the sequence iterating forward
     * Throws if not found
     * Same as apply()
     * @see apply()
     */
    takeAt( index: number ): A

    /**
     * Selects an element by its index in the sequence iterating forward
     * Throws if not found
     * Same as takeAt()
     * @see takeAt
     */
    apply( index: number ): A

    /**
     * Selects an element by its index in the sequence iterating forward
     * Evaluates <code>elseVal</code> if not found
     * Same as applyOrElse
     * @see applyOrElse
     */
    takeAtOrElse( index: number, elseVal: ( index: number ) => A ): A

    /**
     * Selects an element by its index in the sequence iterating forward
     * Evaluates <code>elseVal</code> if not found
     * Same as getAtOrElse
     * @see takeAtOrElse
     */
    applyOrElse( index: number, elseVal: ( index: number ) => A ): A

    /**
     * Returns a new sequence containing the elements of this sequence
     * followed by the elements of <code>it</code>.
     */
    concat( it: Iterable<A> ): Seq<A>

    /**
     * A new sequence containing <code>a</code> followed by the elements of this sequence
     */
    prepend( a: A ): Seq<A>

    /**
     * A new sequence containing the elements of this sequence followed by <code>a</code>
     * Identical to push()
     * @see push()
     */
    append( a: A ): Seq<A>

    /**
     * A new sequence containing the elements of this sequence followed by <code>a</code>
     * Identical to append()
     * @see append
     */
    push( a: A ): Seq<A>

    /**
     * Whether this <code>Seq</code> contains a value
     * Warning: equality is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    contains( value: A ): boolean

    /**
     * Returns the index of an element iterating forward
     * Returns -1 otherwise
     * Warning: equality is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    indexOf( value: A ): number


    /**
     * Tests whether the function <code>test</code> returns <code>true</code> for any value in the sequence
     */
    exists( test: ( value: A ) => boolean ): boolean

    /**
     * Tests whether every element of this sequence relates to the corresponding element of another sequence by satisfying a test predicate.
     */
    corresponds<B>( other: Seq<B>, test: ( thisVal: A, otherVal: B ) => boolean ): boolean

    /**
     * Counts the number of elements in the <code>Seq</code> which satisfies a test.
     */
    count( test: ( value: A ) => boolean ): number

    /**
     * Builds a new sequence with all elements except the first n ones
     * (iterating forward)
     */
    dropFirst( n: number ): Seq<A>

    /**
     * Builds a new sequence with all elements except the last n ones
     * (iterating forward)
     */
    dropLast( n: number ): Seq<A>


    /**
     * Builds a new sequence dropping the longest prefix of elements that satisfy the test
     * (iterating forward)
     */
    dropWhile( test: ( value: A ) => boolean ): Seq<A>

    /**
     * Removes elements from the sequence corresponding to the given indexes iterating forward
     * and returns a new sequence of the removed elements.
     *
     * WARNING: calling <code>dropAt()</code> followed by <code>reverse()</code>
     * will result in a call to <code>size()</code> which will iterate the whole sequence if
     * the length of the sequence is unknown
     */
    dropAt( ...indexes: number[] ): Seq<A>

    /**
     * Computes the difference/intersection of this sequence with another sequence.
     * Contrarily to <code>diff()</code>, <code>difference()</code> will remove duplicates e.g.
     * the difference of (1,2,3,1) with (1) is (2,3). The two '1' elements are removed
     * @see diff()
     */
    difference( other: Seq<A> ): Seq<A>

    /**
     * Computes the difference/intersection of this sequence with another sequence.
     * Contrarily to <code>difference()</code>, <code>diff()</code> will <em>not</em> remove duplicates e.g.
     * the diff() of (1,2,3,1) with (1) is (2,3,1). only the first '1' is removed
     * @see difference()
     */
    diff( other: Seq<A> ): Seq<A>

    /**
     * Builds a new sequence from this sequence without any duplicate elements.
     */
    distinct() : Seq<A>

    /**
     * Tests whether this sequence ends with content ot the iterable
     */
    endsWith( it: Iterable<A> ): boolean

    /**
     * Tests whether this sequence starts with content ot the iterable
     */
    startsWith( it: Iterable<A> ): boolean


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
    slice( from?: number, until?: number ): Seq<A>
}
