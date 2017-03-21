/**
 * Created by Bruno Grieder.
 */
import {Iterable, JSIterator} from './Iterable'


// export interface Option<A> extends Iterable<A> {
//
//     /**
//      * Returns a <code>Some</code> containing the result of
//      * applying <code>someFn</code> to this <code>Option</code>'s contained
//      * value, '''if''' this option is
//      * nonempty '''and''' <code>someFn</code> is defined
//      * Returns <code>None</code> otherwise.
//      */
//     collect<U>( partialFunction: {someFn?: ( value: A ) => U} ): Option<U>
//
//
//     /**
//      * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
//      * this <code>Option</code>'s value returns true. Otherwise, return <code>None</code>.
//      */
//     filter( f: ( value: A ) => boolean ): Option<A>
//
//     /**
//      * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
//      * this <code>Option</code>'s value returns false. Otherwise, return <code>None</code>.
//      */
//     filterNot( test: ( value: A ) => boolean ): Option<A>
//
//     /**
//      * Returns the result of applying <code>f</code> to this <code>Option</code>'s value if
//      * this <code>Option</code> is nonempty.
//      * Returns <code>None</code> if this <code>Option</code> is empty.
//      * Slightly different from `map` in that <code>f</code> is expected to
//      * return an <code>Option</code> (which could be <code>None</code>).
//      *
//      * @note: flatMap '''will''' run the Option
//      *
//      *  @see map
//      *  @see forEach
//      */
//     flatMap<U>( f: ( value: A ) => Option<U> ): Option<U>
//
//     /**
//      * Flattens two layers of <code>Option</code> into one
//      * More precisely flattens an Option<Iterable<A>> into an Option<A>
//      */
//     flatten<U>(): Option<U>
//
//     /**
//      * Returns a <code>Some</code> containing the result of applying <code>f</code> to this <code>Option</code>'s
//      * value if this  <code>Option</code> is nonempty.
//      * Otherwise return  <code>None</code>.
//      *
//      *  @note This is similar to `flatMap` except here,
//      *  <code>f</code> does not need to wrap its result in an <code>Option</code>.
//      */
//     map<U>( f: ( value: A ) => U ): Option<U>
//
//
//     /**
//      * Returns this <code>Option</code> if it is nonempty,
//      *  otherwise return the result of evaluating `alternative`.
//      */
//     orElse( alternative: () => Option<A> ): Option<A>
//
//     /**
//      * Convert this Option to a Promise
//      * so that it can be chained using await
//      */
//     toPromise: Promise<A>
//
// }

export class Option<A> extends Iterable<A> {

    static from<A>( value: any ): Option<A> {
        const arr = (typeof value === 'undefined' || value === null) ?
                    []
            :
                    [ value ]
        return new Option<A>( arr )
    }

    protected constructor( value: any ) {
        super( value, 1 )
    }

    collect<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Iterable<B> {
        return (mapper: (value: A) => B) => this.filter(filter).map(mapper)
    }

    concat( that: Iterable<A> ): Option<A> {
        return super.concat( that ) as Option<A>
    }

    filter( f: ( value: A ) => boolean ): Option<A> {
        return super.filter( f ) as Option<A>
    }

    filterNot( test: ( value: A ) => boolean ): Option<A> {
        return undefined
    }

    flatMap<U>( f: ( value: A ) => Option<U> ): Option<U> {
        return super.flatMap( f ) as Option<U>
    }

    flatten<U>(): Option<U> {
        return super.flatten() as Option<U>
    }

    orElse( alternative: () => Option<A> ): Option<A> {
        const it: JSIterator<A> = this[ Symbol.iterator ]()
        const n = it.next()
        if ( n.done ) {
            return alternative()
        }
        return this
    }


    getOrElse<U>( elseVal: () => U ): A | U {
        const it: JSIterator<A> = this[ Symbol.iterator ]()
        const n = it.next()
        if ( n.done ) {
            return elseVal()
        }
        return n.value
    }

    map<U>( f: ( value: A ) => U ): Option<U> {
        return super.map( f ) as Option<U>
    }

    get toPromise(): Promise<A> {
        return this.map( v => Promise.resolve( v ) ).getOrElse( () => Promise.reject( new Error( 'No such element None.get' ) ) )
    }

}


export function option<A>( value: A ): Option<A> {
    return Option.from<A>( value )
}

