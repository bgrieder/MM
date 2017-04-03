/**
 * Created by Bruno Grieder.
 */
import {Collection} from './Collection'


export class Option<A> extends Collection<A> {

    static from<A>( optVal: any ): Option<A> {
        if ( typeof optVal[ Symbol.iterator ] === 'undefined' ) {
            return new Option<A>( [ optVal ] )
        }
        return new Option<A>( optVal )
    }


    /**
     * Returns a Some containing the result of applying pf to this Option's contained value, if this option is nonempty and pf is defined for that value.
     */
    collect<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Option<B> {
        return ( mapper: ( value: A ) => B ) => super.collect( filter )( mapper ) as Option<B>
    }

    /**
     * Tests whether the value of the Option pass the filter, and applies the partial function to it.
     */
    collectFirst<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Option<B> {
        return ( mapper: ( value: A ) => B ) => {
            return this.filter( filter ).map( mapper ) as Option<B>
        }
    }

    /**
     * Returns true if this option is nonempty and the predicate p returns true when applied to this Option's value.
     */
    exists( p: ( value: A ) => boolean ): boolean {
        return super.exists( p )
    }

    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns true.
     */
    filter( f: ( value: A ) => boolean ): Option<A> {
        return super.filter( f ) as Option<A>
    }

    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns false.
     */
    filterNot( f: ( value: A ) => boolean ): Option<A> {
        return super.filterNot( f ) as Option<A>
    }

    /**
     * Finds the first element of the iterable collection satisfying a predicate, if any.
     */
    find( p: ( value: A ) => boolean ): Option<A> {
        return this.filter( p ) as Option<A>
    }

    /**
     * Returns the result of applying f to this Option's value if this Option is nonempty.
     */
    flatMap<U>( f: ( value: A ) => Option<U> ): Option<U> {
        return super.flatMap( f ) as Option<U>
    }

    /**
     * Converts this Option of Option into an Option
     * e.g. some( some(1) ).flatten() -> some(1)
     */
    flatten<U>(): Option<U> {
        return super.flatten<U>() as Option<U>
    }

    /**
     * Returns true if this option is empty or the predicate p returns true when applied to this Option's value.
     */
    forall( p: ( value: A ) => boolean ): boolean {
        return super.forall( p )
    }

    /**
     * Apply the given procedure f to the option's value, if it is nonempty.
     */
    foreach( f: ( value: A ) => void ): void {
        return super.foreach( f )
    }

    get get(): A {
        return this.head
    }

    /**
     * Returns the option's value if the option is nonempty, otherwise return the result of evaluating default.
     */
    getOrElse<U>( elseVal: () => U ): A | U {
        try {
            return this.get
        }
        catch ( e ) {
            return elseVal()
        }
    }

    // groupBy<K>(f: (A) => K): Map<K, collection.Seq<A>>
    // Partitions this iterable collection into a map of iterable collections according to some discriminator function.


    /**
     * Optionally selects the first element.
     */
    get headOption(): Option<A> {
        return new Option<A>( this )
    }

    // init: collection.Seq<A>
    // Selects all elements except the last.

    // inits: collection.Iterator<collection.Seq<A>>
    // Iterates over the inits of this iterable collection.


    /**
     * Returns true if the option is an instance of Some, false otherwise.
     */
    get isDefined(): boolean {
        return !this.isEmpty
    }


    // iterator: Iterator<A>
    // Returns a singleton iterator returning the Option's value if it is nonempty, or an empty iterator if the option is empty.

    /**
     * Selects the last element.
     */
    get last(): A {
        if ( this.isEmpty ) {
            throw new Error( "No such element: last in None" )
        }
        return this.get
    }

    /**
     * Optionally selects the last element.
     */
    get lastOption(): Option<A> {
        return new Option<A>( this )
    }

    /**
     * Returns a Some containing the result of applying f to this Option's value if this Option is nonempty.
     */
    map<U>( f: ( value: A ) => U ): Option<U> {
        return super.map<U>( f ) as Option<U>
    }

