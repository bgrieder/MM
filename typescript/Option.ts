/**
 * Created by Bruno Grieder.
 */
import {eq} from './impl/Utils'
import {Collection, Iterator} from './Iter'


export abstract class Option<A> extends Collection<A> {


    // Abstract Value Members

    /**
     * Test whether these two Options are equal by testing equality on their values
     * Equality on values is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    abstract equals( that: Collection<A> ): boolean

    /**
     * Returns the option's value.
     */
    abstract get get(): A

    /**
     * Returns true if the option is None, false otherwise.
     */
    abstract get isEmpty(): boolean

    /**
     * The size of this Option
     */
    abstract get size(): number


    // abstract def productElement(n: number): any
    // The nth element of this product, 0-based.

    // Concrete Value Members


    // ++<B>(that: GenTraversableOnce<B>): Option<B>
    // <use case> Returns a new option containing the elements from the left hand operand followed by the elements from the right hand operand.

    // ++:<B >: A, That>(that: collection.Traversable<B>)(implicit bf: CanBuildFrom<collection.Seq<A>, B, That>): That
    // As with ++, returns a new collection containing the elements from the left operand followed by the elements from the right operand.

    // ++:<B>(that: collection.TraversableOnce<B>): Option<B>
    // <use case> As with ++, returns a new collection containing the elements from the left operand followed by the elements from the right operand.

    // /:<B>(z: B)(op: (B, A) => B): B
    // Applies a binary operator to a start value and all elements of this iterable collection, going left to right.

    // :\<B>(z: B)(op: (A, B) => B): B
    // Applies a binary operator to all elements of this iterable collection and a start value, going right to left.

    // addstring(b: stringBuilder): stringBuilder
    // Appends all elements of this iterable collection to a string builder.

    // addstring(b: stringBuilder, sep: string): stringBuilder
    // Appends all elements of this iterable collection to a string builder using a separator string.

    // addstring(b: stringBuilder, start: string, sep: string, end: string): stringBuilder
    // Appends all elements of this iterable collection to a string builder using start, end, and separator strings.

    // aggregate<B>(z: => B)(seqop: (B, A) => B, combop: (B, B) => B): B
    // Aggregates the results of applying an operator to subsequent elements.

    /**
     * Returns a Some containing the result of applying pf to this Option's contained value, if this option is nonempty and pf is defined for that value.
     */
    collect<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Option<B> {
        return ( mapper: ( value: A ) => B ) => this.isEmpty ? this as None  : this.filter( filter ).map( mapper )
    }

    // collectFirst<B>(pf: PartialFunction<A, B>): Option<B>
    // Finds the first element of the iterable collection for which the given partial function is defined, and applies the partial function to it.

    // companion: GenericCompanion<collection.Seq>
    // The factory companion object that builds instances of class Seq.

    // concat( that: Seq<A> ): Option<A> {
    //     return super.concat( that ) as Option<A>
    // }


    // contains<A1 >: A>(elem: A1): boolean
    // Tests whether the option contains a given value as an element.

    // copyToArray(xs: Array<A>, start: number, len: number): Unit
    // <use case> Copies the elements of this option to an array.

    // copyToArray(xs: Array<A>): Unit
    // <use case> Copies the elements of this option to an array.

    // copyToArray(xs: Array<A>, start: number): Unit
    // <use case> Copies the elements of this option to an array.

    // copyToBuffer<B >: A>(dest: Buffer<B>): Unit
    // Copies all elements of this iterable collection to a buffer.

    // count(p: (A) => boolean): number
    // Counts the number of elements in the iterable collection which satisfy a predicate.

    // drop(n: number): collection.Seq<A>
    // Selects all elements except first n ones.

    // dropRight(n: number): collection.Seq<A>
    // Selects all elements except last n ones.

    // dropWhile(p: (A) => boolean): collection.Seq<A>
    // Drops longest prefix of elements that satisfy a predicate.

    // exists(p: (A) => boolean): boolean
    // Returns true if this option is nonempty and the predicate p returns true when applied to this Option's value.

    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns true.
     */
    filter( f: ( value: A ) => boolean ): Option<A> {
        return this.isEmpty || f(this.get) ? this : none()
    }

    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns false.
     */
    filterNot( f: ( value: A ) => boolean ): Option<A> {
        return this.isEmpty || !f(this.get) ? this : none()
    }

    // find(p: (A) => boolean): Option<A>
    // Finds the first element of the iterable collection satisfying a predicate, if any.

