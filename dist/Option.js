"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("./Collection");
var Option = (function (_super) {
    __extends(Option, _super);
    function Option() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Option.from = function (optVal) {
        if (typeof optVal[Symbol.iterator] === 'undefined') {
            return new Option([optVal]);
        }
        return new Option(optVal);
    };
    Option.prototype.collect = function (filter) {
        var _this = this;
        return function (mapper) { return _super.prototype.collect.call(_this, filter)(mapper); };
    };
    Option.prototype.collectFirst = function (filter) {
        var _this = this;
        return function (mapper) {
            return _this.filter(filter).map(mapper);
        };
    };
    Option.prototype.exists = function (p) {
        return _super.prototype.exists.call(this, p);
    };
    Option.prototype.filter = function (f) {
        return _super.prototype.filter.call(this, f);
    };
    Option.prototype.filterNot = function (f) {
        return _super.prototype.filterNot.call(this, f);
    };
    Option.prototype.find = function (p) {
        return this.filter(p);
    };
    Option.prototype.flatMap = function (f) {
        return _super.prototype.flatMap.call(this, f);
    };
    Option.prototype.flatten = function () {
        return _super.prototype.flatten.call(this);
    };
    Option.prototype.forall = function (p) {
        return _super.prototype.forall.call(this, p);
    };
    Option.prototype.foreach = function (f) {
        return _super.prototype.foreach.call(this, f);
    };
    Object.defineProperty(Option.prototype, "get", {
        get: function () {
            return this.head;
        },
        enumerable: true,
        configurable: true
    });
    Option.prototype.getOrElse = function (elseVal) {
        try {
            return this.get;
        }
        catch (e) {
            return elseVal();
        }
    };
    Object.defineProperty(Option.prototype, "headOption", {
        get: function () {
            return new Option(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "isDefined", {
        get: function () {
            return !this.isEmpty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "last", {
        get: function () {
            if (this.isEmpty) {
                throw new Error("No such element: last in None");
            }
            return this.get;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "lastOption", {
        get: function () {
            return new Option(this);
        },
        enumerable: true,
        configurable: true
    });
    Option.prototype.map = function (f) {
        return _super.prototype.map.call(this, f);
    };
    Object.defineProperty(Option.prototype, "nonEmpty", {
        get: function () {
            return !this.isEmpty;
        },
        enumerable: true,
        configurable: true
    });
    Option.prototype.orElse = function (alternative) {
        return this.isEmpty ? alternative() : this;
    };
    Object.defineProperty(Option.prototype, "orNull", {
        get: function () {
            try {
                return this.get;
            }
            catch (e) {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Option.prototype.orThrow = function (message) {
        try {
            return this.get;
        }
        catch (e) {
            throw new Error(message());
        }
    };
    Object.defineProperty(Option.prototype, "orUndefined", {
        get: function () {
            try {
                return this.get;
            }
            catch (e) {
                return void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "toPromise", {
        get: function () {
            return this.map(function (v) { return Promise.resolve(v); }).getOrElse(function () { return Promise.reject(new Error('No such element None.get')); });
        },
        enumerable: true,
        configurable: true
    });
    return Option;
}(Collection_1.Collection));
exports.Option = Option;
function some(value) {
    return Option.from([value]);
}
exports.some = some;
function none() {
    return Option.from([]);
}
exports.none = none;
function option(value) {
    return (typeof value === 'undefined' || value === null || value !== value) ? Option.from([]) : Option.from(value);
}
exports.option = option;
//# sourceMappingURL=Option.js.map