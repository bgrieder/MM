"use strict";
var Utils_1 = require("./Utils");
var IteratorImpl = (function () {
    function IteratorImpl(iterate, current) {
        this._iterate = function () { return iterate(); };
        this._current = function () { return current(); };
    }
    IteratorImpl.prototype.iterate = function () { return this._iterate(); };
    IteratorImpl.prototype.current = function () { return this._current(); };
    IteratorImpl.prototype.concat = function (otherIt) {
        var _this = this;
        var useLeft = true;
        return iterator(function () {
            if (useLeft) {
                if (_this.iterate()) {
                    return true;
                }
                else {
                    useLeft = false;
                    return otherIt.iterate();
                }
            }
            else {
                return otherIt.iterate();
            }
        }, function () { return useLeft ? _this.current() : otherIt.current(); });
    };
    IteratorImpl.prototype.equals = function (otherIt) {
        var len = 0;
        var hasNext = this.iterate();
        var otherHasNext = otherIt.iterate();
        while (hasNext && otherHasNext) {
            len++;
            var v = this.current();
            var o = otherIt.current();
            if (!Utils_1.eq(v, o)) {
                return false;
            }
            hasNext = this.iterate();
            otherHasNext = otherIt.iterate();
        }
        if (!hasNext) {
            return !otherHasNext;
        }
        return false;
    };
    return IteratorImpl;
}());
exports.IteratorImpl = IteratorImpl;
function iterator(iterate, current) {
    return new IteratorImpl(iterate, current);
}
exports.iterator = iterator;
function fiterator(iterator) {
    return new IteratorImpl(iterator.iterate, iterator.current);
}
exports.fiterator = fiterator;
//# sourceMappingURL=IteratorImpl.js.map