    /**
     * Returns the result of applying f to this Option's value if this Option is nonempty.
     */
    flatMap<U>( f: ( value: A ) => Option<U> ): Option<U> {
        return this.isEmpty ? this as None  :  super.flatMap( f ) as Option<U>
    }

    flatten<U>(): Option<U> {
        return this.isEmpty ? this as None  :  super.flatten() as Option<U>
    }


    // fold<B>(ifEmpty: => B)(f: (A) => B): B
    // Returns the result of applying f to this Option's value if the Option is nonempty.

    // foldLeft<B>(z: B)(op: (B, A) => B): B
    // Applies a binary operator to a start value and all elements of this iterable collection, going left to right.

    // foldRight<B>(z: B)(op: (A, B) => B): B
    // Applies a binary operator to all elements of this iterable collection and a start value, going right to left.

    // forall(p: (A) => boolean): boolean
    // Returns true if this option is empty or the predicate p returns true when applied to this Option's value.

    // foreach<U>(f: (A) => U): Unit
    // Apply the given procedure f to the option's value, if it is nonempty.

    // genericBuilder<B>: Builder<B, collection.Seq<B>>
    // The generic builder that builds instances of Seq at arbitrary element types.

    // getOrElse<B >: A>(default: => B): B
    // Returns the option's value if the option is nonempty, otherwise return the result of evaluating default.

    // groupBy<K>(f: (A) => K): Map<K, collection.Seq<A>>
    // Partitions this iterable collection into a map of iterable collections according to some discriminator function.

    // grouped(size: number): collection.Iterator<collection.Seq<A>>
    // Partitions elements in fixed size iterable collections.

    // hasDefiniteSize: boolean
    // Tests whether this iterable collection is known to have a finite size.

    // head: A
    // Selects the first element of this iterable collection.

    // headOption: Option<A>
    // Optionally selects the first element.

    // init: collection.Seq<A>
    // Selects all elements except the last.

    // inits: collection.Iterator<collection.Seq<A>>
    // Iterates over the inits of this iterable collection.

    // isDefined: boolean
    // Returns true if the option is an instance of Some, false otherwise.

    // isTraversableAgain: boolean
    // Tests whether this iterable collection can be repeatedly traversed.

    // iterator: Iterator<A>
    // Returns a singleton iterator returning the Option's value if it is nonempty, or an empty iterator if the option is empty.

    // last: A
    // Selects the last element.

    // lastOption: Option<A>
    // Optionally selects the last element.

    /**
     * Returns a Some containing the result of applying f to this Option's value if this Option is nonempty.
     */
    map<U>( f: ( value: A ) => U ): Option<U> {
        return this.isEmpty ? this as None : super.map( f ) as Option<U>
    }

    // max: A
    // <use case> Finds the largest element.

    // maxBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the largest value measured by function f.

    // min: A
    // <use case> Finds the smallest element.

    // minBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the smallest value measured by function f.

    // mkstring: string
    // Displays all elements of this iterable collection in a string.

    // mkstring(sep: string): string
    // Displays all elements of this iterable collection in a string using a separator string.

    // mkstring(start: string, sep: string, end: string): string
    // Displays all elements of this iterable collection in a string using start, end, and separator strings.

    // nonEmpty: boolean
    // Returns false if the option is None, true otherwise.

    // orElse<B >: A>(alternative: => Option<B>): Option<B>
    // Returns this Option if it is nonempty, otherwise return the result of evaluating alternative.

    // orNull<A1 >: A>(implicit ev: <:<<Null, A1>): A1
    // Returns the option's value if it is nonempty, or null if it is empty.

    // par: ParSeq<A>
    // Returns a parallel implementation of this collection.

    // partition(p: (A) => boolean): (collection.Seq<A>, collection.Seq<A>)
    // Partitions this iterable collection in two iterable collections according to a predicate.

    // product: A
    // <use case> Multiplies up the elements of this collection.

    // productIterator: Iterator<Any>
    // An iterator over all the elements of this product.

    // productPrefix: string
    // A string used in the tostring methods of derived classes.

    // reduce<A1 >: A>(op: (A1, A1) => A1): A1
    // Reduces the elements of this iterable collection using the specified associative binary operator.

    // reduceLeft<B >: A>(op: (B, A) => B): B
    // Applies a binary operator to all elements of this iterable collection, going left to right.

    // reduceLeftOption<B >: A>(op: (B, A) => B): Option<B>
    // Optionally applies a binary operator to all elements of this iterable collection, going left to right.

