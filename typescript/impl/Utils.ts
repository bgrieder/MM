/**
 * Created by Bruno Grieder.
 */

/**
 * Test is two values are equals by first checking id they implement an `equals` methods
 * otherwise test using `===`
 */
export function eq<A>( a: A, b: A ): boolean {

    if ( typeof b === 'object' ) {
        const feq: ( other: A ) => boolean = b[ 'equals' ]
        return ( feq && feq.call( b, a ) ) || (a === b )
    }
    return ( a === b )
}
