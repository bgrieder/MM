/**
 * Created by Bruno Grieder on 29 05 2015.
 */

import {Iterable} from './Iterable'
import {Seq} from './Seq'

export interface List<A> extends Seq<A> {


    /**
     * Returns this list as an array
     * Identical to calling toArray()
     */
    get(): A[]

    map<U>( f: ( value: A ) => U ): List<U>

    filter( f: ( value: A ) => boolean ): List<A>

    flatten<U>(): List<U>

    flatMap<U>( f: ( value: A ) => List<U> ): List<U>

    size(): number

    takeFirst( n: number ): List<A>

    /**
     * Returns a new <code>List</code> with the elements reversed.
     */
    reverse(): List<A>

    /**
     * Returns a new list containing the elements from the List followed by the elements from the passed Iterable.
     */
    concat( it: Iterable<A> ): List<A>

    /**
     * A copy of the list with an element prepended.
     */
    prepend( a: A ): List<A>

    /**
     * A copy of the list with an element appended.
     * Same as push()
     * @see push
     */
    append( a: A ): List<A>

    /**
     * A copy of the list with an element appended.
     * Same as append()
     * @see append
     */
    push( a: A ): List<A>
}

