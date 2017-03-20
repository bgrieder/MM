/**
 * Created by Bruno Grieder on 23 May 2015.
 */
import {Seq} from './Seq'

export interface Option<A> extends Seq<A> {

    /**
     * Returns a <code>Some</code> containing the result of
     * applying <code>someFn</code> to this <code>Option</code>'s contained
     * value, '''if''' this option is
     * nonempty '''and''' <code>someFn</code> is defined
     * Returns <code>None</code> otherwise.
     */
    collect<U>( partialFunction: {someFn?: ( value: A ) => U} ): Option<U>

    /**
     * Returns true is these two options are equal
     */
    equals( option: Option<A> ): boolean

    /**
     * Returns true if this option is nonempty '''and''' the function
     * <code>test</code> returns true when applied to this <code>Option</code>'s value.
     * Otherwise, returns false.
     */
    exists( test: ( value: A ) => boolean ): boolean

    /**
     * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
     * this <code>Option</code>'s value returns true. Otherwise, return <code>None</code>.
     */
    filter( f: ( value: A ) => boolean ): Option<A>

    /**
     * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
     * this <code>Option</code>'s value returns false. Otherwise, return <code>None</code>.
     */
    filterNot( test: ( value: A ) => boolean ): Option<A>

    /**
     * Returns the result of applying <code>f</code> to this <code>Option</code>'s value if
     * this <code>Option</code> is nonempty.
     * Returns <code>None</code> if this <code>Option</code> is empty.
     * Slightly different from `map` in that <code>f</code> is expected to
     * return an <code>Option</code> (which could be <code>None</code>).
     *
     * @note: flatMap '''will''' run the Option
     *
     *  @see map
     *  @see forEach
     */
    flatMap<U>( f: ( value: A ) => Option<U> ): Option<U>

    /**
     * Flattens two layers of <code>Option</code> into one
     * More precisely flattens an Option<Iterable<A>> into an Option<A>
     */
    flatten<U>(): Option<U>

    /**
     * Returns the result of applying <code>f</code>empty to this <code>Option</code>'s
     *  value if the <code>Option</code> is empty;  otherwise, applies
     *  `f` to the value.
     *
     *  @note This is equivalent to <code>Option.map(f).getOrElse(ifEmpty)</code>
     */
    fold<U>( ifEmpty: () => U, f: ( value: A ) => U ): U

    /**
     * Returns true if this option is empty '''or''' the function
     * <code>test</code> returns true when applied to this <code>Option</code>'s value.
     *
     */
    forAll( test: ( value: A ) => boolean ): boolean

    /**
     *  Apply the given function <code>f</code> to the <code>Option</code>'s value,
     *  if it is nonempty. Otherwise, do nothing.
     *
     *  @see map
     *  @see flatMap
     */
    forEach<U>( f: ( value: A ) => U ): void

    /**
     * Returns the Option value or throws an exception if there is none
     * Identical to run()
     */
    get(): A

    /**
     * Returns the <code>Option</code>'s value if the option is nonempty, otherwise
     * return the result of evaluating `elseVal`.
     */
    getOrElse<U>( elseVal: () => U ): A|U

    /**
     * Returns the <code>Option</code>'s value if it is nonempty,
     * or <code>null</code> if it is empty.
     * Although the use of null is discouraged, code written to use
     * <code>Option</code> must often interface with code that expects and returns nulls.
     */
    getOrNull(): A

    /**
     * Returns the <code>Option</code>'s value if it is nonempty,
     * or <code>undefined</code> if it is empty.
     * Although the use of undefined is discouraged, code written to use
     * <code>Option</code> must often interface with code that expects and returns undefined.
     */
    getOrUndefined(): A

    /**
     * Returns true is the Option is None, false otherwise
     */
    isEmpty(): boolean

    /**
     * Returns a <code>Some</code> containing the result of applying <code>f</code> to this <code>Option</code>'s
     * value if this  <code>Option</code> is nonempty.
     * Otherwise return  <code>None</code>.
     *
     *  @note This is similar to `flatMap` except here,
     *  <code>f</code> does not need to wrap its result in an <code>Option</code>.
     */
    map<U>( f: ( value: A ) => U ): Option<U>

    /**
     * Returns this <code>Option</code> if it is nonempty,
     *  otherwise return the result of evaluating `alternative`.
     */
    orElse( alternative: () => Option<A> ): Option<A>

    /**
     * Convert this Option to a Promise
     * so that it can be chained using await
     */
    toPromise: Promise<A>
}



