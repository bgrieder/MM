/**
 * Created by Bruno Grieder.
 */
import {eq} from './impl/Utils'


//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
export interface JSIterator<A> {
    next(): {
        done: boolean
        value?: A
    }
}

export interface JSIterable<A> {
    [Symbol.iterator](): JSIterator<A>
}


const arrayFrom = <A>( iterator: JSIterator<A> ): Array<A> => {
    let a: Array<A> = []
    while ( true ) {
        const n = iterator.next()
        if ( n.done ) {
            return a
        }
        a.push( n.value )
    }
}


export class Iterable<A> implements JSIterable<A> {

    static from<A>(value: any, length?: number): Iterable<A> {
        if ( value instanceof Iterable ) {
            return value
        }
        if ( typeof value[ Symbol.iterator ] === 'undefined' ) {
            throw new Error( 'This value cannot be iterated' )
        }
        return new Iterable<A>(value)
    }

    private _value: JSIterable<A>
    private _length: number

    protected constructor( value: any, length?: number ) {
        this._value = value
    }

    [Symbol.iterator](): JSIterator<A> {
        return this._value[ Symbol.iterator ]() as JSIterator<A>
    }


    build<B>( next: () => { done: boolean, value?: B } ): Iterable<B> {
        const iter: JSIterable<B> = {
            [Symbol.iterator]: () => {
                return {
                    next: next
                }
            }
        }
        return new (this.constructor as any)( iter )
    }


    toArray(): Array<A> {
        return Array.isArray( this._value ) ?
               this._value as Array<A>
            :
               arrayFrom( this._value[ Symbol.iterator ]() as JSIterator<A> )//ES6: Array.from<A>(value) or [... value]
    }




    /**
     * Creates an iterator by transforming values produced by this iterator with a partial function, dropping those values for which the partial function is not defined.
     */
    // collect = <B>(filter: (value: A) => boolean) => (mapper: (value: A) => B) : Iterable<B> =>{
    //     this.file
    // }

    // collectFirst<B>(pf: PartialFunction<A, B>): Option<B>
    // Finds the first element of the traversable or iterator for which the given partial function is defined, and applies the partial function to it.
    // contains(elem: Any): Boolean
    // Tests whether this iterator contains a given value as an element.



    /**
     * [use case] Concatenates this iterator with another.
     */
    concat( that: Iterable<A> ): Iterable<A> {

        const thisIt: JSIterator<A> = this[ Symbol.iterator ]()
        const thatIt: JSIterator<A> = that[ Symbol.iterator ]()

        let useThis = true;
        const next = (): { done: boolean, value?: A } => {
            if ( useThis ) {
                const n = thisIt.next()
                if ( n.done ) {
                    useThis = false
                    return thatIt.next()
                }
                else {
                    return n
                }
            }
            else {
                return thatIt.next()
            }
        }
        return this.build( next )
    }

    equals( that: Iterable<A> ): boolean {

        const thisIt: JSIterator<A> = this[ Symbol.iterator ]()
        const thatIt: JSIterator<A> = that[ Symbol.iterator ]()

        while ( true ) {
            const thisn = thisIt.next()
            const thatn = thatIt.next()
            const bothDone = thisn.done && thatn.done
            if ( bothDone ) {
                return true
            }
            else {
                if ( eq( thisn.value, thatn.value ) ) {
                    continue
                }
            }
            return false
        }
    }

    // exists(p: (A) ⇒ Boolean): Boolean
    // Tests whether a predicate holds for some of the values produced by this iterator.
    // filter(p: (A) ⇒ Boolean): Iterable<A>
    // Returns an iterator over all the elements of this iterator that satisfy the predicate p.
    // filterNot(p: (A) ⇒ Boolean): Iterable<A>
    // Creates an iterator over all the elements of this iterator which do not satisfy a predicate p.
    // find(p: (A) ⇒ Boolean): Option<A>
    // Finds the first value produced by the iterator satisfying a predicate, if any.


    /**
     * Creates a new iterator by applying a function to all values produced by this iterator and concatenating the results.
     */
    flatMap<B>( f: ( value: A, index?: number ) => Iterable<B> ): Iterable<B> {
        return this.map<Iterable<B>>( f ).flatten<B>()
    }

