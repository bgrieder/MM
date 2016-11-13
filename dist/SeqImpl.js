"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Iterable_1 = require("./Iterable");
var SeqImpl = (function (_super) {
    __extends(SeqImpl, _super);
    function SeqImpl(it, useCache) {
        var _this = _super.call(this, it) || this;
        _this.take = _this.takeFirst;
        _this.apply = _this.takeAt;
        _this.applyOrElse = _this.takeAtOrElse;
        _this.push = _this.append;
        if (!(_this._isForward = (typeof it.fit !== 'undefined'))) {
            _this._fit = function () { throw "No forward iterator"; };
        }
        if (!(_this._isBackward = (typeof it.bit !== 'undefined'))) {
            _this._bit = function () { throw "No backward iterator"; };
        }
        _this._isCaching = (typeof useCache !== 'undefined' ? useCache : SeqImpl.caching);
        return _this;
    }
    SeqImpl.prototype.newInstance = function (it, useCache) {
        return new SeqImpl(it, useCache);
    };
    Object.defineProperty(SeqImpl.prototype, "isCaching", {
        get: function () {
            return this._isCaching;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SeqImpl.prototype, "isForward", {
        get: function () {
            return this._isForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SeqImpl.prototype, "isBackward", {
        get: function () {
            return this._isBackward;
        },
        enumerable: true,
        configurable: true
    });
    SeqImpl.prototype.useCache = function () {
        this._isCaching = true;
    };
    SeqImpl.prototype.disableCache = function () {
        this._isCaching = false;
    };
    SeqImpl.prototype.isEmpty = function () {
        return this.length === 0 || ((this.length === -1) && !(this._isForward ? this.fit() : this.bit()).iterate());
    };
    SeqImpl.prototype.map = function (f) {
        var _this = this;
        var getNIterator = function (it) { return Iterable_1.iterator(function () { return it.iterate(); }, function () { return f(it.current()); }); };
        var nfit = this.isForward ? function () { return getNIterator(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getNIterator(_this.bit()); } : undefined;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, this.length));
    };
    SeqImpl.prototype.filter = function (f) {
        var _this = this;
        var len = 0;
        var getNIterator = function (it) {
            var current = undefined;
            return Iterable_1.iterator(function () {
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
        return this.newInstance(Iterable_1.iterable(nfit, nbit, -1));
    };
    SeqImpl.prototype.filterNot = function (f) {
        return this.filter(function (value) { return !f(value); });
    };
    SeqImpl.prototype.flatten = function () {
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
                    if (val instanceof Iterable_1.IterableImpl) {
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
            return Iterable_1.iterator(function () { return (usingMain ? iterateInMain() : iterateInSub()); }, function () { return current; });
        };
        var nfit = this.isForward ? function () { return getNIterator(_this.fit(), true); } : undefined;
        var nbit = this.isBackward ? function () { return getNIterator(_this.bit(), false); } : undefined;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, -1));
    };
    SeqImpl.prototype.flatMap = function (f) {
        return this.map(f).flatten();
    };
    SeqImpl.prototype.size = function () {
        return this._size(!this.isForward);
    };
    SeqImpl.prototype._size = function (backward) {
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
    SeqImpl.prototype.reverse = function () {
        var _this = this;
        if (this.isBackward) {
            return this.newInstance(Iterable_1.iterable(this.bit, this.isForward ? this.fit : undefined, this.length));
        }
        else if (this.isForward) {
            var getNIterator_1 = function (nit) {
                var next = _this.size() - 1;
                var value;
                return Iterable_1.iterator(function () {
                    if (next === -1) {
                        return false;
                    }
                    var it = nit();
                    var index = 0;
                    while (index <= next) {
                        it.iterate();
                        index++;
                    }
                    value = it.current();
                    next--;
                    return true;
                }, function () { return value; });
            };
            var nfit = this.isForward ? function () { return getNIterator_1(_this.fit); } : undefined;
            var nbit = this.isBackward ? function () { return getNIterator_1(_this.bit); } : undefined;
            return this.newInstance(Iterable_1.iterable(nfit, nbit, this.length));
        }
        else {
            throw "Sequence cannot be iterated";
        }
    };
    SeqImpl.prototype._takeBuilder = function (n) {
        var _this = this;
        var getFIterator = function (it) {
            var counter = 0;
            return Iterable_1.iterator(function () { return (counter++) < n && it.iterate(); }, function () { return it.current(); });
        };
        var getBIterator = function (it) {
            var hasSkipped = false;
            return Iterable_1.iterator(function () {
                if (!hasSkipped) {
                    var len = _this._size(true);
                    var counter = 0;
                    while (counter++ < (len - n)) {
                        it.iterate();
                    }
                    hasSkipped = true;
                }
                return it.iterate();
            }, function () { return it.current(); });
        };
        return [getFIterator, getBIterator];
    };
    SeqImpl.prototype.takeFirst = function (n) {
        var _this = this;
        var its = this._takeBuilder(n);
        var nfit = this.isForward ? function () { return its[0](_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return its[1](_this.bit()); } : undefined;
        var len = (this._length >= 0 ? Math.min(this._length, n) : -1);
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.takeLast = function (n) {
        var _this = this;
        var its = this._takeBuilder(n);
        var nfit = this.isForward ? function () { return its[1](_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return its[0](_this.bit()); } : undefined;
        var len = (this._length >= 0 ? Math.min(this._length, n) : -1);
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.takeAt = function (index) {
        var res = this._takeAt(index);
        if (res[0]) {
            return res[1];
        }
        throw ("getAt: index out of bounds: " + index);
    };
    SeqImpl.prototype._takeAt = function (index) {
        var it = this.fit();
        var idx = -1;
        var len = 0;
        while (it.iterate()) {
            len++;
            if (++idx == index) {
                return [true, it.current()];
            }
        }
        this._length = len;
        return [false, undefined];
    };
    SeqImpl.prototype.takeAtOrElse = function (index, elseVal) {
        var res = this._takeAt(index);
        if (res[0]) {
            return res[1];
        }
        return elseVal(index);
    };
    SeqImpl.prototype.concat = function (it) {
        var _this = this;
        var nfit = this.isForward && it.fit ? function () { return Iterable_1.concat(_this.fit(), it.fit()); } : undefined;
        var nbit = this.isBackward && it.bit ? function () { return Iterable_1.concat(it.bit(), _this.bit()); } : undefined;
        var len = (this._length < 0 || it.length < 0 ? -1 : this._length + it.length);
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.prepend = function (a) {
        var _this = this;
        var eit = function () {
            var hasNext = true;
            return Iterable_1.iterator(function () {
                if (hasNext) {
                    hasNext = false;
                    return true;
                }
                return false;
            }, function () { return hasNext ? undefined : a; });
        };
        var nfit = this.isForward ? function () { return Iterable_1.concat(eit(), _this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return Iterable_1.concat(_this.bit(), eit()); } : undefined;
        var len = this._length < 0 ? -1 : this._length + 1;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.append = function (a) {
        var _this = this;
        var eit = function () {
            var hasNext = true;
            return Iterable_1.iterator(function () {
                if (hasNext) {
                    hasNext = false;
                    return true;
                }
                return false;
            }, function () { return hasNext ? undefined : a; });
        };
        var nfit = this.isForward ? function () { return Iterable_1.concat(_this.fit(), eit()); } : undefined;
        var nbit = this.isBackward ? function () { return Iterable_1.concat(eit(), _this.bit()); } : undefined;
        var len = this._length < 0 ? -1 : this._length + 1;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    SeqImpl.prototype.indexOf = function (value) {
        if (this._length === 0) {
            return -1;
        }
        var it = this.fit();
        var index = -1;
        while (it.iterate()) {
            ++index;
            var current = it.current();
            if (Iterable_1.eq(current, value)) {
                return index;
            }
        }
        this._length = index + 1;
        return -1;
    };
    SeqImpl.prototype.exists = function (test) {
        var it = this.fit();
        var len = 0;
        while (it.iterate()) {
            len++;
            if (test(it.current())) {
                return true;
            }
        }
        this._length = len;
        return false;
    };
    SeqImpl.prototype.corresponds = function (other, test) {
        var it = this.fit();
        var oit = other.fit();
        var len = 0;
        while (it.iterate()) {
            len++;
            if (!oit.iterate()) {
                return false;
            }
            if (!test(it.current(), oit.current())) {
                return false;
            }
        }
        this._length = len;
        return true;
    };
    SeqImpl.prototype.count = function (test) {
        var it = this.fit();
        var count = 0;
        var len = 0;
        while (it.iterate()) {
            len++;
            if (test(it.current())) {
                count++;
            }
        }
        this._length = len;
        return count;
    };
    SeqImpl.prototype._dropBuilder = function (n) {
        var getFIterator = function (it) {
            var index = -1;
            while (++index < n && it.iterate()) { }
            return Iterable_1.iterator(function () { return it.iterate(); }, function () { return it.current(); });
        };
        var getBIterator = function (it) {
            var buffer = [];
            var index = -1;
            while (++index < n && it.iterate()) {
                buffer.push(it.current());
            }
            var hasMore = false;
            return Iterable_1.iterator(function () { return hasMore = it.iterate(); }, function () {
                if (hasMore) {
                    buffer.push(it.current());
                    return buffer.shift();
                }
                throw 'drop: no such element';
            });
        };
        return [getFIterator, getBIterator];
    };
    SeqImpl.prototype.dropFirst = function (n) {
        var _this = this;
        var getIts = this._dropBuilder(n);
        var nfit = this.isForward ? function () { return getIts[0](_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getIts[1](_this.bit()); } : undefined;
        var len = (this.length < 0 ? -1 : Math.max(0, this.length - n));
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.dropLast = function (n) {
        var _this = this;
        var getIts = this._dropBuilder(n);
        var nfit = this.isForward ? function () { return getIts[1](_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getIts[0](_this.bit()); } : undefined;
        var len = (this.length < 0 ? -1 : Math.max(0, this.length - n));
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.dropWhile = function (test) {
        var _this = this;
        var getFIterator = function (it) {
            var value;
            var drop;
            var initialRun = true;
            var hasNext = it.iterate();
            if (hasNext) {
                do {
                    value = it.current();
                    drop = test(value);
                    if (drop) {
                        hasNext = it.iterate();
                    }
                } while (drop && hasNext);
            }
            return Iterable_1.iterator(function () {
                if (initialRun) {
                    initialRun = false;
                }
                else {
                    hasNext = it.iterate();
                    value = hasNext ? it.current() : undefined;
                }
                return hasNext;
            }, function () { return value; });
        };
        var getBIterator = function (it) {
            var buffer = [];
            var temp = [];
            var hasNext = false;
            var value;
            return Iterable_1.iterator(function () {
                if (buffer.length > 0) {
                    hasNext = true;
                    return true;
                }
                else {
                    hasNext = it.iterate();
                    if (hasNext) {
                        do {
                            value = it.current();
                            var drop = test(value);
                            if (drop) {
                                temp.push(value);
                                hasNext = it.iterate();
                            }
                        } while (drop && hasNext);
                        if (hasNext) {
                            buffer = temp;
                            buffer.push(value);
                            temp = [];
                        }
                    }
                }
                return hasNext;
            }, function () {
                if (hasNext) {
                    return buffer.shift();
                }
                else {
                    throw ("dropWhile: no such element");
                }
            });
        };
        var nfit = this.isForward ? function () { return getFIterator(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getBIterator(_this.bit()); } : undefined;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, -1));
    };
    SeqImpl.prototype.dropAt = function () {
        var _this = this;
        var indexes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indexes[_i - 0] = arguments[_i];
        }
        var getFIterator = function () {
            var index = -1;
            var ids;
            if (indexes.length == 0) {
                return _this.fit();
            }
            else if (indexes.length == 1) {
                ids = indexes.slice();
            }
            else {
                ids = indexes.slice().sort(function (a, b) { return a - b; });
            }
            var hasNext;
            var it = _this.fit();
            var i;
            do {
                i = ids.shift();
            } while (i < 0);
            return Iterable_1.iterator(function () {
                var drop;
                do {
                    hasNext = it.iterate();
                    if (typeof i !== 'undefined' && hasNext) {
                        ++index;
                        drop = index === i;
                        if (drop) {
                            i = ids.shift();
                            if (_this._length > 0) {
                                _this._length = _this._length - 1;
                            }
                        }
                    }
                    else {
                        drop = false;
                    }
                } while (hasNext && drop);
                return hasNext;
            }, function () { return it.current(); });
        };
        var getBIterator = function () {
            var index = -1;
            var ids;
            if (indexes.length == 0) {
                return _this.bit();
            }
            else if (indexes.length == 1) {
                ids = indexes.slice();
            }
            else {
                ids = indexes.slice().sort(function (a, b) { return b - a; });
            }
            var hasNext;
            var it = _this.bit();
            var len = _this._size(true);
            var i;
            do {
                i = ids.shift();
            } while (i > len - 1);
            return Iterable_1.iterator(function () {
                var drop;
                do {
                    hasNext = it.iterate();
                    if (typeof i !== 'undefined' && hasNext) {
                        ++index;
                        var revIndex = len - 1 - index;
                        drop = revIndex === i;
                        if (drop) {
                            i = ids.shift();
                            if (_this._length > 0) {
                                _this._length = _this._length - 1;
                            }
                        }
                    }
                    else {
                        drop = false;
                    }
                } while (hasNext && drop);
                return hasNext;
            }, function () { return it.current(); });
        };
        var len;
        if (this._length < 0) {
            len = -1;
        }
        else {
            len = Math.max(this._length - indexes.reduce(function (acc, i) { return acc + (i < _this._length ? 1 : 0); }, 0), 0);
        }
        return this.newInstance(Iterable_1.iterable(this.isForward ? function () { return getFIterator(); } : undefined, this.isBackward ? function () { return getBIterator(); } : undefined, len));
    };
    SeqImpl.prototype.difference = function (other) {
        var _this = this;
        var getIterator = function (it, backward) {
            if (other.length === 0) {
                return it;
            }
            var value;
            var hasNext;
            var len = 0;
            return Iterable_1.iterator(function () {
                hasNext = it.iterate();
                var drop;
                if (hasNext) {
                    len++;
                    do {
                        value = it.current();
                        drop = backward ? other.reverse().contains(value) : other.contains(value);
                        if (drop) {
                            hasNext = it.iterate();
                            if (hasNext) {
                                len++;
                            }
                        }
                    } while (drop && hasNext);
                }
                if (hasNext) {
                    return true;
                }
                else {
                    _this._length = len;
                    return false;
                }
            }, function () { return value; });
        };
        var len;
        if (this._length < 0) {
            len = -1;
        }
        else {
            if (other.length === 0) {
                len = this._length;
            }
            else {
                len = -1;
            }
        }
        var nfit = this.isForward ? function () { return getIterator(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getIterator(_this.bit(), true); } : undefined;
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    SeqImpl.prototype.diff = function (other) {
        var _this = this;
        var getIterator = function (it) {
            if (other.length === 0) {
                return it;
            }
            var len = 0;
            var value;
            var hasNext;
            var newOther = other;
            return Iterable_1.iterator(function () {
                hasNext = it.iterate();
                if (hasNext) {
                    len++;
                    do {
                        value = it.current();
                        var drop;
                        if (other.length === 0) {
                            drop = -1;
                        }
                        else {
                            drop = newOther.indexOf(value);
                            if (drop > -1) {
                                (function (drop) {
                                    newOther = newOther.dropAt(drop);
                                })(drop);
                                hasNext = it.iterate();
                                if (hasNext) {
                                    len++;
                                }
                            }
                        }
                    } while ((drop > -1) && hasNext);
                }
                if (hasNext) {
                    return true;
                }
                else {
                    _this._length = len;
                    return false;
                }
            }, function () { return value; });
        };
        var len;
        if (this._length < 0) {
            len = -1;
        }
        else {
            if (other.length === 0) {
                len = this._length;
            }
            else {
                len = -1;
            }
        }
        return this.newInstance(Iterable_1.iterable(this.isForward ? function () { return getIterator(_this.fit()); } : undefined, undefined, len));
    };
    SeqImpl.prototype.distinct = function () {
        var _this = this;
        var getIterator = function (it, backward) {
            if (_this._length === 0 || _this._length === 1) {
                return it;
            }
            var value;
            var hasNext;
            var len = 0;
            return Iterable_1.iterator(function () {
                hasNext = it.iterate();
                var drop;
                if (hasNext) {
                    if (++len === 1) {
                        value = it.current();
                        return true;
                    }
                    do {
                        value = it.current();
                        drop = backward ? _this.reverse().takeFirst(len - 1).contains(value) : _this.takeFirst(len - 1).contains(value);
                        if (drop) {
                            hasNext = it.iterate();
                            if (hasNext) {
                                len++;
                            }
                        }
                    } while (drop && hasNext);
                }
                if (hasNext) {
                    return true;
                }
                else {
                    _this._length = len;
                    return false;
                }
            }, function () { return value; });
        };
        var len;
        if (this._length === 0 || this._length === 1) {
            len = this._length;
        }
        else {
            len = -1;
        }
        return this.newInstance(Iterable_1.iterable(this.isForward ? function () { return getIterator(_this.fit()); } : undefined, undefined, len));
    };
    SeqImpl.prototype._startsEndsWith = function () {
        var _this = this;
        var thisEndIt = function (thisIt, otherIt) {
            var thisHasNext;
            var otherHasNext;
            var equals;
            do {
                thisHasNext = thisIt.iterate();
                otherHasNext = otherIt.iterate();
                equals = (thisHasNext && otherHasNext && Iterable_1.eq(thisIt.current(), otherIt.current()));
            } while (thisHasNext && otherHasNext && equals);
            return !otherHasNext;
        };
        var otherEndIt = function (thisIt, otherIt) {
            var otherHasNext = otherIt.iterate();
            var index = -1;
            if (otherHasNext) {
                var firstVal = otherIt.current();
                while (thisIt.iterate()) {
                    index++;
                    if (Iterable_1.eq(thisIt.current(), firstVal)) {
                        var seqToTest = _this.slice(index);
                        if (seqToTest.equals(otherIt)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            else {
                return true;
            }
        };
        return [thisEndIt, otherEndIt];
    };
    SeqImpl.prototype.endsWith = function (it) {
        var _a = this._startsEndsWith(), thisEndIt = _a[0], otherEndIt = _a[1];
        if (this.isBackward && it.bit) {
            return thisEndIt(this.bit(), it.bit());
        }
        else if (this.isForward && it.fit) {
            return otherEndIt(this.fit(), it.fit());
        }
        throw "The two iterables do not iterate in the same direction";
    };
    SeqImpl.prototype.startsWith = function (it) {
        var _a = this._startsEndsWith(), thisEndIt = _a[0], otherEndIt = _a[1];
        if (this.isForward && it.fit) {
            return thisEndIt(this.fit(), it.fit());
        }
        else if (this.isBackward && it.bit) {
            return otherEndIt(this.bit(), it.bit());
        }
        throw "The two iterables do not iterate in the same direction";
    };
    SeqImpl.prototype.slice = function (from, until) {
        var _this = this;
        var fr = from ? from : 0;
        var getFit = function (it) {
            var to;
            var sliced = false;
            var index = 0;
            return Iterable_1.iterator(function () {
                var hasNext;
                if (!sliced) {
                    to = until ? until - 1 : Infinity;
                    while (index < fr && (hasNext = it.iterate())) {
                        index++;
                    }
                    sliced = true;
                }
                return (index++ <= to) ? it.iterate() : false;
            }, function () { return it.current(); });
        };
        var getBit = function (it) {
            var sliced = false;
            var index;
            return Iterable_1.iterator(function () {
                var hasNext;
                if (!sliced) {
                    var len_1 = _this._size(true);
                    var to = (until ? Math.min(until, len_1) : len_1) - 1;
                    index = len_1 - 1;
                    while (index > to && (hasNext = it.iterate())) {
                        index--;
                    }
                    sliced = true;
                }
                return (index-- >= fr) ? it.iterate() : false;
            }, function () { return it.current(); });
        };
        var nfit = this.isForward ? function () { return getFit(_this.fit()); } : undefined;
        var nbit = this.isBackward ? function () { return getBit(_this.bit()); } : undefined;
        var len = this._length < 0 ? -1 : (until ? Math.min(until, this._length) : this._length) - Math.max(fr, 0);
        return this.newInstance(Iterable_1.iterable(nfit, nbit, len));
    };
    return SeqImpl;
}(Iterable_1.IterableImpl));
exports.SeqImpl = SeqImpl;
SeqImpl.caching = false;
function seq(fit, bit, length) {
    var hasIt = false;
    var _fit;
    if (typeof fit === 'undefined') {
        _fit = function () { throw ('No Iterator'); };
    }
    else {
        _fit = fit;
        hasIt = true;
    }
    var _bit;
    if (typeof bit === 'undefined') {
        _bit = function () { throw ('No Iterator'); };
    }
    else {
        _bit = bit;
        hasIt = true;
    }
    if (!hasIt) {
        throw ("Seq: cannot instantiate: no iterators");
    }
    return new SeqImpl(Iterable_1.iterable(_fit, _bit, length));
}
exports.seq = seq;
function fseq(it) {
    return seq(it.fit, it.bit, it.length);
}
exports.fseq = fseq;
//# sourceMappingURL=SeqImpl.js.map