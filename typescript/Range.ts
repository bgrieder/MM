/**
 * Created by Bruno Grieder.
 */
import {Iterator} from './Iter'
import {none, Option, some} from './Option'
import {Collection} from './Collection'


/**
 * The Range class represents integer values in range [start;end) with non-zero step value step
 */
export class Range extends Collection<number> {

    static from( lengthOrStart: number, end?: number, step?: number ): Range {
        let rstart: number, rend: number, rstep: number
        if ( typeof end === 'undefined' && typeof step === 'undefined' ) {
            rstart = 0
            rstep = 1
            rend = Math.floor( lengthOrStart ) - rstep
        }
        else if ( typeof step === 'undefined' ) {
            rstep = 1
            rstart = Math.floor( lengthOrStart )
            rend = Math.floor( end ) - rstep
        }
        else {
            rstart = lengthOrStart
            rend = end
            rstep = step
        }

        const iter: Iterable<number> = {
            [Symbol.iterator]: () => {
                let current = rstart
                return {
                    next: (): { done: boolean, value?: number } => {
                        console.log( 'VALUE', current )
                        const done = rstep <= 0 ? current < rend : current > rend
                        const value = done ? void 0 : current
                        current = current + rstep
                        return { done: done, value: value }
                    }
                }
            },
            length:            Math.floor( (rend + rstep - rstart) / rstep ),
            reverseIterator:   () => {
                let current = rend
                return {
                    next: (): { done: boolean, value?: number } => {
                        const done = rstep > 0 ? current < rstart : current > rstart
                        const value = done ? void 0 : current
                        current = current - rstep
                        return { done: done, value: value }
                    }
                }
            }
        }
        return new Range( iter )
    }

    /**
     * Finds the first element of the Range for which the given partial function is defined, and applies the partial function to it.
     */
    collectFirst<B>( filter: ( value: number ) => boolean ): ( mapper: ( value: number ) => B ) => Option<B> {
        return ( mapper: ( value: number ) => B ) => {
            try {
                return some<B>( this.filter( filter ).map( mapper ).head )
            }
            catch ( e ) {
                return none()
            }
        }
    }

    /**
     * Finds the first value produced by the Range satisfying a predicate, if any.
     */
    find( p: ( value: number ) => boolean ): Option<number> {
        const it: Iterator<number> = this[ Symbol.iterator ]()
        for ( let n = it.next(); !n.done; n = it.next() ) {
            if ( p( n.value ) ) return some<number>( n.value )
        }
        return none()
    }

    /**
     * Optionally selects the first element.
     */
    get headOption(): Option<number> {
        try {
            return some( this.head )
        }
        catch ( e ) {
            return none()
        }
    }


    // init: collection.Range<A>
    // Selects all elements except the last.

    // inits: collection.Iterator<collection.Range<A>>
    // Iterates over the inits of this iterable collection.

    /**
     * Optionally selects the last element.
     */
    get lastOption(): Option<number> {
        try {
            return some( this.last )
        }
        catch ( e ) {
            return none()
        }
    }

}


export function range( length: number ): Range;
export function range( start: number, end: number ): Range
export function range( start: number, end: number, step: number ): Range
export function range( lengthOrStart: number, end?: number, step?: number ): Range {
    return Range.from( lengthOrStart, end, step )
}


