"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IterableImpl_1 = require("./IterableImpl");
var IteratorImpl_1 = require("./IteratorImpl");
var MonadImpl = (function (_super) {
    __extends(MonadImpl, _super);
    function MonadImpl(it) {
        var _this = _super.call(this, it.fit, it.bit, it.length, it.fArray) || this;
        if (!(_this._isForward = (typeof it.fit !== 'undefined'))) {
            _this._fit = function () { throw "No forward iterator"; };
        }
        if (!(_this._isBackward = (typeof it.bit !== 'undefined'))) {
            _this._bit = function () { throw "No backward iterator"; };
        }
        return _this;
    }
    MonadImpl.prototype._size = function (backward) {
        if (this._length >= 0) {
            return this._length;
        }
        var it = backward ? this.bit() : this.fit();
        if (!!it) {
            var count = 0;
            while (it.iterate()) {
                count++;
            }
            this._length = count;
            return count;
        }
        throw "size: no iterators";
    };
    Object.defineProperty(MonadImpl.prototype, "isForward", {
        get: function () {
            return this._isForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonadImpl.prototype, "isBackward", {
        get: function () {
            return this._isBackward;
        },
        enumerable: true,
        configurable: true
    });
    MonadImpl.prototype.map = function (f) {
        var _this = this;
        var getNIterator = function (it) { return IteratorImpl_1.iterator(function () { return it.iterate(); }, function () { return f(it.current()); }); };
        var nfit = this.isForward ? function () { return getNIterator(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getNIterator(_this.bit()); } : undefined;
        return this.newInstance(IterableImpl_1.iterable(nfit, nbit, this.length));
    };
    MonadImpl.prototype.flatten = function () {
        var _this = this;
        var getNIterator = function (it, forward) {
            var usingMain = true;
            var current = undefined;
            var subIt;
            var len = 0;
            var iterateInMain = function () {
                var hasNext = it.iterate();
                if (hasNext) {
                    var val = it.current();
                    if (val instanceof IterableImpl_1.IterableImpl) {
                        var iterable_1 = val;
                        var hasSubIt = forward ? iterable_1.fit : iterable_1.bit;
                        if (hasSubIt) {
                            usingMain = false;
                            subIt = hasSubIt();
                            current = undefined;
                            return iterateInSub();
                        }
                        else {
                            return iterateInMain();
                        }
                    }
                    else {
                        len++;
                        current = val;
                        return true;
                    }
                }
                else {
                    current = undefined;
                    _this._length = len;
                    return false;
                }
            };
            var iterateInSub = function () {
                var hasNext = subIt.iterate();
                if (hasNext) {
                    len++;
                    current = subIt.current();
                    return true;
                }
                else {
                    usingMain = true;
                    return iterateInMain();
                }
            };
            return IteratorImpl_1.iterator(function () { return (usingMain ? iterateInMain() : iterateInSub()); }, function () { return current; });
        };
        var nfit = this.isForward ? function () { return getNIterator(_this.fit(), true); } : undefined;
        var nbit = this.isBackward ? function () { return getNIterator(_this.bit(), false); } : undefined;
        return this.newInstance(IterableImpl_1.iterable(nfit, nbit, -1));
    };
    MonadImpl.prototype.flatMap = function (f) {
        return this.map(f).flatten();
    };
    MonadImpl.prototype.size = function () {
        return this._size(!this.isForward);
    };
    MonadImpl.prototype.filter = function (f) {
        var _this = this;
        var len = 0;
        var getNIterator = function (it) {
            var current = undefined;
            return IteratorImpl_1.iterator(function () {
                var match = false;
                var hasNext;
                while (!match && (hasNext = it.iterate())) {
                    var v = it.current();
                    match = f(v);
                    if (match) {
                        current = v;
                        len++;
                    }
                    else {
                        current = undefined;
                    }
                }
                if (!hasNext) {
                    _this._length = len;
                }
                return match;
            }, function () {
                if (current) {
                    return current;
                }
                else {
                    throw new Error('no such element');
                }
            });
        };
        var nfit = this.isForward ? function () { return getNIterator(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getNIterator(_this.bit()); } : undefined;
        return this.newInstance(IterableImpl_1.iterable(nfit, nbit, -1));
    };
    MonadImpl.prototype.newInstance = function (it) {
        return new MonadImpl(it);
    };
    return MonadImpl;
}(IterableImpl_1.IterableImpl));
exports.MonadImpl = MonadImpl;
//# sourceMappingURL=MonadImpl.js.map