    // reduceOption<A1 >: A>(op: (A1, A1) => A1): Option<A1>
    // Reduces the elements of this iterable collection, if any, using the specified associative binary operator.

    // reduceRight<B >: A>(op: (A, B) => B): B
    // Applies a binary operator to all elements of this iterable collection, going right to left.

    // reduceRightOption<B >: A>(op: (A, B) => B): Option<B>
    // Optionally applies a binary operator to all elements of this iterable collection, going right to left.

    // repr: collection.Seq<A>
    // The collection of type iterable collection underlying this TraversableLike object.

    // sameElements(that: GenSeq<A>): boolean
    // <use case> Checks if the other iterable collection contains the same elements in the same order as this option.

    // scan<B >: A, That>(z: B)(op: (B, B) => B)(implicit cbf: CanBuildFrom<collection.Seq<A>, B, That>): That
    // Computes a prefix scan of the elements of the collection.

    // scanLeft<B, That>(z: B)(op: (B, A) => B)(implicit bf: CanBuildFrom<collection.Seq<A>, B, That>): That
    // Produces a collection containing cumulative results of applying the operator going left to right.

    // scanRight<B, That>(z: B)(op: (A, B) => B)(implicit bf: CanBuildFrom<collection.Seq<A>, B, That>): That
    // Produces a collection containing cumulative results of applying the operator going right to left.

    // seq: collection.Seq<A>
    // A version of this collection with all of the operations implemented sequentially (i.e., in a single-threaded manner).

    // size: number
    // The size of this iterable collection.

    // slice(from: number, until: number): collection.Seq<A>
    // Selects an interval of elements.

    // sliding(size: number, step: number): collection.Iterator<collection.Seq<A>>
    // Groups elements in fixed size blocks by passing a "sliding window" over them (as opposed to partitioning them, as is done in grouped.)

    // sliding(size: number): collection.Iterator<collection.Seq<A>>
    // Groups elements in fixed size blocks by passing a "sliding window" over them (as opposed to partitioning them, as is done in grouped.) "Sliding window" step is 1 by default.

    // span(p: (A) => boolean): (collection.Seq<A>, collection.Seq<A>)
    // Splits this iterable collection into a prefix/suffix pair according to a predicate.

    // splitAt(n: number): (collection.Seq<A>, collection.Seq<A>)
    // Splits this iterable collection into two at a given position.

    // stringPrefix: string
    // Defines the prefix of this object's tostring representation.

    // sum: A
    // <use case> Sums up the elements of this collection.

    // tail: collection.Seq<A>
    // Selects all elements except the first.

    // tails: collection.Iterator<collection.Seq<A>>
    // Iterates over the tails of this iterable collection.

    // take(n: number): collection.Seq<A>
    // Selects first n elements.

    // takeRight(n: number): collection.Seq<A>
    // Selects last n elements.

    // takeWhile(p: (A) => boolean): collection.Seq<A>
    // Takes longest prefix of elements that satisfy a predicate.

    // to<Col<_>>: Col<A>
    // <use case> Converts this option into another by copying all elements.

    // toArray: Array<A>
    // <use case> Converts this option to an array.

    // toBuffer<B >: A>: Buffer<B>
    // Uses the contents of this iterable collection to create a new mutable buffer.

    // toIndexedSeq: collection.immutable.IndexedSeq<A>
    // Converts this iterable collection to an indexed sequence.

    // toSeq: collection.Seq<A>
    // Returns this iterable collection as an iterable collection.

    // toIterator: collection.Iterator<A>
    // Returns an Iterator over the elements in this iterable collection.

    // toLeft<X>(right: => X): util.Either<A, X>
    // Returns a util.Right containing the given argument right if this is empty, or a util.Left containing this Option's value if this Option is nonempty.

    // toList: List<A>
    // Returns a singleton list containing the Option's value if it is nonempty, or the empty list if the Option is empty.

    // toMap<T, U>: Map<T, U>
    // <use case> Converts this option to a map.

    // toRight<X>(left: => X): util.Either<X, A>
    // Returns a util.Left containing the given argument left if this Option is empty, or a util.Right containing this Option's value if this is nonempty.

    // toSeq: collection.Seq<A>
    // Converts this iterable collection to a sequence.

    // toSet<B >: A>: Set<B>
    // Converts this iterable collection to a set.

    // toStream: collection.immutable.Stream<A>
    // Converts this iterable collection to a stream.

