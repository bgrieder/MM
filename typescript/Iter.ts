/**
 * Created by Bruno Grieder.
 */
import {eq} from './impl/Utils'


//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
export interface Iterator<A> {
    next(): {
        done: boolean
        value?: A
    }
}

export interface Iterable<A> {
    [Symbol.iterator](): Iterator<A>
    length?: number
    reverseIterator?: () => Iterator<A>
}


const arrayFrom = <A>( iterator: Iterator<A> ): Array<A> => {
    //initializing with the len does not seem to add a benefit: http://stackoverflow.com/questions/18947892/creating-range-in-javascript-strange-syntax
    let a: A[] = []
    while ( true ) {
        const n = iterator.next()
        if ( n.done ) {
            return a
        }
        a.push( n.value )
    }
}

/**
 * The base class from which all other monads are created
 * It really is an extension of ES6 Iterable
 */
export abstract class Iter<A> implements Iterable<A> {

    private _value: Iterable<A>

    protected constructor( value: any) {
        this._value = value
    }

    [Symbol.iterator](): Iterator<A> {
        return this._value[ Symbol.iterator ]() as Iterator<A>
    }

    build<B>( next: () => { done: boolean, value?: B } ): Iter<B> {
        const iter: Iterable<B> = {
            [Symbol.iterator]: () => {
                return {
                    next: next
                }
            }
        }
        return new (this.constructor as any)( iter )
    }


    ///////////////////////////////////////////

    // /:<B>(z: B)(op: (B, A) => B): B
    // Applies a binary operator to a start value and all elements of this traversable or Iter, going left to right.

    // :\<B>(z: B)(op: (A, B) => B): B
    // Applies a binary operator to all elements of this Iter and a start value, going right to left.

    // addString(b: StringBuilder): StringBuilder
    // Appends all elements of this Iter to a string builder.

    // addString(b: StringBuilder, sep: String): StringBuilder
    // Appends all elements of this Iter to a string builder using a separator string.

    // addString(b: StringBuilder, start: String, sep: String, end: String): StringBuilder
    // Appends all elements of this Iter to a string builder using start, end, and separator strings.

    // aggregate<B>(z: => B)(seqop: (B, A) => B, combop: (B, B) => B): B
    // Aggregates the results of applying an operator to subsequent elements.

    /**
     * Returns the element at index.
     * The first element is at index 0
     * O(1) if the underlying iterable is an IndexedIter, O(n) otherwise
     */
    at( index: number ): A {
        if ( index < 0 ) {
            throw new Error( 'Invalid index: ' + index )
        }
        if ( Array.isArray( this._value ) ) {
            return this._value[ index ]
        }
        if ( typeof this._value === 'string' ) {
            return (this._value as string).charAt( index ) as any as A
        }
        const it: Iterator<A> = this[ Symbol.iterator ]()
        let i = 0
        while ( true ) {
            const n = it.next()
            if ( n.done ) throw new Error( "No such Element" )
            if ( i === index ) {
                return n.value
            }
        }
    }

    // buffered: BufferedIter<A>
    // Creates a buffered Iter from this Iter.

    /**
     * Creates a Iter by transforming values produced by this Iter with a partial function, dropping those values for which the partial function is not defined.
     */
    collect<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Iter<B> {
        return ( mapper: ( value: A ) => B ) => this.filter( filter ).map( mapper )
    }


    //collectFirst<B>(pf: PartialFunction<A, B>): Option<B>
    // Finds the first element of the Iter for which the given partial function is defined, and applies the partial function to it.

    /**
     * Tests whether this Iter contains a given value as an element.
     */
    contains( elem: any ): boolean {
        return this.indexOf( elem ) !== -1
    }

