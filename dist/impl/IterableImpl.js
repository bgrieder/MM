"use strict";
var IterableImpl = (function () {
    function IterableImpl(fit, bit, length, fArray) {
        this._fit = fit ? function () { return fit(); } : void 0;
        this._bit = bit ? function () { return bit(); } : void 0;
        this._length = length;
        this._fArray = fArray ? function () { return fArray(); } : void 0;
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
    Object.defineProperty(IterableImpl.prototype, "fArray", {
        get: function () { return this._fArray; },
        enumerable: true,
        configurable: true
    });
    IterableImpl.prototype.toArray = function () {
        if (typeof this._fArray === 'undefined') {
            var counter = 0;
            var v_1 = [];
            var it_1 = this.fit();
            while (it_1.iterate()) {
                counter++;
                v_1.push(it_1.current());
            }
            this._length = counter;
            this._fArray = function () { return v_1; };
        }
        return this._fArray();
    };
    IterableImpl.prototype.equals = function (other) {
        if (this.fit && other.fit) {
            return this.fit().equals(other.fit());
        }
        if (this.bit && other.bit) {
            return this.bit().equals(other.bit());
        }
        return false;
    };
    return IterableImpl;
}());
exports.IterableImpl = IterableImpl;
function iterable(fit, bit, length, toArray) {
    return new IterableImpl(fit, bit, (typeof length !== 'undefined' ? length : -1), toArray);
}
exports.iterable = iterable;
function fiterable(it) {
    return new IterableImpl(it.fit, it.bit, it.length, it.fArray);
}
exports.fiterable = fiterable;
//# sourceMappingURL=IterableImpl.js.map