"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
var chai = require("chai");
var Seq_1 = require("../Seq");
var Option_1 = require("../Option");
var deepEqual = chai.assert.deepEqual;
var iter = (_a = {},
    _a[Symbol.iterator] = function () {
        var count = -1;
        return {
            next: function () {
                count = count + 1;
                return {
                    done: count == 10,
                    value: count
                };
            }
        };
    },
    _a);
var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
describe('Seq', function () {
    before(function (done) {
        done();
    });
    after(function (done) {
        done();
    });
    it('collect', function (done) {
        var a1 = Seq_1.seq([1, 2, 3, 4, 5, 6]);
        deepEqual(a1.collect(function (v) { return v % 2 === 0; })(function (v) { return v * 2; }).toArray, [4, 8, 12], "collect failed");
        deepEqual(Seq_1.seq(iter).collect(function (v) { return v % 2 === 0; })(function (v) { return v * 2; }).toArray, [0, 4, 8, 12, 16], "collect failed");
        done();
    });
    it('collectFirst', function (done) {
        deepEqual(Seq_1.seq(arr).collectFirst(function (x) { return x === 3; })(function (x) { return x * 2; }).equals(Option_1.some(6)), true, "collectFirst failed");
        deepEqual(Seq_1.seq(arr).collectFirst(function (x) { return x === 13; })(function (x) { return x * 2; }).equals(Option_1.none()), true, "collectFirst failed");
        deepEqual(Seq_1.seq(iter).collectFirst(function (x) { return x === 3; })(function (x) { return x * 2; }).equals(Option_1.some(6)), true, "collectFirst failed");
        deepEqual(Seq_1.seq(iter).collectFirst(function (x) { return x === 13; })(function (x) { return x * 2; }).equals(Option_1.none()), true, "collectFirst failed");
        done();
    });
    it('concat', function (done) {
        var a1 = Seq_1.seq([1, 2, 3]);
        var a2 = Seq_1.seq([4, 5, 6]);
        var a3 = a1.concat(a2);
        deepEqual(a3.toArray, [1, 2, 3, 4, 5, 6], "concat failed");
        deepEqual(Seq_1.seq(iter).concat(Seq_1.seq(iter)).toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "concat failed");
        done();
    });
    it('contains', function (done) {
        deepEqual(Seq_1.seq(arr).contains(2), true, "contains failed");
        deepEqual(Seq_1.seq(arr).contains(10), false, "contains failed");
        deepEqual(Seq_1.seq(iter).contains(2), true, "contains failed");
        deepEqual(Seq_1.seq(iter).contains(10), false, "contains failed");
        done();
    });
    it('count', function (done) {
        deepEqual(Seq_1.seq(arr).count(function (v) { return v % 2 === 0; }), 5, "count failed");
        deepEqual(Seq_1.seq(iter).count(function (v) { return v % 2 === 0; }), 5, "count failed");
        done();
    });
    it('drop', function (done) {
        deepEqual(Seq_1.seq(arr).drop(3).head, 3, "drop failed");
        deepEqual(Seq_1.seq(arr).drop(3).size, 7, "drop failed");
        deepEqual(Seq_1.seq(arr).drop(50).size, 0, "drop failed");
        deepEqual(Seq_1.seq(iter).drop(3).head, 3, "drop failed");
        deepEqual(Seq_1.seq(iter).drop(3).size, 7, "drop failed");
        deepEqual(Seq_1.seq(iter).drop(50).size, 0, "drop failed");
        done();
    });
    it('dropWhile', function (done) {
        deepEqual(Seq_1.seq(arr).dropWhile(function (w) { return w < 3; }).head, 3, "dropWhile failed");
        deepEqual(Seq_1.seq(arr).dropWhile(function (w) { return w < 3; }).size, 7, "dropWhile failed");
        deepEqual(Seq_1.seq(arr).dropWhile(function (w) { return w < 50; }).size, 0, "dropWhile failed");
        deepEqual(Seq_1.seq(iter).dropWhile(function (w) { return w < 3; }).head, 3, "dropWhile failed");
        deepEqual(Seq_1.seq(iter).dropWhile(function (w) { return w < 3; }).size, 7, "dropWhile failed");
        deepEqual(Seq_1.seq(iter).dropWhile(function (w) { return w < 50; }).size, 0, "dropWhile failed");
        done();
    });
    it('equals', function (done) {
        var a1 = Seq_1.seq([1, 2, 3]);
        deepEqual(a1.equals(Seq_1.seq([1, 2, 3])), true, "equals failed");
        deepEqual(a1.equals(Seq_1.seq([1, 2])), false, "equals failed");
        deepEqual(a1.equals(Seq_1.seq([1, '2', 3])), false, "equals failed");
        deepEqual(Seq_1.seq(iter).equals(Seq_1.seq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])), true, "equals failed");
        done();
    });
    it('exists', function (done) {
        deepEqual(Seq_1.seq(arr).exists(function (v) { return v === 3; }), true, "exists failed");
        deepEqual(Seq_1.seq(arr).exists(function (v) { return v === 10; }), false, "exists failed");
        deepEqual(Seq_1.seq(iter).exists(function (v) { return v === 3; }), true, "exists failed");
        deepEqual(Seq_1.seq(iter).exists(function (v) { return v === 10; }), false, "exists failed");
        done();
    });
    it('filter', function (done) {
        deepEqual(Seq_1.seq(arr).filter(function (v) { return v % 2 === 0; }).toArray, [0, 2, 4, 6, 8], "filter failed");
        deepEqual(Seq_1.seq(iter).filter(function (v) { return v % 2 === 0; }).toArray, [0, 2, 4, 6, 8], "filter failed");
        done();
    });
    it('filterNot', function (done) {
        deepEqual(Seq_1.seq(arr).filterNot(function (v) { return v % 2 === 0; }).toArray, [1, 3, 5, 7, 9], "filterNot failed");
        deepEqual(Seq_1.seq(iter).filterNot(function (v) { return v % 2 === 0; }).toArray, [1, 3, 5, 7, 9], "filterNot failed");
        done();
    });
    it('flatten', function (done) {
        var a1 = Option_1.option([Option_1.option([0, 1]), Option_1.option([2, 3]), 4, Option_1.option([5, 6])]);
        deepEqual(a1.flatten().toArray, [0, 1, 2, 3, 4, 5, 6], "flatten failed");
        deepEqual(Seq_1.seq([Seq_1.seq(iter), Seq_1.seq(iter)]).flatten().toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "flatten failed");
        done();
    });
    it('flatMap', function (done) {
        var a1 = Seq_1.seq([1, 2, 3]);
        deepEqual(a1.flatMap(function (v) { return Seq_1.seq([v * 2]); }).toArray, [2, 4, 6], "flatMap failed");
        deepEqual(Seq_1.seq(iter).flatMap(function (v) { return Seq_1.seq([v * 2]); }).toArray, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "flatMap failed");
        done();
    });
    it('find', function (done) {
        deepEqual(Seq_1.seq(arr).find(function (x) { return x === 3; }).equals(Option_1.some(3)), true, "find failed");
        deepEqual(Seq_1.seq(arr).find(function (x) { return x === 13; }).equals(Option_1.none()), true, "find failed");
        deepEqual(Seq_1.seq(iter).find(function (x) { return x === 3; }).equals(Option_1.some(3)), true, "find failed");
        deepEqual(Seq_1.seq(iter).find(function (x) { return x === 13; }).equals(Option_1.none()), true, "find failed");
        done();
    });
    it('foldLeft', function (done) {
        deepEqual(Seq_1.seq(arr).foldLeft(1)(function (acc, v) { return acc + v; }), 46, "foldLeft failed");
        deepEqual(Seq_1.seq(iter).foldLeft(1)(function (acc, v) { return acc + v; }), 46, "foldLeft failed");
        done();
    });
    it('foldRight', function (done) {
        deepEqual(Seq_1.seq(arr).foldRight(1)(function (acc, v) { return acc + v; }), 46, "foldRight failed");
        deepEqual(Seq_1.seq(iter).foldRight(1)(function (acc, v) { return acc + v; }), 46, "foldRight failed");
        done();
    });
    it('forall', function (done) {
        deepEqual(Seq_1.seq(arr).forall(function (v) { return v < 50; }), true, "forall failed");
        deepEqual(Seq_1.seq(arr).forall(function (v) { return v < 3; }), false, "forall failed");
        deepEqual(Seq_1.seq(iter).forall(function (v) { return v < 50; }), true, "forall failed");
        deepEqual(Seq_1.seq(iter).forall(function (v) { return v < 3; }), false, "forall failed");
        done();
    });
    it('foreach', function (done) {
        var count = 0;
        var f = function (value) {
            count = count + value;
        };
        count = 0;
        Seq_1.seq(arr).foreach(f);
        deepEqual(count, 45, "foreach failed");
        count = 0;
        Seq_1.seq(iter).foreach(f);
        deepEqual(count, 45, "foreach failed");
        done();
    });
    it('hasDefiniteSize', function (done) {
        deepEqual(Seq_1.seq(arr).hasDefiniteSize, true, "hasDefiniteSize failed");
        deepEqual(Seq_1.seq(iter).hasDefiniteSize, false, "hasDefiniteSize failed");
        done();
    });
    it('head', function (done) {
        deepEqual(Seq_1.seq(arr).head, 0, "head failed");
        deepEqual(Seq_1.seq(iter).head, 0, "head failed");
        done();
    });
    it('headOption', function (done) {
        deepEqual(Seq_1.seq(arr).headOption.equals(Option_1.some(0)), true, "headOption failed");
        deepEqual(Seq_1.seq(iter).headOption.equals(Option_1.some(0)), true, "headOption failed");
        deepEqual(Seq_1.seq([]).headOption.equals(Option_1.none()), true, "headOption failed");
        done();
    });
    it('indexOf', function (done) {
        deepEqual(Seq_1.seq(arr).indexOf(2), 2, "indexOf failed");
        deepEqual(Seq_1.seq(arr).indexOf(2, 3), -1, "indexOf failed");
        deepEqual(Seq_1.seq(iter).indexOf(2), 2, "indexOf failed");
        deepEqual(Seq_1.seq(iter).indexOf(2, 3), -1, "indexOf failed");
        done();
    });
    it('isEmpty', function (done) {
        deepEqual(Seq_1.seq(arr).isEmpty, false, "isEmpty failed");
        deepEqual(Seq_1.seq([]).isEmpty, true, "isEmpty failed");
        deepEqual(Seq_1.seq(iter).isEmpty, false, "isEmpty failed");
        done();
    });
    it('isIndexed', function (done) {
        deepEqual(Seq_1.seq(arr).isIndexed, true, "isIndexed failed");
        deepEqual(Seq_1.seq(iter).isIndexed, false, "isIndexed failed");
        deepEqual(Seq_1.seq("abcdef").isIndexed, true, "isIndexed failed");
        done();
    });
    it('length', function (done) {
        deepEqual(Seq_1.seq(arr).length, 10, "length failed");
        deepEqual(Seq_1.seq(iter).length, 10, "length failed");
        done();
    });
    it('last', function (done) {
        deepEqual(Seq_1.seq(arr).last, 9, "last failed");
        deepEqual(Seq_1.seq(iter).last, 9, "last failed");
        done();
    });
    it('lastOption', function (done) {
        deepEqual(Seq_1.seq(arr).lastOption.equals(Option_1.some(9)), true, "lastOption failed");
        deepEqual(Seq_1.seq(iter).lastOption.equals(Option_1.some(9)), true, "lastOption failed");
        deepEqual(Seq_1.seq([]).lastOption.equals(Option_1.none()), true, "lastOption failed");
        done();
    });
    it('map', function (done) {
        var a1 = Seq_1.seq([1, 2, 3]);
        deepEqual(a1.map(function (v) { return v * 2; }).toArray, [2, 4, 6], "map failed");
        deepEqual(Seq_1.seq(iter).map(function (v) { return v * 2; }).toArray, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "map failed");
        done();
    });
    it('mkString', function (done) {
        deepEqual(Seq_1.seq(arr).mkString(), "0123456789", "mkString failed");
        deepEqual(Seq_1.seq(iter).mkString(), "0123456789", "mkString failed");
        deepEqual(Seq_1.seq(arr).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(Seq_1.seq(iter).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(Seq_1.seq(arr).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(Seq_1.seq(iter).mkString('[', ',', ']'), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed");
        deepEqual(Seq_1.seq(arr).mkString('[', ',', ']'), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed");
        done();
    });
    it('nonEmpty', function (done) {
        deepEqual(Seq_1.seq(arr).nonEmpty, true, "nonEmpty failed");
        deepEqual(Seq_1.seq([]).nonEmpty, false, "nonEmpty failed");
        deepEqual(Seq_1.seq(iter).nonEmpty, true, "nonEmpty failed");
        done();
    });
    it('reverse', function (done) {
        deepEqual(Seq_1.seq(iter).reverse.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse(), "reverse failed");
        deepEqual(Seq_1.seq(arr).reverse.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse(), "reverse failed");
        done();
    });
    it('slice', function (done) {
        deepEqual(Seq_1.seq(arr).slice(2, 5).toArray, [2, 3, 4], "slice failed");
        deepEqual(Seq_1.seq(arr).slice(12, 15).toArray, [], "slice failed");
        deepEqual(Seq_1.seq(iter).slice(2, 5).toArray, [2, 3, 4], "slice failed");
        done();
    });
    it('size', function (done) {
        deepEqual(Seq_1.seq(arr).size, 10, "size failed");
        deepEqual(Seq_1.seq(iter).size, 10, "size failed");
        done();
    });
    it('sum', function (done) {
        deepEqual(Seq_1.seq(arr).sum, 45, "sum failed");
        deepEqual(Seq_1.seq(iter).sum, 45, "sum failed");
        deepEqual(Seq_1.seq("abcdef").sum, "abcdef", "sum failed");
        done();
    });
    it('tail', function (done) {
        deepEqual(Seq_1.seq(arr).tail.toArray, [1, 2, 3, 4, 5, 6, 7, 8, 9], "tail failed");
        deepEqual(Seq_1.seq(iter).tail.toArray, [1, 2, 3, 4, 5, 6, 7, 8, 9], "tail failed");
        done();
    });
    it('take', function (done) {
        deepEqual(Seq_1.seq(arr).take(3).toArray, [0, 1, 2], "take failed");
        deepEqual(Seq_1.seq(iter).take(3).toArray, [0, 1, 2], "take failed");
        done();
    });
    it('toIndexed', function (done) {
        deepEqual(Seq_1.seq(arr).toIndexed.isIndexed, true, "toIndexed failed");
        deepEqual(Seq_1.seq(iter).toIndexed.isIndexed, true, "toIndexed failed");
        deepEqual(Seq_1.seq("abcdef").toIndexed.isIndexed, true, "toIndexed failed");
        done();
    });
    it('toString', function (done) {
        deepEqual(Seq_1.seq(arr).toString, "0123456789", "toString failed");
        deepEqual(Seq_1.seq(iter).toString, "0123456789", "toString failed");
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
            return value > 3;
        };
        count = 0;
        Seq_1.seq(arr).filter(f).take(3).toArray;
        deepEqual(count, 7, "lazy failed");
        count = 0;
        var head = Seq_1.seq(arr).filter(f).head;
        deepEqual(count, 5, "lazy failed");
        deepEqual(head, 4, "lazy failed");
        count = 0;
        Seq_1.seq(iter).filter(f).take(3).toArray;
        deepEqual(count, 7, "lazy failed");
        count = 0;
        head = Seq_1.seq(iter).filter(f).head;
        deepEqual(count, 5, "lazy failed");
        deepEqual(head, 4, "lazy failed");
        done();
    });
    it('should build from a list', function (done) {
        deepEqual(Seq_1.seq(1, 2, 3).toArray, [1, 2, 3], "seq from list failed");
        done();
    });
    it('should build from a string', function (done) {
        deepEqual(Seq_1.seq("abcd").toArray, ['a', 'b', 'c', 'd'], "seq from string failed");
        done();
    });
});
var _a;
//# sourceMappingURL=Seq.test.js.map