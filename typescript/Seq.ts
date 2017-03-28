/**
 * Created by Bruno Grieder.
 */
import {Collection, Iterator} from './Iter'
import {none, Option, some} from './Option'


/**
 * A Seq is an ordered collection of elements
 */
export class Seq<A> extends Collection<A> {

    static from<A>( ...vals: any[] ): Seq<A> {
        if ( vals.length === 0 ) {
            return new Seq<A>( [] )
        }
        if ( vals.length > 1 ) {
            return new Seq<A>( vals )
        }
        const value = vals[ 0 ]
        if ( value instanceof Seq ) {
            return value
        }
        if ( typeof value[ Symbol.iterator ] === 'undefined' ) {
            return new Seq<A>( [ value ] )
        }
        return new Seq<A>( value )
    }

    /**
     * Finds the first element of the Seq for which the given partial function is defined, and applies the partial function to it.
     */
    collectFirst<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Option<B> {
        return ( mapper: ( value: A ) => B ) => {
            try {
                return some( this.filter( filter ).map( mapper ).head )
            }
            catch ( e ) {
                return none()
            }
        }
    }

    /**
     * Finds the first value produced by the Seq satisfying a predicate, if any.
     */
    find( p: ( value: A ) => boolean ): Option<A> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        for ( let n = it.next(); !n.done; n = it.next() ) {
            if ( p( n.value ) ) return some<A>( n.value )
        }
        return none()
    }

}

export function seq<A>( ...vals: any[] ): Seq<A> {
    return Seq.from<A>( ...vals )
}


