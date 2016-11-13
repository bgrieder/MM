/**
 * Created by Bruno Grieder on 23 May 2015.
 */

import {Iterable} from '../API/Iterable'
import {Option} from '../API/Option'
import { SeqImpl} from './SeqImpl'
import {iterator} from './IteratorImpl'
import {iterable} from './IterableImpl'

export class OptionImpl<A> extends SeqImpl<A> implements Option<A> {

    constructor( it: Iterable<A> ) {
        super( it )
    }

    protected newInstance<U>( it: Iterable<U>, ...args: any[] ): Some<U> {
        return new Some<U>( it )
    }

    /**
     * Returns the Option value or throws an exception if there is none
     * Identical to run()
     */
    get(): A {
        const res = this._get();
        if ( res[ 0 ] ) {
            return res[ 1 ]
        }
        else {
            throw new Error( 'No such element None.get' )
        }
    }

    private _get(): [boolean, A] {
        const it = this.fit();
        if ( it.iterate() ) {
            return [ true, it.current() ]
        }
        else {
            return [ false, undefined ]
        }
    }

    /**
     * Returns true is the Option is None, false otherwise
     */
    isEmpty(): boolean { return super.isEmpty() }

    /**
     * Returns the <code>Option</code>'s value if the option is nonempty, otherwise
     * return the result of evaluating `elseVal`.
     */
    getOrElse<U>( elseVal: () => U ): A|U {
        const res = this._get();
        if ( res[ 0 ] ) {
            return res[ 1 ]
        }
        else {
            return elseVal()
        }
    }

    /**
     * Returns the <code>Option</code>'s value if it is nonempty,
     * or <code>null</code> if it is empty.
     * Although the use of null is discouraged, code written to use
     * <code>Option</code> must often interface with code that expects and returns nulls.
     */
    getOrNull(): A { return this.getOrElse( () => null )}

    /**
     * Returns the <code>Option</code>'s value if it is nonempty,
     * or <code>undefined</code> if it is empty.
     * Although the use of undefined is discouraged, code written to use
     * <code>Option</code> must often interface with code that expects and returns undefined.
     */
    getOrUndefined(): A {
        return this._get()[ 1 ]
    }

    /**
     * Returns a <code>Some</code> containing the result of applying <code>f</code> to this <code>Option</code>'s
     * value if this  <code>Option</code> is nonempty.
     * Otherwise return  <code>None</code>.
     *
     *  @note This is similar to `flatMap` except here,
     *  <code>f</code> does not need to wrap its result in an <code>Option</code>.
     */
    map<U>( f: ( value: A ) => U ): Option<U> { return this.newInstance( super.map<U>( f ) )}

    /**
     * Returns the result of applying <code>f</code>empty to this <code>Option</code>'s
     *  value if the <code>Option</code> is empty;  otherwise, applies
     *  `f` to the value.
     *
     *  @note This is equivalent to <code>Option.map(f).getOrElse(ifEmpty)</code>
     */
    fold<U>( ifEmpty: () => U, f: ( value: A ) => U ): U { return this.map( f ).getOrElse( ifEmpty ) }

    /**
     * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
     * this <code>Option</code>'s value returns true. Otherwise, return <code>None</code>.
     */
    filter( f: ( value: A ) => boolean ): Option<A> { return <Option<A>>super.filter( f )}

    /**
     * Flattens two layers of <code>Option</code> into one
     * More precisely flattens an Option<Iterable<A>> into an Option<A>
     */
    flatten<U>(): Option<U> {return <Option<U>>super.flatten()}

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
    flatMap<U>( f: ( value: A ) => Option<U> ): Option<U> { return <Option<U>> super.flatMap( f )}

    /**
     * Returns this <code>Option</code> if it is nonempty '''and''' applying the function <code>test</code> to
     * this <code>Option</code>'s value returns false. Otherwise, return <code>None</code>.
     */
    filterNot( test: ( value: A ) => boolean ): Option<A> { return this.filter( ( val: A ) => !test( val ) )}

    /**
     * Returns true if this option is nonempty '''and''' the function
     * <code>test</code> returns true when applied to this <code>Option</code>'s value.
     * Otherwise, returns false.
     */
    exists( test: ( value: A ) => boolean ): boolean { return this.filter( test ).map( () => true ).getOrElse( () => false )}

    /**
     * Returns true if this option is empty '''or''' the function
     * <code>test</code> returns true when applied to this <code>Option</code>'s value.
     *
     */
    forAll( test: ( value: A ) => boolean ): boolean { return this.isEmpty() || this.filter( test ).map( () => true ).getOrElse( () => false )}

    /**
     *  Apply the given function <code>f</code> to the <code>Option</code>'s value,
     *  if it is nonempty. Otherwise, do nothing.
     *
     *  @see map
     *  @see flatMap
     */
    forEach<U>( f: ( value: A ) => U ): void { this.map( f ).getOrElse( () => undefined ) }

    /**
     * Returns a <code>Some</code> containing the result of
     * applying <code>someFn</code> to this <code>Option</code>'s contained
     * value, '''if''' this option is
     * nonempty '''and''' <code>someFn</code> is defined
     * Returns <code>None</code> otherwise.
     */
    collect<U>( partialFunction: {someFn?: ( value: A ) => U} ): Option<U> {
        return partialFunction.someFn ? this.map<U>( partialFunction.someFn ) : none()
    }

    /**
     * Returns this <code>Option</code> if it is nonempty,
     *  otherwise return the result of evaluating `alternative`.
     */
    orElse( alternative: () => Option<A> ): Option<A> {
        return this.isEmpty() ? alternative() : this
    }

    /**
     * Returns true is these two options are equal
     */
    equals( option: Option<A> ): boolean {
        if ( !option.isEmpty() ) {
            const it = this.fit();
            const oit = option.fit();
            if ( it.iterate() && oit.iterate() ) {
                let value = it.current();
                let other = oit.current();
                if ( typeof other === 'object' && typeof value === 'object' && other[ 'equals' ] && other[ 'equals' ]( value ) ) {
                    return true
                }
                return other === value;
            }
            return false
        }
        return false
    }
}

export class Some<A> extends OptionImpl<A> {}
export class None extends OptionImpl<any> {}

/**
 * Create a `None` if `value` is `undefined` or `null`
 * otherwise create a `Some` holding that value
 */
export function option<A>(value?: A): Option<A> {
    if (typeof value === 'undefined' || value === null) {
        return none()
    }
    return some(value)
}

//noinspection JSUnusedGlobalSymbols
/**
 * Create a `Some` holding the value
 */
export function some<A>( value?: A ): Some<A> {

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
    return new Some( iterable( it, it, 1, () => [ value ] ) )
}

//noinspection JSUnusedGlobalSymbols
/**
 * Create a `Some` from an `Iterable`
 */
export function fsome<A>( it: Iterable<A> ): Some<A> {
    return new Some( it )
}

/**
 * Creates a `None`
 */
export function none(): None {

    const it = () => {
        return iterator(
            () => false,
            () => {throw "None is not iterable"}
        )
    };
    return new None( iterable( it, it, 0, (): any[] => {
        throw "None is not iterable"
    } ) )
}


