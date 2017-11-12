import { Seq } from './Seq';
export declare class Range extends Seq<number> {
    static from(lengthOrStart: number, end?: number, step?: number): Range;
}
export declare function range(length: number): Range;
export declare function range(start: number, end: number): Range;
export declare function range(start: number, end: number, step: number): Range;