    /**
     * [use case] Concatenates this Iter with another.
     */
    concat( that: Iter<A> ): Iter<A> {

        const thisIt: Iterator<A> = this[ Symbol.iterator ]()
        const thatIt: Iterator<A> = that[ Symbol.iterator ]()

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

    // copyToArray(xs: Array<A>, start: number, len: number): Unit
    // <use case> Copies selected values produced by this Iter to an array.

    // copyToArray(xs: Array<A>): Unit
    // <use case> Copies the elements of this Iter to an array.

    // copyToArray(xs: Array<A>, start: number): Unit
    // <use case> Copies the elements of this Iter to an array.

    // copyToBuffer<B >: A>(dest: Buffer<B>): Unit
    // Copies all elements of this Iter to a buffer.

    // corresponds<B>(that: GenTraversableOnce<B>)(p: (A, B) => Boolean): Boolean
    // Tests whether every element of this Iter relates to the corresponding element of another collection by satisfying a test predicate.


    /**
     * Counts the number of elements in the Iter which satisfy a predicate.
     */
    count( p: ( value: A ) => boolean ): number {
        return this.filter( p ).size
    }


    /**
     * Advances this Iter past the first n elements, or the length of the Iter, whichever is smaller.
     */
    drop( n: number ): Iter<A> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        let i = 0
        const next = (): { done: boolean, value?: A } => {
            const nv = it.next()
            if ( nv.done ) {
                return { done: true }
            }
            i = i + 1
            if ( i <= n ) {
                return next()
            }
            return { done: false, value: nv.value }
        }
        return this.build<A>( next )
    }

    // dropWhile(p: (A) => Boolean): Iter<A>
    // Skips longest Iteruence of elements of this Iter which satisfy given predicate p, and returns a Iter of the remaining elements.

    // duplicate: (Iter<A>, Iter<A>)
    // Creates two new Iters that both iterate over the same elements as this Iter (in the same order).

    /**
     * Test whether these two Iters are equal by testing equality on all elements
     * Equality on elements is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    equals( that: Iter<A> ): boolean {

        const thisIt: Iterator<A> = this[ Symbol.iterator ]()
        const thatIt: Iterator<A> = that[ Symbol.iterator ]()

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

    /**
     * Tests whether a predicate holds for some of the values produced by this Iter.
     */
    exists( p: ( value: A ) => boolean ): boolean {
        return this.filter( p ).take( 1 ).size === 1
    }

