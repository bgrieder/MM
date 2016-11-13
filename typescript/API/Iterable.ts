/**
 * Created by Bruno Grieder.
 */

import { Iterator } from './Iterator'


/**
 * An Iterable is an object that exposes either a forward <code>Iterator</code>
 * or a backward <code>Iterator</code> or both.
 *
 * The iterators are exposed via properties <code>fit</code> and <code>bit</code>
 * which expose functions to allow for lazy
 * instantiation of these <code>Iterator</code>s if required
 *
 * The <code>length</code> of the content has the value <code>-1</code> if unknown
 */
export interface Iterable<A> {

    /**
     * The forward iterator if any
     */
    fit?: () => Iterator<A>

    /**
     * The backward iterator if any
     */
    bit?: () => Iterator<A>

    /**
     * The <code>length</code> of the content has the value <code>-1</code> if unknown
     */
    length?: number

    /**
     * A function that generates an array from the iterators
     */
    fArray?: () => A[]

    /**
     * Generate an array from the iterator using `_fArray`. Identical to calling `_fArray()`
     * Expensive operation that will iterate all elements.
     */
    toArray(): A[]

    /**
     * Tests whether all elements are equal in each iterable iterating forward
     * Equality of elements is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    equals( other: Iterable<A> ): boolean
}
