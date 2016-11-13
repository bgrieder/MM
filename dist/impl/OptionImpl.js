"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SeqImpl_1 = require("./SeqImpl");
var IteratorImpl_1 = require("./IteratorImpl");
var IterableImpl_1 = require("./IterableImpl");
var OptionImpl = (function (_super) {
    __extends(OptionImpl, _super);
    function OptionImpl(it) {
        return _super.call(this, it) || this;
    }
    OptionImpl.prototype.newInstance = function (it) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Some(it);
    };
    OptionImpl.prototype.get = function () {
        var res = this._get();
        if (res[0]) {
            return res[1];
        }
        else {
            throw new Error('No such element None.get');
        }
    };
    OptionImpl.prototype._get = function () {
        var it = this.fit();
        if (it.iterate()) {
            return [true, it.current()];
        }
        else {
            return [false, undefined];
        }
    };
    OptionImpl.prototype.isEmpty = function () { return _super.prototype.isEmpty.call(this); };
    OptionImpl.prototype.getOrElse = function (elseVal) {
        var res = this._get();
        if (res[0]) {
            return res[1];
        }
        else {
            return elseVal();
        }
    };
    OptionImpl.prototype.getOrNull = function () { return this.getOrElse(function () { return null; }); };
    OptionImpl.prototype.getOrUndefined = function () {
        return this._get()[1];
    };
    OptionImpl.prototype.map = function (f) { return this.newInstance(_super.prototype.map.call(this, f)); };
    OptionImpl.prototype.fold = function (ifEmpty, f) { return this.map(f).getOrElse(ifEmpty); };
    OptionImpl.prototype.filter = function (f) { return _super.prototype.filter.call(this, f); };
    OptionImpl.prototype.flatten = function () { return _super.prototype.flatten.call(this); };
    OptionImpl.prototype.flatMap = function (f) { return _super.prototype.flatMap.call(this, f); };
    OptionImpl.prototype.filterNot = function (test) { return this.filter(function (val) { return !test(val); }); };
    OptionImpl.prototype.exists = function (test) { return this.filter(test).map(function () { return true; }).getOrElse(function () { return false; }); };
    OptionImpl.prototype.forAll = function (test) { return this.isEmpty() || this.filter(test).map(function () { return true; }).getOrElse(function () { return false; }); };
    OptionImpl.prototype.forEach = function (f) { this.map(f).getOrElse(function () { return undefined; }); };
    OptionImpl.prototype.collect = function (partialFunction) {
        return partialFunction.someFn ? this.map(partialFunction.someFn) : none();
    };
    OptionImpl.prototype.orElse = function (alternative) {
        return this.isEmpty() ? alternative() : this;
    };
    OptionImpl.prototype.equals = function (option) {
        if (!option.isEmpty()) {
            var it_1 = this.fit();
            var oit = option.fit();
            if (it_1.iterate() && oit.iterate()) {
                var value = it_1.current();
                var other = oit.current();
                if (typeof other === 'object' && typeof value === 'object' && other['equals'] && other['equals'](value)) {
                    return true;
                }
                return other === value;
            }
            return false;
        }
        return false;
    };
    return OptionImpl;
}(SeqImpl_1.SeqImpl));
exports.OptionImpl = OptionImpl;
var Some = (function (_super) {
    __extends(Some, _super);
    function Some() {
        return _super.apply(this, arguments) || this;
    }
    return Some;
}(OptionImpl));
exports.Some = Some;
var None = (function (_super) {
    __extends(None, _super);
    function None() {
        return _super.apply(this, arguments) || this;
    }
    return None;
}(OptionImpl));
exports.None = None;
function option(value) {
    if (typeof value === 'undefined' || value === null) {
        return none();
    }
    return some(value);
}
exports.option = option;
function some(value) {
    var it = function () {
        var index = -1;
        return IteratorImpl_1.iterator(function () { return (++index) == 0; }, function () {
            if (index !== 0) {
                throw new Error("index out of bounds: " + index);
            }
            return value;
        });
    };
    return new Some(IterableImpl_1.iterable(it, it, 1, function () { return [value]; }));
}
exports.some = some;
function fsome(it) {
    return new Some(it);
}
exports.fsome = fsome;
function none() {
    var it = function () {
        return IteratorImpl_1.iterator(function () { return false; }, function () { throw "None is not iterable"; });
    };
    return new None(IterableImpl_1.iterable(it, it, 0, function () {
        throw "None is not iterable";
    }));
}
exports.none = none;
//# sourceMappingURL=OptionImpl.js.map