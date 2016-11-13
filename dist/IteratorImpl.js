"use strict";
var IteratorImpl = (function () {
    function IteratorImpl(iterator) {
        this._iterate = function () { return iterator.iterate(); };
        this._current = function () { return iterator.current(); };
    }
    IteratorImpl.prototype.iterate = function () { return this._iterate(); };
    IteratorImpl.prototype.current = function () { return this._current(); };
    return IteratorImpl;
}());
exports.IteratorImpl = IteratorImpl;
function iterator(iterate, current) {
    return new IteratorImpl({
        iterate: iterate,
        current: current
    });
}
exports.iterator = iterator;
function fiterator(iterator) {
    return new IteratorImpl(iterator);
}
exports.fiterator = fiterator;
function concat(firstIt, secondIt) {
    var useLeft = true;
    return iterator(function () {
        if (useLeft) {
            if (firstIt.iterate()) {
                return true;
            }
            else {
                useLeft = false;
                return secondIt.iterate();
            }
        }
        else {
            return secondIt.iterate();
        }
    }, function () { return useLeft ? firstIt.current() : secondIt.current(); });
}
exports.concat = concat;
//# sourceMappingURL=IteratorImpl.js.map