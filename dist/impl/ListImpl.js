"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IterableImpl_1 = require("./IterableImpl");
var IteratorImpl_1 = require("./IteratorImpl");
var SeqImpl_1 = require("./SeqImpl");
var ListImpl = (function (_super) {
    __extends(ListImpl, _super);
    function ListImpl(it) {
        var _this = _super.call(this, it) || this;
        _this.get = _this.toArray;
        _this.push = _this.append;
        if (typeof _this.fit === 'undefined' || typeof _this.bit === 'undefined') {
            throw new Error("List must be instantiated with iterables that can be traversed in both directions");
        }
        return _this;
    }
    ListImpl.prototype.newInstance = function (it) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new ListImpl(it);
    };
    ListImpl.prototype.map = function (f) {
        return _super.prototype.map.call(this, f);
    };
    ListImpl.prototype.filter = function (f) {
        return _super.prototype.filter.call(this, f);
    };
    ListImpl.prototype.flatten = function () {
        return _super.prototype.flatten.call(this);
    };
    ListImpl.prototype.flatMap = function (f) {
        return _super.prototype.flatMap.call(this, f);
    };
    ListImpl.prototype.size = function () {
        return this.get().length;
    };
    ListImpl.prototype.takeFirst = function (n) {
        return _super.prototype.takeFirst.call(this, n);
    };
    ListImpl.prototype.reverse = function () {
        return _super.prototype.reverse.call(this);
    };
    ListImpl.prototype.concat = function (it) {
        return _super.prototype.concat.call(this, it);
    };
    ListImpl.prototype.prepend = function (a) {
        return _super.prototype.prepend.call(this, a);
    };
    ListImpl.prototype.append = function (a) {
        return _super.prototype.append.call(this, a);
    };
    return ListImpl;
}(SeqImpl_1.SeqImpl));
exports.ListImpl = ListImpl;
function list() {
    var vals = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vals[_i - 0] = arguments[_i];
    }
    var len = vals.length;
    var fit = function () {
        var index = -1;
        return IteratorImpl_1.iterator(function () { return ++index < len; }, function () { return vals[index]; });
    };
    var bit = function () {
        var index = len;
        return IteratorImpl_1.iterator(function () { return (--index >= 0); }, function () { return vals[index]; });
    };
    return new ListImpl(IterableImpl_1.iterable(fit, bit, len));
}
exports.list = list;
function alist(array) {
    return list.apply(this, array);
}
exports.alist = alist;
function flist(it) {
    if (typeof it.fit === 'undefined' || typeof it.bit === 'undefined') {
        throw ('List: new instance: both a forward and a backward iterator are required');
    }
    return new ListImpl(it);
}
exports.flist = flist;
//# sourceMappingURL=ListImpl.js.map