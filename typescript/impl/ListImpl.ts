/**
 * Created by Bruno Grieder on 29 05 2015.
 */

import {Iterable} from '../API/Iterable'
import {iterable} from './IterableImpl'
import {iterator} from './IteratorImpl'
import {SeqImpl} from './SeqImpl'
import {List} from '../API/List'

export class ListImpl<A> extends SeqImpl<A> implements List<A> {

    constructor( it: Iterable<A> ) {

        super( it )
        if ( typeof this.fit === 'undefined' || typeof this.bit === 'undefined' ) {
            throw new Error( "List must be instantiated with iterables that can be traversed in both directions" )
        }
    }

    protected newInstance<U>( it: Iterable<U>, ...args: any[] ): List<U> {
        return new ListImpl( it )
    }

    /**
     * Returns this list as an array
     * Identical to calling toArray()
     */
    get = this.toArray


    map<U>( f: ( value: A ) => U ): List<U> {
        return <List<U>>super.map( f )
    }

    filter( f: ( value: A ) => boolean ): List<A> {
        return <List<A>>super.filter( f )
    }

    flatten<U>(): List<U> {
        return <List<U>>super.flatten()
    }

    flatMap<U>( f: ( value: A ) => List<U> ): List<U> {
        return <List<U>>super.flatMap( f )
    }

    size(): number {
        return this.get().length
    }

    takeFirst( n: number ): List<A> {
        return <List<A>>super.takeFirst( n )
    }

    /**
     * Returns a new <code>List</code> with the elements reversed.
     */
    reverse(): List<A> {
        return <List<A>>super.reverse()
    }

    /**
     * Returns a new list containing the elements from the List followed by the elements from the passed Iterable.
     */
    concat( it: Iterable<A> ): List<A> {
        return <List<A>>super.concat( it )
    }

    /**
     * A copy of the list with an element prepended.
     */
    prepend( a: A ): List<A> {
        return <List<A>>super.prepend( a )
    }

    /**
     * A copy of the list with an element appended.
     * Same as push()
     * @see push
     */
    append( a: A ): List<A> {
        return <List<A>>super.append( a )
    }

    /**
     * A copy of the list with an element appended.
     * Same as append()
     * @see append
     */
    push = this.append
}

/**
 * Create a list from rest parameters
 */
export function list<A>( ...vals: A[] ): List<A> {

    const len = vals.length;

    const fit = () => {
        let index = -1;
        return iterator(
            () => ++index < len,
            () => vals[ index ]
        )
    };

    const bit = () => {
        let index = len;
        return iterator(
            () => (--index >= 0),
            () => vals[ index ]
        )
    };

    return new ListImpl( iterable<A>( fit, bit, len ) ) // ()=>vals ))
}

//noinspection JSUnusedGlobalSymbols
/**
 * Create a list from an array
 */
export function alist<A>( array: A[] ): List<A> {
    return list.apply( this, array )
}

//noinspection JSUnusedGlobalSymbols
/**
 * Create a list from an iterable
 */
export function flist<A>( it: Iterable<A> ): List<A> {

    if ( typeof it.fit === 'undefined' || typeof it.bit === 'undefined' ) {
        throw('List: new instance: both a forward and a backward iterator are required')
    }

    return new ListImpl( it )
}
