/**
 * Created by Bruno Grieder.
 */
import {Seq} from './Seq'
import {Option} from './Option'

export interface Try<A> extends Seq<A | Error> {

    /**
     * Applies the given partial function to the value from this Success or returns this if this is a Failure.
     */
    collect<U>( partialFunction: { someFn?: ( value: A ) => U } ): Try<U | A>

    /**
     * Returns true is these two options are equal
     */
    equals( value: Try<A> ): boolean

    /**
     * Inverts this Try.
     */
    failed: Try<Error>

    /**
     * Converts this to a Failure if the predicate is not satisfied.
     */
    filter( f: ( value: A ) => boolean ): Try<A | Error>

    /**
     * Returns the given function applied to the value from this Success or returns this if this is a Failure.
     */
    flatMap<U>( f: ( value: A ) => Try<U> ): Try<U | Error>

    /**
     * Transforms a nested Try, ie, a Try of type Try<Try<A>>, into an un-nested Try, ie, a Try of type Try<A>.
     */
    flatten<U>(): Try<U | Error>

    /**
     * Applies fa if this is a Failure or fb if this is a Success.
     */
    fold<U>( ifEmpty: () => U, f: ( value: A ) => U ): U

    /**
     * Applies the given function f if this is a Success, otherwise returns Unit if this is a Failure.
     */
    forEach<U>( f: ( value: A ) => U ): void

    /**
     * Returns the value from this Success or throws the exception if this is a Failure.
     */
    get(): A

    /**
     * Returns the value from this Success or the given default argument if this is a Failure.
     */
    getOrElse<U>( elseVal: () => U ): A | U

    /**
     * Returns true if the Try is a Failure, false otherwise.
     */
    isFailure: Boolean

    /**
     * Returns true if the Try is a Success, false otherwise.
     */
    isSuccess: Boolean

    /**
     * Maps the given function to the value from this Success or returns this if this is a Failure.
     */
    map<U>( f: ( value: A ) => U ): Try<U>

    /**
     * Returns this Try if it's a Success or the given default argument if this is a Failure.
     */
    orElse( alternative: () => Try<A> ): Try<A>

    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recover<U>( partialFunction: { someFn?: ( value: A ) => U } ): Try<U>

    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recoverWith<U>( partialFunction: { someFn?: ( value: A ) => Try<U> } ): Try<U>

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
    transform<U>( s: ( value: A ) => Try<U>, f: ( error: Error ) => Try<U> ): Try<U>

    /**
     * Convert this Option to a Promise
     * so that it can be chained using await
     */
    toPromise: Promise<A>

}

export interface Success<A> extends Try<A> {}
export interface Failure extends Try<Error> {}