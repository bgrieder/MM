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
require('source-map-support').install();
var chai = require("chai");
var Seq_1 = require("../Seq");
var Option_1 = require("../Option");
var deepEqual = chai.assert.deepEqual;
describe('Option', function () {
    var _this = this;
    before(function (done) {
        done();
    });
    after(function (done) {
        done();
    });
    it('collect', function (done) {
        deepEqual(Option_1.none().collect(function (v) { return v % 2 === 0; })(function (v) { return v * 2; }).toArray, [], "collect failed");
        deepEqual(Option_1.some(2).collect(function (v) { return v % 2 === 0; })(function (v) { return v * 2; }).toArray, [4], "collect failed");
        done();
    });
    it('collectFirst', function (done) {
        deepEqual(Option_1.none().collectFirst(function (x) { return x === 3; })(function (x) { return x * 2; }).equals(Option_1.none()), true, "collectFirst failed");
        deepEqual(Option_1.some(2).collectFirst(function (x) { return x === 2; })(function (x) { return x * 3; }).equals(Option_1.some(6)), true, "collectFirst failed");
        deepEqual(Option_1.some(2).collectFirst(function (x) { return x === 13; })(function (x) { return x * 3; }).equals(Option_1.none()), true, "collectFirst failed");
        done();
    });
    it('concat', function (done) {
        deepEqual(Option_1.some(2).concat(Option_1.some(3)).toArray, [2, 3], "concat failed");
        deepEqual(Option_1.some(2).concat(Option_1.none()).toArray, [2], "concat failed");
        deepEqual(Option_1.none().concat(Option_1.some(3)).toArray, [3], "concat failed");
        deepEqual(Option_1.none().concat(Option_1.none()).toArray, [], "concat failed");
        done();
    });
    it('contains', function (done) {
        deepEqual(Option_1.none().contains(2), false, "contains failed");
        deepEqual(Option_1.some(2).contains(2), true, "contains failed");
        deepEqual(Option_1.some(2).contains(10), false, "contains failed");
        done();
    });
    it('count', function (done) {
        deepEqual(Option_1.none().count(function (v) { return v % 2 === 0; }), 0, "count failed");
        deepEqual(Option_1.some(2).count(function (v) { return v % 2 === 0; }), 1, "count failed");
        deepEqual(Option_1.some(2).count(function (v) { return v % 3 === 0; }), 0, "count failed");
        done();
    });
    it('drop', function (done) {
        deepEqual(Option_1.none().drop(3).isEmpty, true, "drop failed");
        deepEqual(Option_1.none().drop(3).size, 0, "drop failed");
        deepEqual(Option_1.some(2).drop(1).size, 0, "drop failed");
        done();
    });
    it('dropWhile', function (done) {
        deepEqual(Option_1.none().dropWhile(function (w) { return w < 3; }).isEmpty, true, "dropWhile failed");
        deepEqual(Option_1.some(2).dropWhile(function (w) { return w < 3; }).isEmpty, true, "dropWhile failed");
        deepEqual(Option_1.some(2).dropWhile(function (w) { return w > 50; }).isEmpty, false, "dropWhile failed");
        done();
    });
    it('equals', function (done) {
        var a1 = Seq_1.seq([1, 2, 3]);
        deepEqual(Option_1.some(2).equals(Option_1.some(2)), true, "equals failed");
        deepEqual(Option_1.some(2).equals(Option_1.none()), false, "equals failed");
        deepEqual(Option_1.none().equals(Option_1.none()), true, "equals failed");
        deepEqual(Option_1.none().equals(Option_1.some(2)), false, "equals failed");
        deepEqual(Seq_1.seq(2).equals(Option_1.some(2)), true, "equals failed");
        done();
    });
    it('exists', function (done) {
        deepEqual(Option_1.none().exists(function (v) { return v === 3; }), false, "exists failed");
        deepEqual(Option_1.some(2).exists(function (v) { return v === 2; }), true, "exists failed");
        deepEqual(Option_1.some(2).exists(function (v) { return v === 10; }), false, "exists failed");
        done();
    });
    it('filter', function (done) {
        deepEqual(Option_1.none().filter(function (v) { return v % 2 === 0; }).equals(Option_1.none()), true, "filter failed");
        deepEqual(Option_1.some(2).filter(function (v) { return v % 2 === 0; }).equals(Option_1.some(2)), true, "filter failed");
        deepEqual(Option_1.some(2).filter(function (v) { return v % 2 === 1; }).equals(Option_1.none()), true, "filter failed");
        done();
    });
    it('filterNot', function (done) {
        deepEqual(Option_1.none().filterNot(function (v) { return v % 2 === 0; }).equals(Option_1.none()), true, "filterNot failed");
        deepEqual(Option_1.some(2).filterNot(function (v) { return v % 2 === 0; }).equals(Option_1.none()), true, "filterNot failed");
        deepEqual(Option_1.some(2).filterNot(function (v) { return v % 2 === 1; }).equals(Option_1.some(2)), true, "filterNot failed");
        done();
    });
    it('flatten', function (done) {
        deepEqual(Option_1.none().flatten().equals(Option_1.none()), true, "flatten failed");
        deepEqual(Option_1.some(Option_1.none()).flatten().equals(Option_1.none()), true, "flatten failed");
        deepEqual(Option_1.some(Option_1.some(3)).flatten().equals(Option_1.some(3)), true, "flatten failed");
        done();
    });
    it('flatMap', function (done) {
        deepEqual(Option_1.none().flatMap(function (v) { return Option_1.some(v * 2); }).isEmpty, true, "flatMap failed");
        deepEqual(Option_1.some(2).flatMap(function (v) { return Option_1.some(v * 2); }).get, 4, "flatMap failed");
        deepEqual(Option_1.some(2).flatMap(function (v) { return Option_1.some(v * 2); }).equals(Option_1.some(4)), true, "flatMap failed");
        done();
    });
    it('find', function (done) {
        deepEqual(Option_1.none().find(function (x) { return x === 3; }).equals(Option_1.none()), true, "find failed");
        deepEqual(Option_1.some(2).find(function (x) { return x === 2; }).equals(Option_1.some(2)), true, "find failed");
        deepEqual(Option_1.some(2).find(function (x) { return x === 13; }).equals(Option_1.none()), true, "find failed");
        done();
    });
    it('foldLeft', function (done) {
        deepEqual(Option_1.none().foldLeft(1)(function (acc, v) { return acc + v; }), 1, "foldLeft failed");
        deepEqual(Option_1.some(2).foldLeft(1)(function (acc, v) { return acc + v; }), 3, "foldLeft failed");
        done();
    });
    it('foldRight', function (done) {
        deepEqual(Option_1.none().foldRight(1)(function (acc, v) { return acc + v; }), 1, "foldRight failed");
        deepEqual(Option_1.some(2).foldRight(1)(function (acc, v) { return acc + v; }), 3, "foldRight failed");
        done();
    });
    it('forall', function (done) {
        deepEqual(Option_1.none().forall(function (v) { return v < 50; }), true, "forall failed");
        deepEqual(Option_1.some(2).forall(function (v) { return v > 50; }), false, "forall failed");
        deepEqual(Option_1.some(2).forall(function (v) { return v < 3; }), true, "forall failed");
        done();
    });
    it('foreach', function (done) {
        var count = 0;
        var f = function (value) {
            count = count + value;
        };
        count = 0;
        Option_1.none().foreach(f);
        deepEqual(count, 0, "foreach failed");
        count = 0;
        Option_1.some(2).foreach(f);
        deepEqual(count, 2, "foreach failed");
        done();
    });
    it('get', function (done) {
        try {
            Option_1.none().get;
            return done(new Error("get Failed"));
        }
        catch (e) { }
        deepEqual(Option_1.some(2).get, 2, "get failed");
        done();
    });
    it('getOrElse', function (done) {
        deepEqual(Option_1.none().getOrElse(function () { return 3; }), 3, "getOrElse failed");
        deepEqual(Option_1.some(2).getOrElse(function () { return 3; }), 2, "getOrElse failed");
        done();
    });
    it('hasDefiniteSize', function (done) {
        deepEqual(Option_1.none().hasDefiniteSize, true, "hasDefiniteSize failed");
        deepEqual(Option_1.some(2).hasDefiniteSize, true, "hasDefiniteSize failed");
        done();
    });
    it('head', function (done) {
        try {
            Option_1.none().head;
            return done(new Error("head Failed"));
        }
        catch (e) { }
        deepEqual(Option_1.some(2).head, 2, "head failed");
        done();
    });
    it('headOption', function (done) {
        deepEqual(Option_1.none().headOption.equals(Option_1.none()), true, "headOption failed");
        deepEqual(Option_1.some(2).headOption.equals(Option_1.some(2)), true, "headOption failed");
        done();
    });
    it('indexOf', function (done) {
        deepEqual(Option_1.none().indexOf(2), -1, "indexOf failed");
        deepEqual(Option_1.some(2).indexOf(2), 0, "indexOf failed");
        deepEqual(Option_1.some(2).indexOf(3), -1, "indexOf failed");
        done();
    });
    it('isDefined', function (done) {
        deepEqual(Option_1.none().isDefined, false, "isDefined failed");
        deepEqual(Option_1.some(2).isDefined, true, "isDefined failed");
        done();
    });
    it('isEmpty', function (done) {
        deepEqual(Option_1.none().isEmpty, true, "isEmpty failed");
        deepEqual(Option_1.some(2).isEmpty, false, "isEmpty failed");
        done();
    });
    it('isIndexed', function (done) {
        deepEqual(Option_1.none().isIndexed, true, "isIndexed failed");
        deepEqual(Option_1.some(2).isIndexed, true, "isIndexed failed");
        done();
    });
    it('length', function (done) {
        deepEqual(Option_1.none().length, 0, "length failed");
        deepEqual(Option_1.some(2).length, 1, "length failed");
        done();
    });
    it('last', function (done) {
        try {
            Option_1.none().last;
            return done(new Error("last Failed"));
        }
        catch (e) { }
        deepEqual(Option_1.some(2).last, 2, "last failed");
        done();
    });
    it('lastOption', function (done) {
        deepEqual(Option_1.none().lastOption.equals(Option_1.none()), true, "lastOption failed");
        deepEqual(Option_1.some(2).lastOption.equals(Option_1.some(2)), true, "lastOption failed");
        done();
    });
    it('map', function (done) {
        deepEqual(Option_1.none().map(function (v) { return v * 2; }).equals(Option_1.none()), true, "map failed");
        deepEqual(Option_1.some(2).map(function (v) { return v * 2; }).equals(Option_1.some(4)), true, "map failed");
        done();
    });
    it('mkString', function (done) {
        deepEqual(Option_1.none().mkString(), "", "mkString failed");
        deepEqual(Option_1.some(2).mkString(), "2", "mkString failed");
        done();
    });
    it('nonEmpty', function (done) {
        deepEqual(Option_1.none().nonEmpty, false, "nonEmpty failed");
        deepEqual(Option_1.some(2).nonEmpty, true, "nonEmpty failed");
        done();
    });
    it('orElse', function (done) {
        deepEqual(Option_1.none().orElse(function () { return Option_1.some(3); }).equals(Option_1.some(3)), true, "orElse failed");
        deepEqual(Option_1.some(2).orElse(function () { return Option_1.some(3); }).equals(Option_1.some(2)), true, "orElse failed");
        done();
    });
    it('orNull', function (done) {
        deepEqual(Option_1.none().orNull, null, "orNull failed");
        deepEqual(Option_1.some(2).orNull, 2, "orNull failed");
        done();
    });
    it('orThrow', function (done) {
        try {
            Option_1.none().orThrow(function () { return "OK"; });
            return done(new Error("orThrow Failed"));
        }
        catch (e) {
            deepEqual(e.message, "OK", "orNull failed");
        }
        deepEqual(Option_1.some(2).orThrow(function () { return "Not OK"; }), 2, "orThrow failed");
        done();
    });
    it('orUndefined', function (done) {
        deepEqual(Option_1.none().orUndefined, void 0, "orUndefined failed");
        deepEqual(Option_1.some(2).orUndefined, 2, "orUndefined failed");
        done();
    });
    it('reverse', function (done) {
        deepEqual(Option_1.some(2).reverse.toArray, [2], "reverse failed");
        deepEqual(Option_1.none().reverse.toArray, [], "reverse failed");
        done();
    });
    it('slice', function (done) {
        deepEqual(Option_1.none().slice(2, 5).toArray, [], "slice failed");
        deepEqual(Option_1.some(2).slice(0, 1).toArray, [2], "slice failed");
        deepEqual(Option_1.some(2).slice(2, 5).toArray, [], "slice failed");
        done();
    });
    it('size', function (done) {
        deepEqual(Option_1.none().size, 0, "size failed");
        deepEqual(Option_1.some(2).size, 1, "size failed");
        done();
    });
    it('sum', function (done) {
        try {
            Option_1.none().sum;
            return done(new Error("sum Failed"));
        }
        catch (e) { }
        deepEqual(Option_1.some(2).sum, 2, "sum failed");
        done();
    });
    it('tail', function (done) {
        deepEqual(Option_1.none().tail.toArray, [], "tail failed");
        deepEqual(Option_1.some(2).tail.toArray, [], "tail failed");
        done();
    });
    it('take', function (done) {
        deepEqual(Option_1.none().take(3).toArray, [], "take failed");
        deepEqual(Option_1.some(2).take(3).toArray, [2], "take failed");
        done();
    });
    it('toIndexed', function (done) {
        deepEqual(Option_1.none().toIndexed.isIndexed, true, "toIndexed failed");
        deepEqual(Option_1.some(2).toIndexed.isIndexed, true, "toIndexed failed");
        done();
    });
    it('toPromise', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = deepEqual;
                    return [4 /*yield*/, Option_1.none().toPromise.catch(function () { return 2; })];
                case 1:
                    _a.apply(void 0, [_e.sent(), 2, "toPromise failed"]);
                    _c = deepEqual;
                    return [4 /*yield*/, Option_1.some(2).toPromise];
                case 2:
                    _c.apply(void 0, [_e.sent(), 2, "toPromise failed"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('toString', function (done) {
        deepEqual(Option_1.none().toString, "", "toString failed");
        deepEqual(Option_1.some(2).toString, "2", "toString failed");
        done();
    });
    it('should be a monad', function (done) {
        var f = function (x) { return Seq_1.seq([x * x]); };
        var g = function (x) { return Seq_1.seq([x + 2]); };
        deepEqual(Seq_1.seq([3]).flatMap(f).toArray, f(3).toArray, "1st Monad Law");
        deepEqual(Seq_1.seq([1, 2, 3]).flatMap(function (x) { return Seq_1.seq([x]); }).toArray, Seq_1.seq([1, 2, 3]).toArray, "2nd Monad Law");
        deepEqual(Seq_1.seq([1, 2, 3]).flatMap(function (x) { return f(x).flatMap(g); }).toArray, Seq_1.seq([1, 2, 3]).flatMap(f).flatMap(g).toArray, "3rd Monad Law");
        done();
    });
    it('should be lazy', function (done) {
        var count = 0;
        var f = function (value) {
            count = count + 1;
            return value < 3;
        };
        count = 0;
        Option_1.none().filter(f).take(3).toArray;
        deepEqual(count, 0, "lazy failed");
        count = 0;
        Option_1.some(2).filter(f).take(3);
        deepEqual(count, 0, "lazy failed");
        count = 0;
        Option_1.some(2).filter(f).take(3).toArray;
        deepEqual(count, 1, "lazy failed");
        done();
    });
    it('option', function (done) {
        deepEqual(Option_1.option(null).isEmpty, true, "option failed");
        deepEqual(Option_1.option(void 0).isEmpty, true, "option failed");
        deepEqual(Option_1.option(parseInt("blah")).isEmpty, true, "option failed");
        deepEqual(Option_1.option(2).isDefined, true, "option failed");
        done();
    });
});
//# sourceMappingURL=Option.test.js.map