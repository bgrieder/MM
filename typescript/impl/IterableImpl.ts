/**
 * Created by Bruno Grieder on 25 05 2015.
 */
import {Iterator} from '../API/Iterator'
import {Iterable} from '../API/Iterable'


export class IterableImpl<A> implements Iterable<A> {

    protected _fit: () => Iterator<A>
    protected _bit: () => Iterator<A>
    protected _length: number
    protected _fArray: () => A[]

    constructor( fit?: () => Iterator<A>,
                 bit?: () => Iterator<A>,
                 length?: number,
                 fArray?: () => A[] ) {
        this._fit = fit ? () => fit() : void 0
        this._bit = bit ? () => bit() : void 0
        this._length = length
        this._fArray = fArray ? () => fArray() : void 0
    }

    get fit() { return this._fit }

    get bit() { return this._bit}

    get length() { return this._length < 0 ? -1 : this._length }

    get fArray() { return this._fArray }

    toArray(): A[] {
        if ( typeof this._fArray === 'undefined' ) {
            let counter = 0;
            const v: A[] = [];
            const it = this.fit();
            while ( it.iterate() ) {
                counter++
                v.push( it.current() )
            }
            this._length = counter
            this._fArray = () => v
        }
        return this._fArray()
    }

    /**
     * Tests whether all elements are equal in each iterable iterating forward
     * Equality of elements is tested using the 'equals' method on <code>value</code> if it exists
     * otherwise the <code>===</code> operator is used
     */
    equals( other: Iterable<A> ) {

        if ( this.fit && other.fit ) {
            return this.fit().equals( other.fit() )
        }

        if ( this.bit && other.bit ) {
            return this.bit().equals( other.bit() )
        }
        return false
    }
}

export function iterable<A>( fit?: () => Iterator<A>, bit?: () =>Iterator<A>, length?: number, toArray?: () => A[] ): Iterable<A> {
    return new IterableImpl<A>( fit, bit, (typeof length !== 'undefined' ? length : -1), toArray )
}

//noinspection JSUnusedGlobalSymbols
export function fiterable<A>( it: Iterable<A> ): Iterable<A> {
    return new IterableImpl( it.fit, it.bit, it.length, it.fArray )
}



