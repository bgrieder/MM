"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("../Option");
require('source-map-support').install();
var chai = require("chai");
var Try_1 = require("../Try");
var deepEqual = chai.assert.deepEqual;
describe('Try', function () {
    var _this = this;
    before(function (done) {
        done();
    });
    after(function (done) {
        done();
    });
    it('collect', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).collect(function () { return true; })(function (v) { return v * 2; }).get, 4, "collect failed");
        deepEqual(Try_1.tri(function () { return 2; }).collect(function () { return false; })(function (v) { return v * 2; }).isFailure, true, "collect failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).collect(function () { return true; })(function (v) { return v * 2; }).isFailure, true, "collect failed");
        done();
    });
    it('filter', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).filter(function () { return true; }).get, 2, "filter failed");
        try {
            Try_1.tri(function () { return 2; }).filter(function () { return false; }).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
        }
        try {
            Try_1.tri(function () { throw new Error('OK'); }).filter(function () { return true; }).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
        }
        try {
            Try_1.tri(function () { throw new Error('OK'); }).filter(function () { return false; }).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
        }
        done();
    });
    it('flatten', function (done) {
        deepEqual(Try_1.tri(function () { return Try_1.tri(function () { return 2; }); }).flatten().get, 2, "flatten failed");
        deepEqual(Try_1.tri(function () { return 2; }).flatten().get, 2, "flatten failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).flatten().isFailure, true, "flatten failed");
        deepEqual(Try_1.tri(function () { return Try_1.tri(function () { throw new Error('OK'); }); }).flatten().isFailure, true, "flatten failed");
        done();
    });
    it('flatMap', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).flatMap(function (v) { return Try_1.tri(function () { return v * 3; }); }).get, 6, "flatMap failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).flatMap(function (v) { return Try_1.tri(function () { return v * 3; }); }).isFailure, true, "flatMap failed");
        done();
    });
    it('fold', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).fold(function (e) { return 3; }, function (v) { return v * 2; }), 4, "fold failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).fold(function (e) { return 3; }, function (v) { return v * 2; }), 3, "fold failed");
        done();
    });
    it('foreach', function (done) {
        var count = 0;
        var f = function (value) {
            count = count + value;
        };
        count = 0;
        Try_1.tri(function () { throw new Error('OK'); }).foreach(f);
        deepEqual(count, 0, "foreach failed");
        count = 0;
        Try_1.tri(function () { return 2; }).foreach(f);
        deepEqual(count, 2, "foreach failed");
        done();
    });
    it('get', function (done) {
        try {
            Try_1.tri(function () { throw new Error('OK'); }).get;
            return done(new Error("get Failed"));
        }
        catch (e) {
        }
        deepEqual(Try_1.tri(function () { return 2; }).get, 2, 'get Failed');
        done();
    });
    it('getOrElse', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).getOrElse(function () { return 3; }), 2, "getOrElse failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).getOrElse(function () { return 3; }), 3, "getOrElse failed");
        done();
    });
    it('map', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).map(function (v) { return v * 2; }).get, 4, "map failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).map(function (v) { return v * 2; }).isFailure, true, "map failed");
        done();
    });
    it('orElse', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).orElse(function () { return Try_1.tri(function () { return 3; }); }).get, 2, "orElse failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).orElse(function () { return Try_1.tri(function () { return 3; }); }).get, 3, "orElse failed");
        done();
    });
    it('recover', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).recover(function (e) { return 3; }).get, 2, "recover failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).recover(function (e) { return 3; }).get, 3, "recover failed");
        done();
    });
    it('recoverWith', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).recoverWith(function (e) { return Try_1.tri(function () { return 3; }); }).get, 2, "recoverWith failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).recoverWith(function (e) { return Try_1.tri(function () { return 3; }); }).get, 3, "recoverWith failed");
        done();
    });
    it('toOption', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).toOption.get, 2, "toOption failed");
        deepEqual(Try_1.tri(function () { return 2; }).toOption.equals(Option_1.some(2)), true, "toOption failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).toOption.equals(Option_1.none()), true, "toOption failed");
        var count = 0;
        var f = function () {
            count = count + 1;
            return count * 2;
        };
        var opt = Try_1.tri(f);
        deepEqual(count, 0, "toOption failed");
        deepEqual(opt.get, 2, "toOption failed");
        deepEqual(count, 1, "toOption failed");
        done();
    });
    it('toPromise', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = deepEqual;
                    return [4 /*yield*/, Try_1.tri(function () { return 2; }).toPromise];
                case 1:
                    _a.apply(void 0, [_e.sent(), 2, "toPromise failed"]);
                    _c = deepEqual;
                    return [4 /*yield*/, Try_1.tri(function () { throw new Error('OK'); }).toPromise.catch(function () { return 2; })];
                case 2:
                    _c.apply(void 0, [_e.sent(), 2, "toPromise failed"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('transform', function (done) {
        deepEqual(Try_1.tri(function () { return 2; }).transform(function (e) { return Try_1.tri(function () { return 3; }); }, function (v) { return Try_1.tri(function () { return v * 2; }); }).get, 4, "transform failed");
        deepEqual(Try_1.tri(function () { throw new Error('OK'); }).transform(function (e) { return Try_1.tri(function () { return 3; }); }, function (v) { return Try_1.tri(function () { return v * 2; }); }).get, 3, "transform failed");
        done();
    });
    it('should be a monad', function (done) {
        var f = function (x) { return Try_1.tri(function () { return x * x; }); };
        var g = function (x) { return Try_1.tri(function () { return x + 2; }); };
        deepEqual(Try_1.tri(function () { return 3; }).flatMap(f).get, f(3).get, "1st Monad Law");
        deepEqual(Try_1.tri(function () { return 2; }).flatMap(function (x) { return Try_1.tri(function () { return x; }); }).get, Try_1.tri(function () { return 2; }).get, "2nd Monad Law");
        deepEqual(Try_1.tri(function () { return 4; }).flatMap(function (x) { return f(x).flatMap(g); }).get, Try_1.tri(function () { return 4; }).flatMap(f).flatMap(g).get, "3rd Monad Law");
        done();
    });
    it('should be lazy', function (done) {
        var count = 0;
        var f = function () {
            count = count + 1;
            return 2;
        };
        var t = Try_1.tri(f).filter(function () { return true; });
        deepEqual(count, 0, 'lazy failed');
        deepEqual(t.get, 2, 'lazy failed');
        deepEqual(count, 1, 'lazy failed');
        deepEqual(t.isSuccess, true, 'lazy failed');
        deepEqual(count, 1, 'lazy failed');
        done();
    });
    it('example', function (done) {
        function divide(numerator, denominator) {
            var parseNumerator = function () { return Option_1.option(parseFloat(numerator)).orThrow(function () { return "Please provide a valid numerator"; }); };
            var parseDenominator = function () { return Option_1.option(parseFloat(denominator)).orThrow(function () { return "Please provide a valid denominator"; }); };
            return Try_1.tri(parseNumerator).flatMap(function (num) { return Try_1.tri(parseDenominator).map(function (den) { return num / den; }); });
        }
        deepEqual(divide(6, 3).get, 2, 'example failed');
        deepEqual(divide(6, 0).get, Infinity, 'example failed');
        deepEqual(divide("blah", 3)
            .recover(function (e) {
            deepEqual(e.message.indexOf("numerator") !== -1, true, 'example failed');
            return Infinity;
        })
            .get, Infinity, 'example failed');
        deepEqual(divide(6, "blah")
            .recover(function (e) {
            deepEqual(e.message.indexOf("denominator") !== -1, true, 'example failed');
            return Infinity;
        })
            .get, Infinity, 'example failed');
        done();
    });
});
//# sourceMappingURL=Try.test.js.map