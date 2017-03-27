"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Bruno Grieder.
 */
var Iter_1 = require("./Iter");
var Option_1 = require("./Option");
/**
 * A Seq is an ordered list of elements
 */
var Seq = (function (_super) {
    __extends(Seq, _super);
    function Seq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Seq.from = function () {
        var vals = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vals[_i] = arguments[_i];
        }
        if (vals.length === 0) {
            return new Seq([]);
        }
        if (vals.length > 1) {
            return new Seq(vals);
        }
        var value = vals[0];
        if (value instanceof Seq) {
            return value;
        }
        if (typeof value[Symbol.iterator] === 'undefined') {
            return new Seq([value]);
        }
        return new Seq(value);
    };
    ///////////////////////////////////////////
    // /:<B>(z: B)(op: (B, A) => B): B
    // Applies a binary operator to a start value and all elements of this traversable or Seq, going left to right.
    // :\<B>(z: B)(op: (A, B) => B): B
    // Applies a binary operator to all elements of this Seq and a start value, going right to left.
    // addString(b: StringBuilder): StringBuilder
    // Appends all elements of this Seq to a string builder.
    // addString(b: StringBuilder, sep: String): StringBuilder
    // Appends all elements of this Seq to a string builder using a separator string.
    // addString(b: StringBuilder, start: String, sep: String, end: String): StringBuilder
    // Appends all elements of this Seq to a string builder using start, end, and separator strings.
    // aggregate<B>(z: => B)(seqop: (B, A) => B, combop: (B, B) => B): B
    // Aggregates the results of applying an operator to subsequent elements.
    /**
     * Returns the element at index.
     * The first element is at index 0
     * O(1) if the underlying iterable is an IndexedSeq, O(n) otherwise
     */
    // at( index: number ): A;
    // buffered: BufferedSeq<A>
    // Creates a buffered Seq from this Seq.
    /**
     * Creates a Seq by transforming values produced by this Seq with a partial function, dropping those values for which the partial function is not defined.
     */
    // collect<B>( filter: ( value: A ) => boolean ): ( mapper: ( value: A ) => B ) => Seq<B>
    //collectFirst<B>(pf: PartialFunction<A, B>): Option<B>
    // Finds the first element of the Seq for which the given partial function is defined, and applies the partial function to it.
    /**
     * Tests whether this Seq contains a given value as an element.
     */
    // contains( elem: any ): boolean {
    //     return this.indexOf( elem ) !== -1
    // }
    /**
     * [use case] Concatenates this Seq with another.
     */
    // concat( that: Seq<A> ): Seq<A>
    // copyToArray(xs: Array<A>, start: number, len: number): Unit
    // <use case> Copies selected values produced by this Seq to an array.
    // copyToArray(xs: Array<A>): Unit
    // <use case> Copies the elements of this Seq to an array.
    // copyToArray(xs: Array<A>, start: number): Unit
    // <use case> Copies the elements of this Seq to an array.
    // copyToBuffer<B >: A>(dest: Buffer<B>): Unit
    // Copies all elements of this Seq to a buffer.
    // corresponds<B>(that: GenTraversableOnce<B>)(p: (A, B) => Boolean): Boolean
    // Tests whether every element of this Seq relates to the corresponding element of another collection by satisfying a test predicate.
    /**
     * Counts the number of elements in the Seq which satisfy a predicate.
     */
    // count( p: ( value: A ) => boolean ): number
    /**
     * Advances this Seq past the first n elements, or the length of the Seq, whichever is smaller.
     */
    // drop( n: number ): Seq<A>
    // dropWhile(p: (A) => Boolean): Seq<A>
    // Skips longest Sequence of elements of this Seq which satisfy given predicate p, and returns a Seq of the remaining elements.
    // duplicate: (Seq<A>, Seq<A>)
    // Creates two new Seqs that both iterate over the same elements as this Seq (in the same order).
    /**
     * Test whether these two Seqs are equal by testing equality on all elements
     * Equality on elements is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    // equals( that: Seq<A> ): boolean
    /**
     * Tests whether a predicate holds for some of the values produced by this Seq.
     */
    // exists( p: ( value: A ) => boolean ): boolean
    /**
     * Returns a Seq over all the elements of this Seq that satisfy the predicate p.
     */
    // filter( filter: ( value: A ) => boolean ): Seq<A>
    /**
     * Creates a Seq over all the elements of this Seq which do not satisfy a predicate p.
     */
    // filterNot( filter: ( value: A ) => boolean ): Seq<A>
    /**
     * Finds the first value produced by the Seq satisfying a predicate, if any.
     */
    Seq.prototype.find = function (p) {
        var it = this[Symbol.iterator]();
        for (var n = it.next(); !n.done; n = it.next()) {
            if (p(n.value))
                return Option_1.some(n.value);
        }
        return Option_1.none();
    };
    return Seq;
}(Iter_1.Iter));
exports.Seq = Seq;
function seq() {
    var vals = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vals[_i] = arguments[_i];
    }
    return Seq.from.apply(Seq, vals);
}
exports.seq = seq;
