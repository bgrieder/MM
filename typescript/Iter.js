"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Bruno Grieder.
 */
var Utils_1 = require("./impl/Utils");
var arrayFrom = function (iterator) {
    //initializing with the len does not seem to add a benefit: http://stackoverflow.com/questions/18947892/creating-range-in-javascript-strange-syntax
    var a = [];
    while (true) {
        var n = iterator.next();
        if (n.done) {
            return a;
        }
        a.push(n.value);
    }
};
/**
 * The base class from which all other monads are created
 * It really is an extension of ES6 Iterable
 */
var Iter = (function () {
    function Iter(value) {
        this._value = value;
    }
    Iter.prototype[Symbol.iterator] = function () {
        return this._value[Symbol.iterator]();
    };
    Iter.prototype.build = function (next) {
        var iter = (_a = {},
            _a[Symbol.iterator] = function () {
                return {
                    next: next
                };
            },
            _a);
        return new this.constructor(iter);
        var _a;
    };
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
    Iter.prototype.at = function (index) {
        if (index < 0) {
            throw new Error('Invalid index: ' + index);
        }
        if (Array.isArray(this._value)) {
            return this._value[index];
        }
        if (typeof this._value === 'string') {
            return this._value.charAt(index);
        }
        var it = this[Symbol.iterator]();
        var i = 0;
        while (true) {
            var n = it.next();
            if (n.done)
                throw new Error("No such Element");
            if (i === index) {
                return n.value;
            }
        }
    };
    // buffered: BufferedIter<A>
    // Creates a buffered Iter from this Iter.
    /**
     * Creates a Iter by transforming values produced by this Iter with a partial function, dropping those values for which the partial function is not defined.
     */
    Iter.prototype.collect = function (filter) {
        var _this = this;
        return function (mapper) { return _this.filter(filter).map(mapper); };
    };
    //collectFirst<B>(pf: PartialFunction<A, B>): Option<B>
    // Finds the first element of the Iter for which the given partial function is defined, and applies the partial function to it.
    /**
     * Tests whether this Iter contains a given value as an element.
     */
    Iter.prototype.contains = function (elem) {
        return this.indexOf(elem) !== -1;
    };
    /**
     * [use case] Concatenates this Iter with another.
     */
    Iter.prototype.concat = function (that) {
        var thisIt = this[Symbol.iterator]();
        var thatIt = that[Symbol.iterator]();
        var useThis = true;
        var next = function () {
            if (useThis) {
                var n = thisIt.next();
                if (n.done) {
                    useThis = false;
                    return thatIt.next();
                }
                else {
                    return n;
                }
            }
            else {
                return thatIt.next();
            }
        };
        return this.build(next);
    };
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
    Iter.prototype.count = function (p) {
        return this.filter(p).size;
    };
    /**
     * Advances this Iter past the first n elements, or the length of the Iter, whichever is smaller.
     */
    Iter.prototype.drop = function (n) {
        var it = this[Symbol.iterator]();
        var i = 0;
        var next = function () {
            var nv = it.next();
            if (nv.done) {
                return { done: true };
            }
            i = i + 1;
            if (i <= n) {
                return next();
            }
            return { done: false, value: nv.value };
        };
        return this.build(next);
    };
    // dropWhile(p: (A) => Boolean): Iter<A>
    // Skips longest Iteruence of elements of this Iter which satisfy given predicate p, and returns a Iter of the remaining elements.
    // duplicate: (Iter<A>, Iter<A>)
    // Creates two new Iters that both iterate over the same elements as this Iter (in the same order).
    /**
     * Test whether these two Iters are equal by testing equality on all elements
     * Equality on elements is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    Iter.prototype.equals = function (that) {
        var thisIt = this[Symbol.iterator]();
        var thatIt = that[Symbol.iterator]();
        while (true) {
            var thisn = thisIt.next();
            var thatn = thatIt.next();
            var bothDone = thisn.done && thatn.done;
            if (bothDone) {
                return true;
            }
            else {
                if (Utils_1.eq(thisn.value, thatn.value)) {
                    continue;
                }
            }
            return false;
        }
    };
    /**
     * Tests whether a predicate holds for some of the values produced by this Iter.
     */
    Iter.prototype.exists = function (p) {
        return this.filter(p).take(1).size === 1;
    };
    /**
     * Returns a Iter over all the elements of this Iter that satisfy the predicate p.
     */
    Iter.prototype.filter = function (filter) {
        var it = this[Symbol.iterator]();
        var next = function () {
            var n = it.next();
            if (n.done) {
                return { done: true };
            }
            if (filter(n.value)) {
                return { done: false, value: n.value };
            }
            return next();
        };
        return this.build(next);
    };
    /**
     * Creates a Iter over all the elements of this Iter which do not satisfy a predicate p.
     */
    Iter.prototype.filterNot = function (filter) {
        return this.filter(function (value) { return !filter(value); });
    };
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
    Iter.prototype.flatMap = function (f) {
        return this.map(f).flatten();
    };
    /**
     * Converts this Iteruence of iterables into a Iteruence formed by the elements of the iterables.
     * e.g. Iter( Iter(1,2), Iter(3,4) ).flatten() = Iter(1,2,3,4)
     */
    Iter.prototype.flatten = function () {
        var it = this[Symbol.iterator]();
        var inMain = true;
        var subIt;
        var iterateInMain = function () {
            inMain = true;
            var n = it.next();
            if (n.done)
                return { done: true };
            if (n.value instanceof Iter) {
                subIt = n.value[Symbol.iterator]();
                return iterateInSub();
            }
            return { done: false, value: n.value }; //TODO: check n.value instance of U ?
        };
        var iterateInSub = function () {
            inMain = false;
            var n = subIt.next();
            if (n.done)
                return iterateInMain();
            return { done: false, value: n.value };
        };
        var next = function () {
            if (inMain) {
                return iterateInMain();
            }
            return iterateInSub();
        };
        return this.build(next);
    };
    // fold<A1 >: A>(z: A1)(op: (A1, A1) => A1): A1
    // Folds the elements of this Iter using the specified associative binary operator.
    /**
     * Applies a binary operator to a start value and all elements of Iter, going left to right.
     */
    Iter.prototype.foldLeft = function (initialValue) {
        var _this = this;
        return function (op) {
            var it = _this[Symbol.iterator]();
            var z = initialValue;
            var i = 0;
            for (var n = it.next(); !n.done; n = it.next()) {
                z = op(z, n.value, i);
                i = i + 1;
            }
            return z;
        };
    };
    /**
     * Applies a binary operator to all elements of Iter and a start value, going right to left.
     */
    Iter.prototype.foldRight = function (initialValue) {
        var _this = this;
        return function (op) { return _this.reverse.foldLeft(initialValue)(op); };
    };
    // forall(p: (A) => Boolean): Boolean
    // Tests whether a predicate holds for all values produced by this Iter.
    /**
     * Applies a function f to all values produced by this Iter.
     */
    Iter.prototype.foreach = function (f) {
        var it = this[Symbol.iterator]();
        for (var n = it.next(); !n.done; n = it.next()) {
            f(n.value);
        }
    };
    Object.defineProperty(Iter.prototype, "hasDefiniteSize", {
        // grouped<B >: A>(size: number): GroupedIterable<B>
        // Returns a Iter which groups this Iter into fixed size blocks.
        /**
         * Tests whether this Iterable has a known size.
         */
        get: function () {
            return typeof this._value.length !== 'undefined' || Array.isArray(this._value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "head", {
        /**
         * Selects the first element of this Iter
         */
        get: function () {
            var it = this[Symbol.iterator]();
            var n = it.next();
            if (n.done)
                throw new Error("No such element");
            return n.value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the index of the first occurrence of the specified object in Iter after or at some optional start index.
     */
    Iter.prototype.indexOf = function (elem, from) {
        if (Array.isArray(this._value)) {
            return this._value.indexOf(elem, from);
        }
        var start = typeof from === 'undefined' ? 0 : from;
        var it = this[Symbol.iterator]();
        var index = -1;
        while (true) {
            var n = it.next();
            if (n.done)
                return -1;
            index = index + 1;
            if (index >= start) {
                if (Utils_1.eq(n.value, elem))
                    return index;
            }
        }
    };
    Object.defineProperty(Iter.prototype, "isEmpty", {
        // indexWhere(p: (A) => Boolean, from: number): number
        // Returns the index of the first produced value satisfying a predicate, or -1, after or at some start index.
        // indexWhere(p: (A) => Boolean): number
        // Returns the index of the first produced value satisfying a predicate, or -1.
        /**
         * Tests whether this Iter is empty.
         */
        get: function () {
            return this.size === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "isIndexed", {
        /**
         * Tests whether this Iter is an Indexed Iter
         * i.e. its elements can be accessed using an index
         */
        get: function () {
            return Array.isArray(this._value) || typeof this._value === 'string';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "length", {
        // isTraversableAgain: Boolean
        // Tests whether this Iterable can be repeatedly traversed.
        /**
         * Returns the number of elements in this Iter.
         */
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new Iter that maps all produced values of this Iter to new values using a transformation function.
     */
    Iter.prototype.map = function (f) {
        var it = this[Symbol.iterator]();
        var i = -1;
        var next = function () {
            var n = it.next();
            if (n.done) {
                return { done: true };
            }
            i = i + 1;
            return { done: false, value: f(n.value, i) };
        };
        return this.build(next);
    };
    /**
     * Displays all elements of this Iter in a string using start, end, and separator strings.
     */
    Iter.prototype.mkString = function (startOrSep, sep, end) {
        if (typeof startOrSep === 'undefined') {
            startOrSep = '';
            sep = '';
            end = '';
        }
        else if (typeof sep === 'undefined') {
            //startOrSep is actually sep
            sep = startOrSep;
            startOrSep = '';
            end = '';
        }
        return this.foldLeft('')(function (s, v, i) {
            return s + (i == 0 ? startOrSep : sep) + v.toString();
        }) + end;
    };
    Object.defineProperty(Iter.prototype, "reverse", {
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
        get: function () {
            var _this = this;
            if (typeof this._value.reverseIterator !== 'undefined') {
                return new this.constructor((_a = {},
                    _a[Symbol.iterator] = this._value.reverseIterator,
                    _a.length = this._value.length,
                    _a.reverseIterator = this._value[Symbol.iterator],
                    _a));
            }
            if (this.isIndexed) {
                var index_1 = this.length;
                var next = function () {
                    if (index_1 <= 0) {
                        return { done: true };
                    }
                    index_1 = index_1 - 1;
                    return { done: false, value: _this.at(index_1) };
                };
                return this.build(next);
            }
            return new this.constructor(this.toArray.reverse());
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "size", {
        // sameElements(that: Iterable<_>): Boolean
        // Tests if another Iter produces the same values as this one.
        // scanLeft<B>(z: B)(op: (B, A) => B): Iterable<B>
        // Produces a collection containing cumulative results of applying the operator going left to right.
        // scanRight<B>(z: B)(op: (A, B) => B): Iterable<B>
        // Produces a collection containing cumulative results of applying the operator going right to left.
        /**
         * The size of this Iter.
         */
        get: function () {
            //is it already known ?
            if (typeof this._value.length !== 'undefined') {
                return this._value.length;
            }
            var count = 0;
            var it = this[Symbol.iterator]();
            while (true) {
                if (it.next().done)
                    return count;
                count = count + 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a Iter returning an interval of the values produced by this Iter.
     */
    Iter.prototype.slice = function (from, until) {
        return Array.isArray(this._value) ?
            new this.constructor(this._value.slice(from, until))
            :
                this.drop(from).take(until - from);
    };
    Object.defineProperty(Iter.prototype, "sum", {
        // sliding<B >: A>(size: number, step: number = 1): GroupedIterable<B>
        // Returns a Iter which presents a "sliding window" view of another Iter.
        // span(p: (A) => Boolean): (Iter<A>, Iter<A>)
        // Splits this Iterable into a prefix/suffix pair according to a predicate.
        /**
         * Sums up the elements of this collection.
         */
        get: function () {
            var first = this.head;
            return this.tail.foldLeft(first)(function (s, v) { return s + v; }); //any is to trick the compiler
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "tail", {
        /**
         * Selects all elements but the first
         */
        get: function () {
            return this.drop(1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects first n values of this Iter.
     */
    Iter.prototype.take = function (n) {
        var it = this[Symbol.iterator]();
        var i = 0;
        var next = function () {
            if (i === n) {
                return { done: true };
            }
            var next = it.next();
            if (next.done) {
                return { done: true };
            }
            i = i + 1;
            return { done: false, value: next.value };
        };
        return this.build(next);
    };
    Object.defineProperty(Iter.prototype, "toArray", {
        // takeWhile(p: (A) => Boolean): Iter<A>
        // Takes longest prefix of values produced by this Iter that satisfy a predicate.
        // to<Col<_>>: Col<A>
        // <use case> Converts this Iter into another by copying all elements.
        /**
         * Converts this Iter to an array.
         */
        get: function () {
            return Array.isArray(this._value) ?
                this._value.slice()
                :
                    arrayFrom(this._value[Symbol.iterator]()); //ES6: Array.from<A>(value) or [... value]
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "toIndexed", {
        // toBuffer<B >: A>: Buffer<B>
        // Uses the contents of this Iter to create a new mutable buffer.
        /**
         * Converts this Iter to an indexed Iter is it not already one
         * by creating an in memory array with the content
         */
        get: function () {
            if (this.isIndexed)
                return this;
            return new this.constructor(this.toArray);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Iter.prototype, "toString", {
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
        get: function () {
            return this.mkString();
        },
        enumerable: true,
        configurable: true
    });
    return Iter;
}());
exports.Iter = Iter;