    /**
     * Converts this sequence of iterables into a sequence formed by the elements of the iterables.
     * e.g. Seq( Seq(1,2), Seq(3,4) ).flatten() = Seq(1,2,3,4)
     */
    flatten<U>(): Iterable<U> {

        const it: JSIterator<A> = this[ Symbol.iterator ]()
        let inMain = true
        let subIt: JSIterator<U>

        const iterateInMain = (): { done: boolean, value?: U } => {
            inMain = true
            const n = it.next()
            if ( n.done ) return { done: true }
            if ( n.value instanceof Iterable ) {
                subIt = n.value[ Symbol.iterator ]()
                return iterateInSub()
            }
            return { done: false, value: n.value as any as U } //TODO: check n.value instance of U ?
        }

        const iterateInSub = (): { done: boolean, value?: U } => {
            inMain = false
            const n = subIt.next()
            if ( n.done ) return iterateInMain()
            return { done: false, value: n.value }
        }

        const next = (): { done: boolean, value?: U } => {
            if ( inMain ) {
                return iterateInMain()
            }
            return iterateInSub()
        }
        return this.build( next )
    }


    /**
     * Creates a new iterator that maps all produced values of this iterator to new values using a transformation function.
     */
    map<B>( f: ( value: A, index?: number ) => B ): Iterable<B> {
        const it: JSIterator<A> = this[ Symbol.iterator ]()
        let i = -1
        const next = (): { done: boolean, value?: B } => {
            const n = it.next()
            if ( n.done ) {
                return { done: true }
            }
            i = i + 1
            return { done: false, value: f( n.value, i ) }
        }
        return this.build<B>( next )
    }

    /**
     * The size of this traversable or iterator.
     */
    get size(): number {
        //is it already known ?
        if (typeof this._length !== 'undefined') {
            return this._length
        }
        if ( Array.isArray( this._value ) ) {
            return this._value.length
        }
        let count = 0
        const it: JSIterator<A> = this[ Symbol.iterator ]()
        while(true) {
            if (it.next().done) return count
            count = count +1
        }
    }


