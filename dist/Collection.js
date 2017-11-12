"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
var arrayFrom = function (iterator) {
    var a = [];
    while (true) {
        var n = iterator.next();
        if (n.done) {
            return a;
        }
        a.push(n.value);
    }
};
var Collection = (function () {
    function Collection(value) {
        this._value = value;
    }
    Collection.prototype[Symbol.iterator] = function () {
        return this._value[Symbol.iterator]();
    };
    Collection.prototype.build = function (next) {
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
    Collection.prototype.at = function (index) {
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
    Collection.prototype.collect = function (filter) {
        var _this = this;
        return function (mapper) { return _this.filter(filter).map(mapper); };
    };
    Collection.prototype.concat = function (that) {
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
    Collection.prototype.contains = function (elem) {
        return this.indexOf(elem) !== -1;
    };
    Collection.prototype.count = function (p) {
        return this.filter(p).size;
    };
    Collection.prototype.drop = function (n) {
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
    Collection.prototype.dropWhile = function (p) {
        var it = this[Symbol.iterator]();
        var i = 0;
        var next = function () {
            var nv = it.next();
            if (nv.done) {
                return { done: true };
            }
            i = i + 1;
            if (p(nv.value)) {
                return next();
            }
            return { done: false, value: nv.value };
        };
        return this.build(next);
    };
    Collection.prototype.equals = function (that) {
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
    Collection.prototype.exists = function (p) {
        return this.filter(p).take(1).size === 1;
    };
    Collection.prototype.filter = function (filter) {
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
    Collection.prototype.filterNot = function (filter) {
        return this.filter(function (value) { return !filter(value); });
    };
    Collection.prototype.flatMap = function (f) {
        return this.map(f).flatten();
    };
    Collection.prototype.flatten = function () {
        var it = this[Symbol.iterator]();
        var inMain = true;
        var subIt;
        var iterateInMain = function () {
            inMain = true;
            var n = it.next();
            if (n.done)
                return { done: true };
            if (n.value instanceof Collection) {
                subIt = n.value[Symbol.iterator]();
                return iterateInSub();
            }
            return { done: false, value: n.value };
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
    Collection.prototype.foldLeft = function (initialValue) {
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
    Collection.prototype.foldRight = function (initialValue) {
        var _this = this;
        return function (op) { return _this.reverse.foldLeft(initialValue)(op); };
    };
    Collection.prototype.forall = function (p) {
        var it = this[Symbol.iterator]();
        for (var n = it.next(); !n.done; n = it.next()) {
            if (!p(n.value))
                return false;
        }
        return true;
    };
    Collection.prototype.foreach = function (f) {
        var it = this[Symbol.iterator]();
        for (var n = it.next(); !n.done; n = it.next()) {
            f(n.value);
        }
    };
    Object.defineProperty(Collection.prototype, "hasDefiniteSize", {
        get: function () {
            return typeof this._value.length !== 'undefined' || Array.isArray(this._value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "head", {
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
    Collection.prototype.indexOf = function (elem, from) {
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
    Object.defineProperty(Collection.prototype, "isEmpty", {
        get: function () {
            if (typeof this._value.length !== 'undefined') {
                return this._value.length === 0;
            }
            var it = this[Symbol.iterator]();
            return it.next().done;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "isIndexed", {
        get: function () {
            return Array.isArray(this._value) || typeof this._value === 'string';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "last", {
        get: function () {
            if (this.isEmpty) {
                throw new Error('No such element: head');
            }
            if (this.isIndexed) {
                return this.at(this.size - 1);
            }
            if (typeof this._value.reverseIterator !== 'undefined') {
                return this._value.reverseIterator().next().value;
            }
            var it = this[Symbol.iterator]();
            var last = void 0;
            while (true) {
                var n = it.next();
                if (n.done)
                    return last;
                last = n.value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "length", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.map = function (f) {
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
    Collection.prototype.mkString = function (startOrSep, sep, end) {
        if (typeof startOrSep === 'undefined') {
            startOrSep = '';
            sep = '';
            end = '';
        }
        else if (typeof sep === 'undefined') {
            sep = startOrSep;
            startOrSep = '';
            end = '';
        }
        return this.foldLeft('')(function (s, v, i) {
            return s + (i == 0 ? startOrSep : sep) + v.toString();
        }) + end;
    };
    Object.defineProperty(Collection.prototype, "nonEmpty", {
        get: function () {
            return !this.isEmpty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "reverse", {
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
    Object.defineProperty(Collection.prototype, "size", {
        get: function () {
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
    Collection.prototype.slice = function (from, until) {
        return Array.isArray(this._value) ?
            new this.constructor(this._value.slice(from, until))
            :
                this.drop(from).take(until - from);
    };
    Object.defineProperty(Collection.prototype, "sum", {
        get: function () {
            var first = this.head;
            return this.tail.foldLeft(first)(function (s, v) { return s + v; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "tail", {
        get: function () {
            return this.drop(1);
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.take = function (n) {
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
    Object.defineProperty(Collection.prototype, "toArray", {
        get: function () {
            return Array.isArray(this._value) ?
                this._value.slice()
                :
                    arrayFrom(this._value[Symbol.iterator]());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "toIndexed", {
        get: function () {
            if (this.isIndexed)
                return this;
            return new this.constructor(this.toArray);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "toString", {
        get: function () {
            return this.mkString();
        },
        enumerable: true,
        configurable: true
    });
    return Collection;
}());
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map