    /**
     * Returns false if the option is None, true otherwise.
     */
    get nonEmpty(): boolean {
        return !this.isEmpty
    }

    /**
     * Returns this Option if it is nonempty, otherwise return the result of evaluating alternative.
     */
    orElse( alternative: () => Option<A> ): Option<A> {
        return this.isEmpty ? alternative() : this
    }

    /**
     * Returns the option's value if it is nonempty, or null if it is empty.
     */
    get orNull(): A {
        try {
            return this.get
        }
        catch ( e ) {
            return null
        }

    }

    /**
     * Returns the option's value if it is nonempty, or undefined if it is empty.
     */
    get orUndefined(): A {
        try {
            return this.get
        }
        catch ( e ) {
            return void 0
        }
    }


    // reduceLeftOption<B >: A>(op: (B, A) => B): Option<B>
    // Optionally applies a binary operator to all elements of this iterable collection, going left to right.

    // reduceOption<A1 >: A>(op: (A1, A1) => A1): Option<A1>
    // Reduces the elements of this iterable collection, if any, using the specified associative binary operator.

    // reduceRightOption<B >: A>(op: (A, B) => B): Option<B>
    // Optionally applies a binary operator to all elements of this iterable collection, going right to left.

    // scan<B >: A, That>(z: B)(op: (B, B) => B)(implicit cbf: CanBuildFrom<collection.Seq<A>, B, That>): That
    // Computes a prefix scan of the elements of the collection.

    // splitAt(n: number): (collection.Seq<A>, collection.Seq<A>)
    // Splits this iterable collection into two at a given position.

    // stringPrefix: string
    // Defines the prefix of this object's tostring representation.

    // tails: collection.Iterator<collection.Seq<A>>
    // Iterates over the tails of this iterable collection.

    // takeRight(n: number): collection.Seq<A>
    // Selects last n elements.

    // toIterator: collection.Iterator<A>
    // Returns an Iterator over the elements in this iterable collection.

    // toLeft<X>(right: => X): util.Either<A, X>
    // Returns a util.Right containing the given argument right if this is empty, or a util.Left containing this Option's value if this Option is nonempty.

    // toRight<X>(left: => X): util.Either<X, A>
    // Returns a util.Left containing the given argument left if this Option is empty, or a util.Right containing this Option's value if this is nonempty.

    // transpose<B>(implicit asTraversable: (A) => GenTraversableOnce<B>): collection.Seq<collection.Seq<B>>
    // Transposes this iterable collection of traversable collections into a iterable collection of iterable collections.

    // unzip<A1, A2>(implicit asPair: (A) => (A1, A2)): (collection.Seq<A1>, collection.Seq<A2>)
    // Converts this iterable collection of pairs into two collections of the first and second half of each pair.

    // unzip3<A1, A2, A3>(implicit asTriple: (A) => (A1, A2, A3)): (collection.Seq<A1>, collection.Seq<A2>, collection.Seq<A3>)
    // Converts this iterable collection of triples into three collections of the first, second, and third element of each triple.

    // view(from: number, until: number): SeqView<A, collection.Seq<A>>
    // Creates a non-strict view of a slice of this iterable collection.

    // view: SeqView<A, collection.Seq<A>>
    // Creates a non-strict view of this iterable collection.

    // zip<B>(that: GenSeq<B>): Option<(A, B)>
    // <use case> Returns a option formed from this option and another iterable collection by combining corresponding elements in pairs.

    /**
     * Converts this Option to a Promise, resolving it if it is a Some, rejecting it otherwise
     */
    get toPromise(): Promise<A> {
        return this.map( v => Promise.resolve( v ) ).getOrElse( () => Promise.reject( new Error( 'No such element None.get' ) ) )
    }

}


export function some<A>( value: A ): Option<A> {
    return Option.from<A>( [ value ] )
}

export function none() {
    return Option.from<any>( [] )
}


export function option<A>( value: A ): Option<A> {
    return (typeof value === 'undefined' || value === null) ? Option.from<A>( [] ) : Option.from<A>( value )
}

