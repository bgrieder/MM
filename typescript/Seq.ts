/**
 * Created by Bruno Grieder.
 */
import {Iter, Iterator} from './Iter'
import {none, Option, some} from './Option'


/**
 * A Seq is an ordered list of elements
 */
export class Seq<A> extends Iter<A> {

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


    ///////////////////////////////////////////

    // /:<B>(z: B)(op: (B, A) => B): B
    // Applies a binary operator to a start value and all elements of this traversable or Seq, going left to right.

    // :\<B>(z: B)(op: (A, B) => B): B
    // Applies a binary operator to all elements of this Seq and a start value, going right to left.

    // addString(b: StringBuilder): StringBuilder
    // Appends all elements of this Seq to a string builder.

    // addString(b: StringBuilder, sep: String): StringBuilder
    // Appends all elements of this Seq to a string builder using a separator string.

    // addString(b: StringBuilder, start: String, sep: String, end: String): StringBuilder
    // Appends all elements of this Seq to a string builder using start, end, and separator strings.

    // aggregate<B>(z: => B)(seqop: (B, A) => B, combop: (B, B) => B): B
    // Aggregates the results of applying an operator to subsequent elements.

    /**
     * Returns the element at index.
     * The first element is at index 0
     * O(1) if the underlying iterable is indexed, O(n) otherwise
     */
    at( index: number ): A {
        return super.at( index )
    }

    // buffered: BufferedSeq<A>
    // Creates a buffered Seq from this Seq.

