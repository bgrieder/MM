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
var Option_1 = require("./Option");
var Collection_1 = require("./Collection");
var Seq = (function (_super) {
    __extends(Seq, _super);
    function Seq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Seq.from = function () {
        var vals = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vals[_i] = arguments[_i];
        }
        if (vals.length === 0) {
            return new Seq([]);
        }
        if (vals.length > 1) {
            return new Seq(vals);
        }
        var value = vals[0];
        if (typeof value[Symbol.iterator] === 'undefined') {
            return new Seq([value]);
        }
        return new Seq(value);
    };
    Seq.prototype.collectFirst = function (filter) {
        var _this = this;
        return function (mapper) {
            try {
                return Option_1.some(_this.filter(filter).map(mapper).head);
            }
            catch (e) {
                return Option_1.none();
            }
        };
    };
    Seq.prototype.find = function (p) {
        var it = this[Symbol.iterator]();
        for (var n = it.next(); !n.done; n = it.next()) {
            if (p(n.value))
                return Option_1.some(n.value);
        }
        return Option_1.none();
    };
    Object.defineProperty(Seq.prototype, "headOption", {
        get: function () {
            try {
                return Option_1.some(this.head);
            }
            catch (e) {
                return Option_1.none();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Seq.prototype, "lastOption", {
        get: function () {
            try {
                return Option_1.some(this.last);
            }
            catch (e) {
                return Option_1.none();
            }
        },
        enumerable: true,
        configurable: true
    });
    return Seq;
}(Collection_1.Collection));
exports.Seq = Seq;
function seq() {
    var vals = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vals[_i] = arguments[_i];
    }
    return Seq.from.apply(Seq, vals);
}
exports.seq = seq;
//# sourceMappingURL=Seq.js.map