    // /:<B>(z: B)(op: (B, A) ⇒ B): B
    // Applies a binary operator to a start value and all elements of this traversable or iterator, going left to right.
    // :\<B>(z: B)(op: (A, B) ⇒ B): B
    // Applies a binary operator to all elements of this traversable or iterator and a start value, going right to left.
    // addString(b: StringBuilder): StringBuilder
    // Appends all elements of this traversable or iterator to a string builder.
    // addString(b: StringBuilder, sep: String): StringBuilder
    // Appends all elements of this traversable or iterator to a string builder using a separator string.
    // addString(b: StringBuilder, start: String, sep: String, end: String): StringBuilder
    // Appends all elements of this traversable or iterator to a string builder using start, end, and separator strings.
    // aggregate<B>(z: ⇒ B)(seqop: (B, A) ⇒ B, combop: (B, B) ⇒ B): B
    // Aggregates the results of applying an operator to subsequent elements.
    // buffered: BufferedIterable<A>
    // Creates a buffered iterator from this iterator.
    // copyToArray(xs: Array<A>, start: Int, len: Int): Unit
    // <use case> Copies selected values produced by this iterator to an array.
    // copyToArray(xs: Array<A>): Unit
    // <use case> Copies the elements of this traversable or iterator to an array.
    // copyToArray(xs: Array<A>, start: Int): Unit
    // <use case> Copies the elements of this traversable or iterator to an array.
    // copyToBuffer<B >: A>(dest: Buffer<B>): Unit
    // Copies all elements of this traversable or iterator to a buffer.
    // corresponds<B>(that: GenTraversableOnce<B>)(p: (A, B) ⇒ Boolean): Boolean
    // Tests whether every element of this iterator relates to the corresponding element of another collection by satisfying a test predicate.
    // count(p: (A) ⇒ Boolean): Int
    // Counts the number of elements in the traversable or iterator which satisfy a predicate.
    // drop(n: Int): Iterable<A>
    // Advances this iterator past the first n elements, or the length of the iterator, whichever is smaller.
    // dropWhile(p: (A) ⇒ Boolean): Iterable<A>
    // Skips longest sequence of elements of this iterator which satisfy given predicate p, and returns an iterator of the remaining elements.
    // duplicate: (Iterable<A>, Iterable<A>)
    // Creates two new iterators that both iterate over the same elements as this iterator (in the same order).
    // fold<A1 >: A>(z: A1)(op: (A1, A1) ⇒ A1): A1
    // Folds the elements of this traversable or iterator using the specified associative binary operator.
    // foldLeft<B>(z: B)(op: (B, A) ⇒ B): B
    // Applies a binary operator to a start value and all elements of this traversable or iterator, going left to right.
    // foldRight<B>(z: B)(op: (A, B) ⇒ B): B
    // Applies a binary operator to all elements of this traversable or iterator and a start value, going right to left.
    // forall(p: (A) ⇒ Boolean): Boolean
    // Tests whether a predicate holds for all values produced by this iterator.
    // foreach(f: (A) ⇒ Unit): Unit
    // <use case> Applies a function f to all values produced by this iterator.
    // grouped<B >: A>(size: Int): GroupedIterable<B>
    // Returns an iterator which groups this iterator into fixed size blocks.
    // hasDefiniteSize: Boolean
    // Tests whether this Iterable has a known size.
    // indexOf<B >: A>(elem: B, from: Int): Int
    // Returns the index of the first occurrence of the specified object in this iterable object after or at some start index.
    // indexOf<B >: A>(elem: B): Int
    // Returns the index of the first occurrence of the specified object in this iterable object.
    // indexWhere(p: (A) ⇒ Boolean, from: Int): Int
    // Returns the index of the first produced value satisfying a predicate, or -1, after or at some start index.
    // indexWhere(p: (A) ⇒ Boolean): Int
    // Returns the index of the first produced value satisfying a predicate, or -1.
    // isEmpty: Boolean
    // Tests whether this iterator is empty.
    // isTraversableAgain: Boolean
    // Tests whether this Iterable can be repeatedly traversed.
    // length: Int
    // Returns the number of elements in this iterator.
    // max: A
    // <use case> Finds the largest element.
    // maxBy<B>(f: (A) ⇒ B): A
    // <use case> Finds the first element which yields the largest value measured by function f.
    // min: A
    // <use case> Finds the smallest element.
    // minBy<B>(f: (A) ⇒ B): A
    // <use case> Finds the first element which yields the smallest value measured by function f.
    // mkString: String
    // Displays all elements of this traversable or iterator in a string.
    // mkString(sep: String): String
    // Displays all elements of this traversable or iterator in a string using a separator string.
    // mkString(start: String, sep: String, end: String): String
    // Displays all elements of this traversable or iterator in a string using start, end, and separator strings.
    // nonEmpty: Boolean
    // Tests whether the traversable or iterator is not empty.
    // padTo(len: Int, elem: A): Iterable<A>
    // <use case> Appends an element value to this iterator until a given target length is reached.
    // partition(p: (A) ⇒ Boolean): (Iterable<A>, Iterable<A>)
    // Partitions this iterator in two iterators according to a predicate.
    // patch<B >: A>(from: Int, patchElems: Iterable<B>, replaced: Int): Iterable<B>
    // Returns this iterator with patched values.
    // product: A
    // <use case> Multiplies up the elements of this collection.
    // reduce<A1 >: A>(op: (A1, A1) ⇒ A1): A1
    // Reduces the elements of this traversable or iterator using the specified associative binary operator.
    // reduceLeft<B >: A>(op: (B, A) ⇒ B): B
    // Applies a binary operator to all elements of this traversable or iterator, going left to right.
    // reduceLeftOption<B >: A>(op: (B, A) ⇒ B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or iterator, going left to right.
    // reduceOption<A1 >: A>(op: (A1, A1) ⇒ A1): Option<A1>
    // Reduces the elements of this traversable or iterator, if any, using the specified associative binary operator.
    // reduceRight<B >: A>(op: (A, B) ⇒ B): B
    // Applies a binary operator to all elements of this traversable or iterator, going right to left.
    // reduceRightOption<B >: A>(op: (A, B) ⇒ B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or iterator, going right to left.
    // sameElements(that: Iterable<_>): Boolean
    // Tests if another iterator produces the same values as this one.
    // scanLeft<B>(z: B)(op: (B, A) ⇒ B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going left to right.
    // scanRight<B>(z: B)(op: (A, B) ⇒ B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going right to left.
    // seq: Iterable<A>
    // A version of this collection with all of the operations implemented sequentially (i.e., in a single-threaded manner).
    // slice(from: Int, until: Int): Iterable<A>
    // Creates an iterator returning an interval of the values produced by this iterator.
    // sliding<B >: A>(size: Int, step: Int = 1): GroupedIterable<B>
    // Returns an iterator which presents a "sliding window" view of another iterator.
    // span(p: (A) ⇒ Boolean): (Iterable<A>, Iterable<A>)
    // Splits this Iterable into a prefix/suffix pair according to a predicate.
    // sum: A
    // <use case> Sums up the elements of this collection.
    // take(n: Int): Iterable<A>
    // Selects first n values of this iterator.
    // takeWhile(p: (A) ⇒ Boolean): Iterable<A>
    // Takes longest prefix of values produced by this iterator that satisfy a predicate.
    // to<Col<_>>: Col<A>
    // <use case> Converts this traversable or iterator into another by copying all elements.
    // toArray: Array<A>
    // <use case> Converts this traversable or iterator to an array.
    // toBuffer<B >: A>: Buffer<B>
    // Uses the contents of this traversable or iterator to create a new mutable buffer.
    // toIndexedSeq: immutable.IndexedSeq<A>
    // Converts this traversable or iterator to an indexed sequence.
    // toIterable: Iterable<A>
    // Converts this traversable or iterator to an iterable collection.
    // toIterable: Iterable<A>
    // Returns an Iterable over the elements in this traversable or iterator.
    // toList: List<A>
    // Converts this traversable or iterator to a list.
    // toMap<T, U>: Map<T, U>
    // <use case> Converts this traversable or iterator to a map.
    // toSeq: Seq<A>
    // Converts this traversable or iterator to a sequence.
    // toSet<B >: A>: immutable.Set<B>
    // Converts this traversable or iterator to a set.
    // toStream: immutable.Stream<A>
    // Converts this traversable or iterator to a stream.
    // toString(): String
    // Converts this iterator to a string.
    // toTraversable: Traversable<A>
    // Converts this traversable or iterator to an unspecified Traversable.
    // toVector: Vector<A>
    // Converts this traversable or iterator to a Vector.
    // withFilter(p: (A) ⇒ Boolean): Iterable<A>
    // Creates an iterator over all the elements of this iterator that satisfy the predicate p.
    // zip<B>(that: Iterable<B>): Iterable<(A, B)>
    // Creates an iterator formed from this iterator and another iterator by combining corresponding values in pairs.
    // zipAll<B>(that: Iterable<B>, thisElem: A, thatElem: B): Iterable<(A, B)>
    // <use case> Creates an iterator formed from this iterator and another iterator by combining corresponding elements in pairs.
    // zipWithIndex: Iterable<(A, Int)>
    // Creates an iterator that pairs each element produced by this iterator with its index, counting from 0.

}