    /**
     * Creates a Seq by transforming values produced by this Seq with a partial function, dropping those values for which the partial function is not defined.
     */
    collect<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Seq<B> {
        return ( mapper: ( value: A ) => B ) => this.filter( filter ).map( mapper ) as Seq<B>
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
     * Tests whether this Seq contains a given value as an element.
     */
    contains( elem: any ): boolean {
        return super.contains( elem )
    }

    /**
     * Concatenates this Seq with another.
     */
    concat( that: Seq<A> ): Seq<A> {
        return super.concat( that ) as Seq<A>
    }

    // copyToArray(xs: Array<A>, start: number, len: number): Unit
    // <use case> Copies selected values produced by this Seq to an array.

    // copyToArray(xs: Array<A>): Unit
    // <use case> Copies the elements of this Seq to an array.

    // copyToArray(xs: Array<A>, start: number): Unit
    // <use case> Copies the elements of this Seq to an array.

    // copyToBuffer<B >: A>(dest: Buffer<B>): Unit
    // Copies all elements of this Seq to a buffer.

    // corresponds<B>(that: GenTraversableOnce<B>)(p: (A, B) => Boolean): Boolean
    // Tests whether every element of this Seq relates to the corresponding element of another collection by satisfying a test predicate.


    /**
     * Counts the number of elements in the Seq which satisfy a predicate.
     */
    count( p: ( value: A ) => boolean ): number {
        return super.count( p )
    }


    /**
     * Advances this Seq past the first n elements, or the length of the Seq, whichever is smaller.
     */
    drop( n: number ): Seq<A> {
        return super.drop( n ) as Seq<A>
    }

    /**
     * Skips longest Sequence of elements of this Seq which satisfy given predicate p, and returns a Seq of the remaining elements.
     */
    dropWhile(p: (value: A) => Boolean): Seq<A> {
        return super.dropWhile(p) as Seq<A>
    }

    // duplicate: (Seq<A>, Seq<A>)
    // Creates two new Seqs that both iterate over the same elements as this Seq (in the same order).

    /**
     * Test whether these two Seqs are equal by testing equality on all elements
     * Equality on elements is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    equals( that: Seq<A> ): boolean {
        return super.equals( that )
    }

    /**
     * Tests whether a predicate holds for some of the values produced by this Seq.
     */
    exists( p: ( value: A ) => boolean ): boolean {
        return super.exists( p )
    }

    /**
     * Returns a Seq over all the elements of this Seq that satisfy the predicate p.
     */
    filter( filter: ( value: A ) => boolean ): Seq<A> {
        return super.filter( filter ) as Seq<A>
    }

    /**
     * Creates a Seq over all the elements of this Seq which do not satisfy a predicate p.
     */
    filterNot( filter: ( value: A ) => boolean ): Seq<A> {
        return super.filterNot( filter ) as Seq<A>
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

    /**
     * Creates a new Seq by applying a function to all values produced by this Seq and concatenating the results.
     */
    flatMap<B>( f: ( value: A, index?: number ) => Seq<B> ): Seq<B> {
        return super.flatMap<B>( f ) as Seq<B>
    }

    /**
     * Converts this Sequence of iterables into a Sequence formed by the elements of the iterables.
     * e.g. seq( seq(1,2), seq(3,4) ).flatten() = seq(1,2,3,4)
     */
    flatten<U>(): Seq<U> {
        return super.flatten<U>() as Seq<U>
    }

    // fold<A1 >: A>(z: A1)(op: (A1, A1) => A1): A1
    // Folds the elements of this Seq using the specified associative binary operator.

    /**
     * Applies a binary operator to a start value and all elements of Seq, going left to right.
     */
    foldLeft<B>( initialValue: B ): ( op: ( accumulator: B, value: A, index?: number ) => B ) => B {
        return ( op: ( accumulator: B, value: A, index?: number ) => B ) => super.foldLeft( initialValue )( op )
    }

    /**
     * Applies a binary operator to all elements of Seq and a start value, going right to left.
     */
    foldRight<B>( initialValue: B ): ( op: ( accumulator: B, value: A, index?: number ) => B ) => B {
        return ( op: ( accumulator: B, value: A, index?: number ) => B ) => super.foldRight( initialValue )( op )
    }

    /**
     * Tests whether a predicate holds for all values produced by this Seq.
     */
    forall( p: ( value: A ) => boolean ): boolean {
        return super.forall(p)
    }

    /**
     * Applies a function f to all values produced by this Seq.
     */
    foreach( f: ( value: A ) => void ): void {
        return super.foreach( f )
    }

    // grouped<B >: A>(size: number): GroupedIterable<B>
    // Returns a Seq which groups this Seq into fixed size blocks.

    /**
     * Tests whether this Iterable has a known size.
     */
    // get hasDefiniteSize(): boolean

    /**
     * Selects the first element of this Seq
     */
    // get head(): A


    /**
     * Returns the index of the first occurrence of the specified object in Seq after or at some optional start index.
     */
    indexOf( elem: A, from?: number ): number {
        return super.indexOf( elem, from )
    }


    // indexWhere(p: (A) => Boolean, from: number): number
    // Returns the index of the first produced value satisfying a predicate, or -1, after or at some start index.

    // indexWhere(p: (A) => Boolean): number
    // Returns the index of the first produced value satisfying a predicate, or -1.

    /**
     * Tests whether this Seq is empty.
     */
    // get isEmpty(): boolean

    /**
     * Tests whether this Seq is an Indexed Seq
     * i.e. its elements can be accessed using an index
     */
    // get isIndexedSeq(): boolean

    // isTraversableAgain: Boolean
    // Tests whether this Iterable can be repeatedly traversed.

    /**
     * Returns the number of elements in this Seq.
     */
    // get length(): number

    /**
     * Creates a new Seq that maps all produced values of this Seq to new values using a transformation function.
     */
    map<B>( f: ( value: A, index?: number ) => B ): Seq<B> {
        return super.map<B>( f ) as Seq<B>
    }

    // max: A
    // <use case> Finds the largest element.

    // maxBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the largest value measured by function f.

    // min: A
    // <use case> Finds the smallest element.

    // minBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the smallest value measured by function f.

    /**
     * Displays all elements of this Seq in a string using an optional separator string.
     */
    mkString( sep?: string ): string;

    /**
     * Displays all elements of this Seq in a string using start, end, and separator strings.
     */
    mkString( start?: string, sep?: string, end?: string ): string;

    /**
     * Displays all elements of this Seq in a string using start, end, and separator strings.
     */
    mkString( startOrSep?: string, sep?: string, end?: string ): string {
        return super.mkString( startOrSep, sep, end )
    }

    // nonEmpty: Boolean
    // Tests whether the Seq is not empty.

    // padTo(len: number, elem: A): Seq<A>
    // <use case> Appends an element value to this Seq until a given target length is reached.

    // partition(p: (A) => Boolean): (Seq<A>, Seq<A>)
    // Partitions this Seq in two Seqs according to a predicate.

    // patch<B >: A>(from: number, patchElems: Iterable<B>, replaced: number): Iterable<B>
    // Returns this Seq with patched values.

    // product: A
    // <use case> Multiplies up the elements of this collection.

    // reduce<A1 >: A>(op: (A1, A1) => A1): A1
    // Reduces the elements of this Seq using the specified associative binary operator.

    // reduceLeft<B >: A>(op: (B, A) => B): B
    // Applies a binary operator to all elements of this traversable or Seq, going left to right.

    // reduceLeftOption<B >: A>(op: (B, A) => B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or Seq, going left to right.

    // reduceOption<A1 >: A>(op: (A1, A1) => A1): Option<A1>
    // Reduces the elements of this traversable or Seq, if any, using the specified associative binary operator.

    // reduceRight<B >: A>(op: (A, B) => B): B
    // Applies a binary operator to all elements of this traversable or Seq, going right to left.

    // reduceRightOption<B >: A>(op: (A, B) => B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or Seq, going right to left.

    /**
     * Returns a new Seq with the elements in reverse order
     * If a reverse iterator is available, it will be used otherwise:
     *      - reversing an indexed seq will return a linear (non indexed Seq).
     *      - reversing a linear Seq will create an indexed Seq by by loading its content into an im-memory array
     */
    // get reverse(): Seq<A>

    // sameElements(that: Iterable<_>): Boolean
    // Tests if another Seq produces the same values as this one.

    // scanLeft<B>(z: B)(op: (B, A) => B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going left to right.

    // scanRight<B>(z: B)(op: (A, B) => B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going right to left.

    /**
     * The size of this Seq.
     */
    // get size(): number

    /**
     * Creates a Seq returning an interval of the values produced by this Seq.
     */
    slice( from: number, until: number ): Seq<A> {
        return super.slice(from, until) as Seq<A>
    }

    // sliding<B >: A>(size: number, step: number = 1): GroupedIterable<B>
    // Returns a Seq which presents a "sliding window" view of another Seq.

    // span(p: (A) => Boolean): (Seq<A>, Seq<A>)
    // Splits this Iterable into a prefix/suffix pair according to a predicate.

    /**
     * Sums up the elements of this collection.
     */
    // get sum(): A

    /**
     * Selects all elements but the first
     */
    // get tail(): Seq<A>

    /**
     * Selects first n values of this Seq.
     */
    take( n: number ): Seq<A> {
        return super.take(n) as Seq<A>
    }

    // takeWhile(p: (A) => Boolean): Seq<A>
    // Takes longest prefix of values produced by this Seq that satisfy a predicate.

    // to<Col<_>>: Col<A>
    // <use case> Converts this Seq into another by copying all elements.

    /**
     * Converts this Seq to an array.
     */
    // get toArray(): Array<A>

    // toBuffer<B >: A>: Buffer<B>
    // Uses the contents of this Seq to create a new mutable buffer.

    /**
     * Converts this Seq to an indexed Seq is it not already one
     * by creating an in memory array with the content
     */
    // get toIndexedSeq(): Seq<A>

    // toList: List<A>
    // Converts this Seq to a list.

    // toMap<T, U>: Map<T, U>
    // <use case> Converts this Seq to a map.

    // toSet<B >: A>: immutable.Set<B>
    // Converts this Seq to a set.

    // toStream: immutable.Stream<A>
    // Converts this Seq to a stream.

    /**
     * Converts this Seq to a string.
     */
    // get toString(): string

    // toTraversable: Traversable<A>
    // Converts this Seq to an unspecified Traversable.

    // toVector: Vector<A>
    // Converts this Seq to a Vector.

    // withFilter(p: (A) => Boolean): Seq<A>
    // Creates a Seq over all the elements of this Seq that satisfy the predicate p.

    // zip<B>(that: Iterable<B>): Iterable<(A, B)>
    // Creates a Seq formed from this Seq and another Seq by combining corresponding values in pairs.

    // zipAll<B>(that: Iterable<B>, thisElem: A, thatElem: B): Iterable<(A, B)>
    // <use case> Creates a Seq formed from this Seq and another Seq by combining corresponding elements in pairs.

    // zipWithIndex: Iterable<(A, number)>
    // Creates a Seq that pairs each element produced by this Seq with its index, counting from 0.

}

export function seq<A>( ...vals: any[] ): Seq<A> {
    return Seq.from<A>( ...vals )
}


