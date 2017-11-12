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
var Seq_1 = require("./Seq");
var Range = (function (_super) {
    __extends(Range, _super);
    function Range() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Range.from = function (lengthOrStart, end, step) {
        var rstart, rend, rstep;
        if (typeof end === 'undefined' && typeof step === 'undefined') {
            rstart = 0;
            rstep = 1;
            rend = Math.floor(lengthOrStart) - rstep;
        }
        else if (typeof step === 'undefined') {
            rstep = 1;
            rstart = Math.floor(lengthOrStart);
            rend = Math.floor(end) - rstep;
        }
        else {
            rstart = lengthOrStart;
            rend = end;
            rstep = step;
        }
        var iter = (_a = {},
            _a[Symbol.iterator] = function () {
                var current = rstart;
                return {
                    next: function () {
                        var done = rstep <= 0 ? current < rend : current > rend;
                        var value = done ? void 0 : current;
                        current = current + rstep;
                        return { done: done, value: value };
                    }
                };
            },
            _a.length = Math.floor((rend + rstep - rstart) / rstep),
            _a.reverseIterator = function () {
                var current = rend;
                return {
                    next: function () {
                        var done = rstep > 0 ? current < rstart : current > rstart;
                        var value = done ? void 0 : current;
                        current = current - rstep;
                        return { done: done, value: value };
                    }
                };
            },
            _a);
        return new Range(iter);
        var _a;
    };
    return Range;
}(Seq_1.Seq));
exports.Range = Range;
function range(lengthOrStart, end, step) {
    return Range.from(lengthOrStart, end, step);
}
exports.range = range;
//# sourceMappingURL=Range.js.map