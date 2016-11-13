/**
 * Created by Bruno Grieder.
 */

import {Iterable} from './Iterable'

export interface Monad<A> extends Iterable<A> {

    /**
     * Whether the sequence can be iterated forward
     * @see isBackward()
     */
    isForward: boolean

    /**
     * Whether the sequence can be iterated backward
     * @see isForward()
     */
    isBackward: boolean

    map<U>( f: ( value: A ) => U ): Monad<U>;

    flatMap<U>( f: ( value: A ) => Monad<U> ): Monad<U>

    flatten<U>(): Monad<U>

    filter( f: ( value: A ) => boolean ): Monad<A>

    /**
     * Will return the length if known, otherwise will
     * fully iterate the content to determine it.
     *
     * Once <code>size()</code> has been called, <code>length</code>
     * will contain the same value<code>undefined</code>
     */
    size(): number
}
