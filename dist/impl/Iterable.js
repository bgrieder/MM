"use strict";
function eq(a, b) {
    if (typeof b === 'object') {
        var feq = b['equals'];
        return (feq && feq.call(b, a)) || (a === b);
    }
    return (a === b);
}
exports.eq = eq;
var IterableImpl = (function () {
    function IterableImpl(it) {
        this._fit = it.fit;
        this._bit = it.bit;
        this._length = it.length;
        this._fArray = it.fArray;
    }
    Object.defineProperty(IterableImpl.prototype, "fit", {
        get: function () { return this._fit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IterableImpl.prototype, "bit", {
        get: function () { return this._bit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IterableImpl.prototype, "length", {
        get: function () { return this._length < 0 ? -1 : this._length; },
        enumerable: true,
        configurable: true
    });
    IterableImpl.prototype.toArray = function () {
        var counter = 0;
        var v = [];
        var it = this.fit();
        while (it.iterate()) {
            counter++;
            v.push(it.current());
        }
        this._length = counter;
        return v;
    };
    IterableImpl.prototype.equals = function (other) {
        var it = this.fit();
        var oit = other.fit();
        var len = 0;
        var hasNext = it.iterate();
        var otherHasNext = oit.iterate();
        while (hasNext && otherHasNext) {
            len++;
            var v = it.current();
            var o = oit.current();
            if (!eq(v, o)) {
                return false;
            }
            hasNext = it.iterate();
            otherHasNext = oit.iterate();
        }
        if (!hasNext) {
            this._length = len;
            return !otherHasNext;
        }
        return false;
    };
    return IterableImpl;
}());
exports.IterableImpl = IterableImpl;
function iterable(fit, bit, length, toArray) {
    return new IterableImpl({
        fit: fit,
        bit: bit,
        length: (typeof length !== 'undefined' ? length : -1),
        toArray: toArray
    });
}
exports.iterable = iterable;
function fiterable(it) {
    return new IterableImpl(it);
}
exports.fiterable = fiterable;
//# sourceMappingURL=Iterable.js.map