    /**
     * Returns a Iter over all the elements of this Iter that satisfy the predicate p.
     */
    filter( filter: ( value: A ) => boolean ): Iter<A> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        const next = (): { done: boolean, value?: A } => {
            const n = it.next()
            if ( n.done ) {
                return { done: true }
            }
            if ( filter( n.value ) ) {
                return { done: false, value: n.value }
            }
            return next()
        }
        return this.build<A>( next )
    }

    /**
     * Creates a Iter over all the elements of this Iter which do not satisfy a predicate p.
     */
    filterNot( filter: ( value: A ) => boolean ): Iter<A> {
        return this.filter( ( value: A ) => !filter( value ) )
    }

    // /**
    //  * Finds the first value produced by the Iter satisfying a predicate, if any.
    //  */
    // find(p: (value: A) => boolean): Option<A> {
    //     const it: Iterator<A> = this[ Symbol.iterator ]()
    //     for ( let n = it.next(); !n.done; n = it.next() ) {
    //         if (p( n.value )) return some<A>(n.value)
    //     }
    //     return none()
    // }

    /**
     * Creates a new Iter by applying a function to all values produced by this Iter and concatenating the results.
     */
    flatMap<B>( f: ( value: A, index?: number ) => Iter<B> ): Iter<B> {
        return this.map<Iter<B>>( f ).flatten<B>()
    }

    /**
     * Converts this Iteruence of iterables into a Iteruence formed by the elements of the iterables.
     * e.g. Iter( Iter(1,2), Iter(3,4) ).flatten() = Iter(1,2,3,4)
     */
    flatten<U>(): Iter<U> {

        const it: Iterator<A> = this[ Symbol.iterator ]()
        let inMain = true
        let subIt: Iterator<U>

        const iterateInMain = (): { done: boolean, value?: U } => {
            inMain = true
            const n = it.next()
            if ( n.done ) return { done: true }
            if ( n.value instanceof Iter ) {
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

    // fold<A1 >: A>(z: A1)(op: (A1, A1) => A1): A1
    // Folds the elements of this Iter using the specified associative binary operator.

    /**
     * Applies a binary operator to a start value and all elements of Iter, going left to right.
     */
    foldLeft<B>( initialValue: B ): ( op: ( accumulator: B, value: A, index?: number ) => B ) => B {
        return ( op: ( accumulator: B, value: A, index?: number ) => B ): B => {
            const it: Iterator<A> = this[ Symbol.iterator ]()
            let z = initialValue
            let i = 0
            for ( let n = it.next(); !n.done; n = it.next() ) {
                z = op( z, n.value, i )
                i = i + 1
            }
            return z
        }
    }

    /**
     * Applies a binary operator to all elements of Iter and a start value, going right to left.
     */
    foldRight<B>( initialValue: B ): ( op: ( accumulator: B, value: A, index?: number ) => B ) => B {
        return ( op: ( accumulator: B, value: A, index?: number ) => B ): B => this.reverse.foldLeft( initialValue )( op )
    }

    // forall(p: (A) => Boolean): Boolean
    // Tests whether a predicate holds for all values produced by this Iter.

    /**
     * Applies a function f to all values produced by this Iter.
     */
    foreach( f: ( value: A ) => void ): void {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        for ( let n = it.next(); !n.done; n = it.next() ) {
            f( n.value )
        }
    }

    // grouped<B >: A>(size: number): GroupedIterable<B>
    // Returns a Iter which groups this Iter into fixed size blocks.

    /**
     * Tests whether this Iterable has a known size.
     */
    get hasDefiniteSize(): boolean {
        return typeof this._value.length !== 'undefined' || Array.isArray( this._value )
    }

    /**
     * Selects the first element of this Iter
     */
    get head(): A {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        const n = it.next()
        if ( n.done ) throw new Error( "No such element" )
        return n.value
    }


    /**
     * Returns the index of the first occurrence of the specified object in Iter after or at some optional start index.
     */
    indexOf( elem: A, from?: number ): number {
        if ( Array.isArray( this._value ) ) {
            return this._value.indexOf( elem, from )
        }
        const start = typeof from === 'undefined' ? 0 : from
        const it: Iterator<A> = this[ Symbol.iterator ]()
        let index = -1
        while ( true ) {
            const n = it.next()
            if ( n.done ) return -1
            index = index + 1
            if ( index >= start ) {
                if ( eq( n.value, elem ) ) return index
            }
        }
    }


    // indexWhere(p: (A) => Boolean, from: number): number
    // Returns the index of the first produced value satisfying a predicate, or -1, after or at some start index.

    // indexWhere(p: (A) => Boolean): number
    // Returns the index of the first produced value satisfying a predicate, or -1.

    /**
     * Tests whether this Iter is empty.
     */
    get isEmpty(): boolean {
        return this.size === 0
    }

    /**
     * Tests whether this Iter is an Indexed Iter
     * i.e. its elements can be accessed using an index
     */
    get isIndexed(): boolean {
        return Array.isArray( this._value ) || typeof this._value === 'string'
    }

    // isTraversableAgain: Boolean
    // Tests whether this Iterable can be repeatedly traversed.

    /**
     * Returns the number of elements in this Iter.
     */
    get length(): number {
        return this.size
    }

    /**
     * Creates a new Iter that maps all produced values of this Iter to new values using a transformation function.
     */
    map<B>( f: ( value: A, index?: number ) => B ): Iter<B> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
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

    // max: A
    // <use case> Finds the largest element.

    // maxBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the largest value measured by function f.

    // min: A
    // <use case> Finds the smallest element.

    // minBy<B>(f: (A) => B): A
    // <use case> Finds the first element which yields the smallest value measured by function f.

    /**
     * Displays all elements of this Iter in a string using an optional separator string.
     */
    mkString( sep?: string ): string;

    /**
     * Displays all elements of this Iter in a string using start, end, and separator strings.
     */
    mkString( start?: string, sep?: string, end?: string ): string;

    /**
     * Displays all elements of this Iter in a string using start, end, and separator strings.
     */
    mkString( startOrSep?: string, sep?: string, end?: string ): string {
        if ( typeof startOrSep === 'undefined' ) {
            startOrSep = ''
            sep = ''
            end = ''
        }
        else if ( typeof sep === 'undefined' ) {
            //startOrSep is actually sep
            sep = startOrSep
            startOrSep = ''
            end = ''
        }
        return this.foldLeft( '' )( ( s, v, i ) => {
                return s + (i == 0 ? startOrSep : sep) + v.toString()
            } ) + end
    }


    // nonEmpty: Boolean
    // Tests whether the Iter is not empty.

    // padTo(len: number, elem: A): Iter<A>
    // <use case> Appends an element value to this Iter until a given target length is reached.

    // partition(p: (A) => Boolean): (Iter<A>, Iter<A>)
    // Partitions this Iter in two Iters according to a predicate.

    // patch<B >: A>(from: number, patchElems: Iterable<B>, replaced: number): Iterable<B>
    // Returns this Iter with patched values.

    // product: A
    // <use case> Multiplies up the elements of this collection.

    // reduce<A1 >: A>(op: (A1, A1) => A1): A1
    // Reduces the elements of this Iter using the specified associative binary operator.

    // reduceLeft<B >: A>(op: (B, A) => B): B
    // Applies a binary operator to all elements of this traversable or Iter, going left to right.

    // reduceLeftOption<B >: A>(op: (B, A) => B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or Iter, going left to right.

    // reduceOption<A1 >: A>(op: (A1, A1) => A1): Option<A1>
    // Reduces the elements of this traversable or Iter, if any, using the specified associative binary operator.

    // reduceRight<B >: A>(op: (A, B) => B): B
    // Applies a binary operator to all elements of this traversable or Iter, going right to left.

    // reduceRightOption<B >: A>(op: (A, B) => B): Option<B>
    // Optionally applies a binary operator to all elements of this traversable or Iter, going right to left.

    /**
     * Returns a new Iter with the elements in reverse order
     * If a reverse iterator is available, it will be used otherwise:
     *      - reversing an indexed Iter will return a linear (non indexed Iter).
     *      - reversing a linear Iter will create an indexed Iter by by loading its content into an im-memory array
     */
    get reverse(): Iter<A> {
        if ( typeof this._value.reverseIterator !== 'undefined' ) {
            return  new (this.constructor as any)( {
                                   [Symbol.iterator]: this._value.reverseIterator,
                                   length:            this._value.length,
                                   reverseIterator:   this._value[ Symbol.iterator ]
                               } )
        }
        if ( this.isIndexed ) {
            let index = this.length
            const next = (): { done: boolean, value?: A } => {
                if ( index <= 0 ) {
                    return { done: true }
                }
                index = index - 1
                return { done: false, value: this.at( index ) }
            }
            return this.build<A>( next )
        }
        return  new (this.constructor as any)(this.toArray.reverse())
    }

    // sameElements(that: Iterable<_>): Boolean
    // Tests if another Iter produces the same values as this one.

    // scanLeft<B>(z: B)(op: (B, A) => B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going left to right.

    // scanRight<B>(z: B)(op: (A, B) => B): Iterable<B>
    // Produces a collection containing cumulative results of applying the operator going right to left.

    /**
     * The size of this Iter.
     */
    get size(): number {
        //is it already known ?
        if ( typeof this._value.length !== 'undefined' ) {
            return this._value.length
        }
        let count = 0
        const it: Iterator<A> = this[ Symbol.iterator ]()
        while ( true ) {
            if ( it.next().done ) return count
            count = count + 1
        }
    }

    /**
     * Creates a Iter returning an interval of the values produced by this Iter.
     */
    slice( from: number, until: number ): Iter<A> {
        return Array.isArray( this._value ) ?
               new (this.constructor as any)( this._value.slice( from, until ) )
            :
               this.drop( from ).take( until - from )
    }

    // sliding<B >: A>(size: number, step: number = 1): GroupedIterable<B>
    // Returns a Iter which presents a "sliding window" view of another Iter.

    // span(p: (A) => Boolean): (Iter<A>, Iter<A>)
    // Splits this Iterable into a prefix/suffix pair according to a predicate.

    /**
     * Sums up the elements of this collection.
     */
    get sum(): A {
        const first = this.head
        return this.tail.foldLeft( first )( ( s: any, v ) => s + v )  //any is to trick the compiler
    }

    /**
     * Selects all elements but the first
     */
    get tail(): Iter<A> {
        return this.drop( 1 )
    }

    /**
     * Selects first n values of this Iter.
     */
    take( n: number ): Iter<A> {
        const it: Iterator<A> = this[ Symbol.iterator ]()
        let i = 0
        const next = (): { done: boolean, value?: A } => {
            if ( i === n ) {
                return { done: true }
            }
            const next = it.next()
            if ( next.done ) {
                return { done: true }
            }
            i = i + 1
            return { done: false, value: next.value }
        }
        return this.build<A>( next )
    }

    // takeWhile(p: (A) => Boolean): Iter<A>
    // Takes longest prefix of values produced by this Iter that satisfy a predicate.

    // to<Col<_>>: Col<A>
    // <use case> Converts this Iter into another by copying all elements.

    /**
     * Converts this Iter to an array.
     */
    get toArray(): Array<A> {
        return Array.isArray( this._value ) ?
               this._value.slice() as Array<A>
            :
               arrayFrom( this._value[ Symbol.iterator ]() as Iterator<A> )//ES6: Array.from<A>(value) or [... value]
    }

    // toBuffer<B >: A>: Buffer<B>
    // Uses the contents of this Iter to create a new mutable buffer.

    /**
     * Converts this Iter to an indexed Iter is it not already one
     * by creating an in memory array with the content
     */
    get toIndexed(): Iter<A> {
        if (this.isIndexed) return this
        return  new (this.constructor as any)(this.toArray)
    }

    // toList: List<A>
    // Converts this Iter to a list.

    // toMap<T, U>: Map<T, U>
    // <use case> Converts this Iter to a map.

    // toSet<B >: A>: immutable.Set<B>
    // Converts this Iter to a set.

    // toStream: immutable.Stream<A>
    // Converts this Iter to a stream.

    /**
     * Converts this Iter to a string.
     */
    get toString(): string {
        return this.mkString()
    }

    // toTraversable: Traversable<A>
    // Converts this Iter to an unspecified Traversable.

    // toVector: Vector<A>
    // Converts this Iter to a Vector.

    // withFilter(p: (A) => Boolean): Iter<A>
    // Creates a Iter over all the elements of this Iter that satisfy the predicate p.

    // zip<B>(that: Iterable<B>): Iterable<(A, B)>
    // Creates a Iter formed from this Iter and another Iter by combining corresponding values in pairs.

    // zipAll<B>(that: Iterable<B>, thisElem: A, thatElem: B): Iterable<(A, B)>
    // <use case> Creates a Iter formed from this Iter and another Iter by combining corresponding elements in pairs.

    // zipWithIndex: Iterable<(A, number)>
    // Creates a Iter that pairs each element produced by this Iter with its index, counting from 0.

}



