/**
 * Created by Bruno Grieder.
 */
import {Seq} from './Seq'


/**
 * The Range class represents numeric values in range [start;end) with non-zero step value step
 */
export class Range extends Seq<number> {

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


}

/**
 * Create a range of integers of the specified length starting at 0
 */
export function range( length: number ): Range;

/**
 * Create a range from the specified start to the element end-1 included  in step of 1
 */
export function range( start: number, end: number ): Range
/**
 * Create a range from start to end-step included
 */
export function range( start: number, end: number, step: number ): Range
export function range( lengthOrStart: number, end?: number, step?: number ): Range {
    return Range.from( lengthOrStart, end, step )
}