    // toTraversable: collection.Traversable<A>
    // Converts this iterable collection to an unspecified Traversable.

    // toVector: Vector<A>
    // Converts this iterable collection to a Vector.

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

    // withFilter(p: (A) => boolean): WithFilter
    // Necessary to keep Option from being implicitly converted to collection.Seq in for comprehensions.

    // zip<B>(that: GenSeq<B>): Option<(A, B)>
    // <use case> Returns a option formed from this option and another iterable collection by combining corresponding elements in pairs.

    // zipAll<B>(that: collection.Seq<B>, thisElem: A, thatElem: B): Option<(A, B)>
    // <use case> Returns a option formed from this option and another iterable collection by combining corresponding elements in pairs.

    // zipWithIndex: Option<(A, number)>
    // <use case> Zips this option with its indices.
    // Shadowed Implicit Value Members

    // canEqual(that: any): boolean
    // Method called from equality methods, so that user-defined subclasses can refuse to be equal to other collections of the same kind.

    // collect<B>(pf: PartialFunction<A, B>): Option<B>
    // <use case> Builds a new collection by applying a partial function to all elements of this option on which the function is defined.

    // exists(p: (A) => boolean): boolean
    // Tests whether a predicate holds for at least one element of this iterable collection.

    // filter(p: (A) => boolean): collection.Seq<A>
    // Selects all elements of this iterable collection which satisfy a predicate.

    // filterNot(p: (A) => boolean): collection.Seq<A>
    // Selects all elements of this iterable collection which do not satisfy a predicate.

    // flatMap<B>(f: (A) => GenTraversableOnce<B>): Option<B>
    // <use case> Builds a new collection by applying a function to all elements of this option and using the elements of the resulting collections.

    // flatten<B>: Option<B>
    // <use case> Converts this option of traversable collections into a option formed by the elements of these traversable collections.

    // fold<A1 >: A>(z: A1)(op: (A1, A1) => A1): A1
    // Folds the elements of this iterable collection using the specified associative binary operator.

    // forall(p: (A) => boolean): boolean
    // Tests whether a predicate holds for all elements of this iterable collection.

    // foreach(f: (A) => Unit): Unit
    // <use case> Applies a function f to all elements of this option.

    // isEmpty: boolean
    // Tests whether this iterable collection is empty.

    // iterator: collection.Iterator<A>
    // Creates a new iterator over all elements contained in this iterable object.

    // map<B>(f: (A) => B): Option<B>
    // <use case> Builds a new collection by applying a function to all elements of this option.

    // nonEmpty: boolean
    // Tests whether the iterable collection is not empty.

    // toList: List<A>
    // Converts this iterable collection to a list.

    // tostring(): string
    // Converts this iterable collection to a string.

    // withFilter(p: (A) => boolean): FilterMonadic<A, collection.Seq<A>>
    // Creates a non-strict filter of this iterable collection.




    // filterNot( test: ( value: A ) => boolean ): Option<A> {
    //     return undefined
    // }



    orElse( alternative: () => Option<A> ): Option<A> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        const n = it.next()
        if ( n.done ) {
            return alternative()
        }
        return this
    }


    getOrElse<U>( elseVal: () => U ): A | U {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        const n = it.next()
        if ( n.done ) {
            return elseVal()
        }
        return n.value
    }


    get toPromise(): Promise<A> {
        return this.map( v => Promise.resolve( v ) ).getOrElse( () => Promise.reject( new Error( 'No such element None.get' ) ) )
    }

}

export class Some<A> extends Option<A> {

    static from<A>( value: any ): Some<A> {
        return new Some<A>( [ value ] )
    }

    equals( that: Option<A> ): boolean {
        if ( that instanceof Some ) {
            return eq( this.get, that.get )
        }
        return false
    }

    get get(): A {
        return this.head
    }


    get isEmpty(): boolean {
        return false
    }

    get size(): number {
        return 1
    }
}

export function some<A>( value: A ): Some<A> {
    return Some.from<A>( value )
}


export class None extends Option<any> {

    static from( ): None {
        return new None([])
    }

    equals( that: Option<any> ): boolean {
        return that instanceof None
    }

    //noinspection JSMethodCanBeStatic
    get get(): any {
        throw new Error("No such element")
    }


    get isEmpty(): boolean {
        return true
    }

    get size(): number {
        return 0
    }
}

export function none( ) {
    return None.from(  )
}


export function option<A>( value: A ): Option<A> {
    return (typeof value === 'undefined' || value === null) ? this : some<A>(value)
}

