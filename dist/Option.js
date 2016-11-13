"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Iterable_1 = require("./Iterable");
var SeqImpl_1 = require("./SeqImpl");
var Option = (function (_super) {
    __extends(Option, _super);
    function Option(it) {
        return _super.call(this, it) || this;
    }
    Option.prototype.newInstance = function (it) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Some(it);
    };
    Option.prototype.get = function () {
        var res = this._get();
        if (res[0]) {
            return res[1];
        }
        else {
            throw new Error('No such element None.get');
        }
    };
    Option.prototype._get = function () {
        var it = this.fit();
        if (it.iterate()) {
            return [true, it.current()];
        }
        else {
            return [false, undefined];
        }
    };
    Option.prototype.isEmpty = function () { return _super.prototype.isEmpty.call(this); };
    Option.prototype.getOrElse = function (elseVal) {
        var res = this._get();
        if (res[0]) {
            return res[1];
        }
        else {
            return elseVal();
        }
    };
    Option.prototype.getOrNull = function () { return this.getOrElse(function () { return null; }); };
    Option.prototype.getOrUndefined = function () {
        return this._get()[1];
    };
    Option.prototype.map = function (f) { return this.newInstance(_super.prototype.map.call(this, f)); };
    Option.prototype.fold = function (ifEmpty, f) { return this.map(f).getOrElse(ifEmpty); };
    Option.prototype.filter = function (f) { return _super.prototype.filter.call(this, f); };
    Option.prototype.flatten = function () { return _super.prototype.flatten.call(this); };
    Option.prototype.flatMap = function (f) { return _super.prototype.flatMap.call(this, f); };
    Option.prototype.filterNot = function (test) { return this.filter(function (val) { return !test(val); }); };
    Option.prototype.exists = function (test) { return this.filter(test).map(function () { return true; }).getOrElse(function () { return false; }); };
    Option.prototype.forAll = function (test) { return this.isEmpty() || this.filter(test).map(function () { return true; }).getOrElse(function () { return false; }); };
    Option.prototype.forEach = function (f) { this.map(f).getOrElse(function () { return undefined; }); };
    Option.prototype.collect = function (partialFunction) {
        return partialFunction.someFn ? this.map(partialFunction.someFn) : none();
    };
    Option.prototype.orElse = function (alternative) {
        return this.isEmpty() ? alternative() : this;
    };
    Option.prototype.equals = function (option) {
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
    return Option;
}(SeqImpl_1.Seq));
exports.Option = Option;
var Some = (function (_super) {
    __extends(Some, _super);
    function Some() {
        return _super.apply(this, arguments) || this;
    }
    return Some;
}(Option));
exports.Some = Some;
var None = (function (_super) {
    __extends(None, _super);
    function None() {
        return _super.apply(this, arguments) || this;
    }
    return None;
}(Option));
exports.None = None;
function some(val) {
    var it = function () {
        var index = -1;
        return Iterable_1.iterator(function () { return (++index) == 0; }, function () {
            if (index !== 0) {
                throw new Error("index out of bounds: " + index);
            }
            return val;
        });
    };
    return new Some(Iterable_1.iterable(it, it, 1, function () { return [val]; }));
}
exports.some = some;
function fsome(it) {
    return new Some(it);
}
exports.fsome = fsome;
function none() {
    var it = function () {
        return Iterable_1.iterator(function () { return false; }, function () { throw "None is not iterable"; });
    };
    return new None(Iterable_1.iterable(it, it, 0, function () {
        throw "None is not iterable";
    }));
}
exports.none = none;
//# sourceMappingURL=Option.js.map