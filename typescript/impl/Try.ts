import {Iterable} from '../API/Iterable'
import {SeqImpl} from './SeqImpl'
import {Failure, Success, Try} from '../API/Try'
import {Option} from '../API/Option'
import {iterator} from './IteratorImpl'
import {iterable} from './IterableImpl'
/**
 * Created by Bruno Grieder.
 */
export abstract class TryImpl<A> extends SeqImpl<A | Error> implements Try<A> {

    constructor( it: Iterable<A> ) {
        super( it )
    }

    protected newInstance<U>( it: Iterable<U>, ...args: any[] ): Try<U | Error> {
        return ftrie( it )
    }

    /**
     * Applies the given partial function to the value from this Success or returns this if this is a Failure.
     */
    collect<U>( partialFunction: { someFn?: ( value: A ) => U } ): Try<U | A> {
        return partialFunction.someFn ? this.map<U>( partialFunction.someFn ) : this
    }

    /**
     * Returns true is these two options are equal
     */
    equals( value: Try<A> ): boolean {
        return void 0
    }

    /**
     * Inverts this Try.
     */
    get failed(): Try<Error> { return this.isFailure ? this as any as Failure : failure( new Error( this.get().toString() ) )}

    /**
     * Converts this to a Failure if the predicate is not satisfied.
     */
    filter( f: ( value: A ) => boolean ): Try<A | Error> { return <Try<A>>super.filter( f )}

    /**
     * Returns the given function applied to the value from this Success or returns this if this is a Failure.
     */
    flatMap<U>( f: ( value: A ) => Try<U> ): Try<U> {
        return void 0
    }

    /**
     * Transforms a nested Try, ie, a Try of type Try<Try<A>>, into an un-nested Try, ie, a Try of type Try<A>.
     */
    flatten<U>(): Try<U> {
        return void 0
    }

    /**
     * Applies fa if this is a Failure or fb if this is a Success.
     */
    fold<U>( ifEmpty: () => U, f: ( value: A ) => U ): U {
        return void 0
    }

    /**
     * Applies the given function f if this is a Success, otherwise returns Unit if this is a Failure.
     */
    forEach<U>( f: ( value: A ) => U ): void {
        return void 0
    }

    /**
     * Returns the value from this Success or throws the exception if this is a Failure.
     */
    get(): A {
        return void 0
    }

    /**
     * Returns the value from this Success or the given default argument if this is a Failure.
     */
    getOrElse<U>( elseVal: () => U ): A | U {
        return void 0
    }

    /**
     * Returns true if the Try is a Failure, false otherwise.
     */
    get isFailure(): Boolean { return this instanceof FailureImpl }

    /**
     * Returns true if the Try is a Success, false otherwise.
     */
    get isSuccess(): Boolean { return this instanceof SuccessImpl }

    /**
     * Maps the given function to the value from this Success or returns this if this is a Failure.
     */
    map<U>( f: ( value: A ) => U ): Try<U> {
        return void 0
    }

    /**
     * Returns this Try if it's a Success or the given default argument if this is a Failure.
     */
    orElse( alternative: () => Try<A> ): Try<A> {
        return void 0
    }

    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recover<U>( partialFunction: { someFn?: ( value: A ) => U } ): Try<U> {
        return void 0
    }

    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recoverWith<U>( partialFunction: { someFn?: ( value: A ) => Try<U> } ): Try<U> {
        return void 0
    }

    // /**
    //  * Returns Left with Throwable if this is a Failure, otherwise returns Right with Success value.
    //  */
    // toEither: Either<Error, A>

    /**
     * Returns None if this is a Failure or a Some containing the value if this is a Success.
     */
    toOption: Option<A>

    /**
     * Completes this Try by applying the function f to this if this is of type Failure, or conversely, by applying s if this is a Success.
     */
    transform<U>( s: ( value: A ) => Try<U>, f: ( error: Error ) => Try<U> ): Try<U> {
        return void 0
    }

    /**
     * Convert this Option to a Promise
     * so that it can be chained using await
     */
    toPromise: Promise<A>

}

export class SuccessImpl<A> extends TryImpl<A> implements Success<A> {}
export class FailureImpl extends TryImpl<Error> implements Failure {}


/**
 * Create a `Success` holding the value
 */
export function success<A>( value?: A ): Success<A> {

    const it = () => {
        let index = -1;
        return iterator(
            () => (++index) == 0,
            () => {
                if ( index !== 0 ) {
                    throw new Error( "index out of bounds: " + index )
                }
                return value
            }
        )
    };
    return new SuccessImpl<A>( iterable( it, it, 1, () => [ value ] ) )
}

/**
 * Create a `Success` holding the value
 */
export function failure( error: Error ): Failure {

    const it = () => {
        let index = -1;
        return iterator(
            () => (++index) == 0,
            () => {
                if ( index !== 0 ) {
                    throw new Error( "index out of bounds: " + index )
                }
                return error
            }
        )
    };
    return new FailureImpl( iterable( it, it, 1, () => [ error ] ) )
}


/**
 * Create a `Some` holding the value
 */
export function tri<A>( fn: ( ...args: any[] ) => A ): Success<A> | Failure {
    try {
        return success( fn() )
    }
    catch ( e ) {
        return failure( e )
    }
}

//noinspection JSUnusedGlobalSymbols
/**
 * Create a `Some` from an `Iterable`
 */
export function ftrie<A>( it: Iterable<A> ): Try<A | Error> {

    let itr = it.fit()
    if ( typeof itr == 'undefined' ) {
        itr = it.bit()
    }
    if ( typeof itr == 'undefined' ) {
        return failure( new Error( 'this iterable has no iterator' ) )
    }
    if ( itr.iterate() ) {
        return success( itr.current() )
    }
    else {
        return failure( new Error( 'this iterable has no values' ) )
    }
}