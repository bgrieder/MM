/**
 * Created by Bruno Grieder.
 */
import {option, Option} from './Option'


export class Try<A> {

    static from<A>( value: any ): Try<A> {
        if ( typeof value[ Symbol.iterator ] === 'undefined' ) {
            if ( typeof value === 'function' ) {
                return new Try<A>( value )
            }
            return new Try<A>( () => value )
        }
    }

    private readonly _computation: ( ...args: any[] ) => A
    private _result: A | Error
    private _failed: boolean

    protected constructor( computation: ( ...args: any[] ) => A ) {
        this._computation = computation
        this._result = void 0
        this._failed = false
    }


    private compute(): A | Error {
        return option( this._result ).getOrElse( () => {
            try {
                this._result = this._computation()
                this._failed = false
            }
            catch ( e ) {
                this._result = e
                this._failed = true
            }
            return this._result
        } )
    }

    private computeThrow(): A {
        const res = this.compute()
        if ( this._failed ) {
            throw res
        }
        return res as A
    }


//     canEqual(that: Any): Boolean
//     A method that should be called from every well-designed equals method that is open to be overridden in a subclass.

//     collect[U](pf: PartialFunction[T, U]): Try[U]
//     Applies the given partial function to the value from this Success or returns this if this is a Failure.

    /**
     * Inverts this Try.
     */
    get failed(): Try<Error> {
        const res = this.compute()
        if ( this._failed ) {
            return new Try<Error>( () => res as any as Error )
        }
        return new Try<Error>( () => new Error( res.toString() ) )

    }

    /**
     * Converts this to a Failure if the predicate is not satisfied.
     */
    filter( f: () => boolean ): Try<A> {
        const computeThrow = this.computeThrow.bind( this )
        return new Try<A>( () => {
            if ( f() ) {
                return computeThrow()
            }
            throw new Error( "Filter failed" )
        } )
    }

    /**
     * Returns the given function applied to the value from this Success or returns this if this is a Failure.
     */
    flatMap<U>( f: ( value: A ) => Try<U> ): Try<U> {
        return this.map<Try<U>>( f ).flatten<U>()
    }

    /**
     * Transforms a nested Try, ie, a Try of type Try[Try[T]], into an un-nested Try, ie, a Try of type Try[T].
     */
    flatten<U>(): Try<U> {
        return new Try<U>( () => {
            const res = this.compute()
            if ( this._failed ) {
                throw res
            }
            if ( res instanceof Try ) {
                return res.get
            }
            return res
        } )
    }


//     fold[U](fa: (Throwable) ⇒ U, fb: (T) ⇒ U): U
//     Applies fa if this is a Failure or fb if this is a Success.

    /**
     * Applies the given function f if this is a Success, otherwise returns Unit if this is a Failure.
     */
    foreach( f: ( value: A ) => void ): void {
        const res = this.compute()
        if ( this._failed ) {
            return
        }
        f( res as A )
    }

    /**
     * Returns the value from this Success or throws the exception if this is a Failure.
     */
    get get(): A {
        const res = this.compute()
        if ( this._failed ) {
            throw res
        }
        return res as A
    }

    /**
     * Returns the value from this Success or the given default argument if this is a Failure.
     */
    getOrElse<U>( elseVal: () => U ): A | U {
        const res = this.compute()
        if ( this._failed ) {
            return elseVal()
        }
        return res as A
    }

    /**
     * Returns true if the Try is a Failure, false otherwise.
     */
    get isFailure(): boolean {
        return option( this._result ).map( () => this._failed ).getOrElse( () => {
            this.compute()
            return this._failed
        } )
    }

    /**
     * Returns true if the Try is a Success, false otherwise.
     * Calling this method will compute the function if not already computed
     */
    get isSuccess(): boolean {
        return !this.isFailure
    }

    /**
     * Maps the given function to the value from this Success or returns this if this is a Failure.
     */
    map<U>( f: ( value: A ) => U ): Try<U> {
        return new Try( () => f( this.get ) )
    }

    /**
     * Returns this Try if it's a Success or the given default argument if this is a Failure.
     */
    orElse<U>( f: () => Try<U> ): Try<A | U> {
        return new Try<A | U>( () => {
            const res = this.compute()
            if ( this._failed ) {
                return f().get
            }
            return res as A
        } )
    }

//     productArity: Int
//     The size of this product.

//     productElement(n: Int): Any
//     The nth element of this product, 0-based.


    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recover<U>( fn: ( e: Error ) => U ): Try<A | U> {
        return new Try<A | U>( () => {
            const res = this.compute()
            if ( this._failed ) {
                return fn( res as any as Error )
            }
            return res as any as U
        } )
    }

    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recoverWith<U>( fn: ( e: Error ) => Try<U> ): Try<A | U> {
        return this.recover<Try<U>>( fn ).flatten<A | U>()
    }


//     toEither: Either[Throwable, T]
//     Returns Left with Throwable if this is a Failure, otherwise returns Right with Success value.

    /**
     * Returns None if this is a Failure or a Some containing the value if this is a Success.
     */
    get toOption(): Option<A> {
        const iter: Iterable<A> = {
            [Symbol.iterator]: () => {
                let done = false
                return {
                    next: () => {
                        let res: A | Error
                        if ( !done ) {
                            res = this.compute()
                        }
                        const n = {
                            done:  done || this._failed,
                            value: res instanceof Error ? void 0 : res
                        }
                        done = true
                        return n
                    }
                }
            }
        }
        return option<A>( iter )
    }

//     toOption: Option[T]
//

//     transform[U](s: (T) ⇒ Try[U], f: (Throwable) ⇒ Try[U]): Try[U]
//     Completes this Try by applying the function f to this if this is of type Failure, or conversely, by applying s if this is a Success.


}

export function tri<A>( fn: ( ...args: any[] ) => A ): Try<A> {
    return Try.from<A>( fn )
}