export function iterable<A>( jsIterable: any, length?: number ): Iterable<A> {
    return Iterable.from<A>( jsIterable, length )
}


// export interface Product {
//
//     /**
//      * A method that should be called from every well-designed equals method that is open to be overridden in a subclass.
//      */
//     canEqual( that: any ): boolean
//
//     /**
//      * The size of this product.
//      */
//     productArity: number
//
//     /**
//      * The nth element of this product, 0-based.
//      */
//     productElement( n: number ): any
//
//     /**
//      * An iterator over all the elements of this product.
//      */
//     productIterator: Iterator<any>
//
//     /**
//      * A string used in the toString methods of derived classes.
//      */
//     productPrefix: string
// }

//
// export const Produceable = <T extends Constructor<{}>>( Base: T ) =>
//     class extends Base implements Product {
//
//         canEqual( that: any ): boolean {
//             throw new Error( 'Method not implemented.' );
//         }
//
//         productArity: number;
//
//         productElement( n: number ) {
//             throw new Error( 'Method not implemented.' );
//         }
//
//         productIterator: Iterator<any>;
//         productPrefix: string;
//     } as Constructor<Product> & T


// export class A {
//     getValue(): string { return "blah" }
// }
//
// const B = Produceable( A )
//
// const b = new B()
// b.getValue()

