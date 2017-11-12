"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Try = (function () {
    function Try(computation) {
        this._computation = computation;
        this._result = void 0;
        this._failed = false;
    }
    Try.from = function (value) {
        if (typeof value === 'function') {
            return new Try(value);
        }
        return new Try(function () { return value; });
    };
    Try.prototype.compute = function () {
        var _this = this;
        return Option_1.option(this._result).getOrElse(function () {
            try {
                _this._result = _this._computation();
                _this._failed = false;
            }
            catch (e) {
                _this._result = e;
                _this._failed = true;
            }
            return _this._result;
        });
    };
    Try.prototype.computeThrow = function () {
        var res = this.compute();
        if (this._failed) {
            throw res;
        }
        return res;
    };
    Try.prototype.collect = function (filter) {
        var _this = this;
        return function (mapper) { return _this.filter(filter).map(mapper); };
    };
    Object.defineProperty(Try.prototype, "failed", {
        get: function () {
            var res = this.compute();
            if (this._failed) {
                return new Try(function () { return res; });
            }
            return new Try(function () { return new Error(res.toString()); });
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.filter = function (f) {
        var computeThrow = this.computeThrow.bind(this);
        return new Try(function () {
            if (f()) {
                return computeThrow();
            }
            throw new Error("Filter not statisfied");
        });
    };
    Try.prototype.flatMap = function (f) {
        return this.map(f).flatten();
    };
    Try.prototype.flatten = function () {
        var _this = this;
        return new Try(function () {
            var res = _this.compute();
            if (_this._failed) {
                throw res;
            }
            if (res instanceof Try) {
                return res.get;
            }
            return res;
        });
    };
    Try.prototype.fold = function (ffailure, fsuccess) {
        var res = this.compute();
        if (this._failed) {
            return ffailure(res);
        }
        return fsuccess(res);
    };
    Try.prototype.foreach = function (f) {
        var res = this.compute();
        if (this._failed) {
            return;
        }
        f(res);
    };
    Object.defineProperty(Try.prototype, "get", {
        get: function () {
            var res = this.compute();
            if (this._failed) {
                throw res;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.getOrElse = function (elseVal) {
        var res = this.compute();
        if (this._failed) {
            return elseVal();
        }
        return res;
    };
    Object.defineProperty(Try.prototype, "isFailure", {
        get: function () {
            var _this = this;
            return Option_1.option(this._result).map(function () { return _this._failed; }).getOrElse(function () {
                _this.compute();
                return _this._failed;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isSuccess", {
        get: function () {
            return !this.isFailure;
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.map = function (f) {
        var _this = this;
        return new Try(function () { return f(_this.get); });
    };
    Try.prototype.orElse = function (f) {
        var _this = this;
        return new Try(function () {
            var res = _this.compute();
            if (_this._failed) {
                return f().get;
            }
            return res;
        });
    };
    Try.prototype.recover = function (fn) {
        var _this = this;
        return new Try(function () {
            var res = _this.compute();
            if (_this._failed) {
                return fn(res);
            }
            return res;
        });
    };
    Try.prototype.recoverWith = function (fn) {
        return this.recover(fn).flatten();
    };
    Object.defineProperty(Try.prototype, "toOption", {
        get: function () {
            var _this = this;
            var iter = (_a = {},
                _a[Symbol.iterator] = function () {
                    var done = false;
                    return {
                        next: function () {
                            var res;
                            if (!done) {
                                res = _this.compute();
                            }
                            var n = {
                                done: done || _this._failed,
                                value: res instanceof Error ? void 0 : res
                            };
                            done = true;
                            return n;
                        }
                    };
                },
                _a);
            return Option_1.option(iter);
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "toPromise", {
        get: function () {
            return this.map(function (v) { return Promise.resolve(v); }).getOrElse(function () { return Promise.reject(new Error('No such element None.get')); });
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.transform = function (ffailure, fsuccess) {
        var _this = this;
        return new Try(function () { return _this.fold(ffailure, fsuccess); }).flatten();
    };
    return Try;
}());
exports.Try = Try;
function tri(computation) {
    return Try.from(computation);
}
exports.tri = tri;
//# sourceMappingURL=Try.js.map