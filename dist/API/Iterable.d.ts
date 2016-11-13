import { Iterator } from './Iterator';
export interface Iterable<A> {
    fit?: () => Iterator<A>;
    bit?: () => Iterator<A>;
    length?: number;
    fArray?: () => A[];
    toArray(): A[];
    equals(other: Iterable<A>): boolean;
}
