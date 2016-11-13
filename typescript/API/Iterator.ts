/**
 * Created by Bruno Grieder.
 */

export interface Iterator<A> {

    iterate(): boolean
    current(): A
    concat<A>(  otherIt: Iterator<A> ): Iterator<A>
    equals<A>(  otherIt: Iterator<A> ): boolean
}

