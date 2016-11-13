"use strict";
require('source-map-support').install();
var chai = require("chai");
var TestsSetup = require("./TestsSetup");
var ListImpl_1 = require("../impl/ListImpl");
var checkFail = TestsSetup.checkFail;
var deepEqual = chai.assert.deepEqual;
var ok = chai.assert.ok;
var OptionImpl_1 = require("../impl/OptionImpl");
describe('Option', function () {
    before(function (done) {
        done();
    });
    after(function (done) {
        done();
    });
    beforeEach(TestsSetup._beforeEach);
    afterEach(TestsSetup._afterEach);
    it('should take multiple constructors', function (done) { return checkFail(done, function () {
        var n = OptionImpl_1.none();
        ok(n.isEmpty(), "None is not empty");
        try {
            n.get();
            done(new Error("None has a val"));
        }
        catch (e) {
        }
        deepEqual(OptionImpl_1.some().get(), undefined, "empty Some can be constructed");
        deepEqual(OptionImpl_1.some(1).get(), 1, "Some can be constructed from a single value");
        deepEqual(OptionImpl_1.some(OptionImpl_1.some(1)).get().get(), 1, "Some can contain other Some");
    }); });
    it('should honor the Option interface', function (done) { return checkFail(done, function () {
        deepEqual(OptionImpl_1.some(2).map(function (x) { return x * x; }).get(), 4, "Some should map");
        ok(OptionImpl_1.none().map(function (x) { return x * x; }).isEmpty(), "None should not map");
        deepEqual(OptionImpl_1.some(OptionImpl_1.some(1)).flatten().get(), 1, "some of some should be flattened");
        deepEqual(OptionImpl_1.some(OptionImpl_1.none()).flatten().getOrElse(function () { return 3; }), 3, "some of none should be flattened to an empty some");
        deepEqual(OptionImpl_1.some(1).flatten().get(), 1, "some of non iterable values should not be flattened");
        deepEqual(OptionImpl_1.some(1).getOrElse(function () { return 2; }), 1, "getOrElse should get on some");
        deepEqual(OptionImpl_1.none().getOrElse(function () { return 2; }), 2, "getOrElse should else on none");
        deepEqual(OptionImpl_1.some(1).getOrNull(), 1, "getOrNull should get on some");
        deepEqual(OptionImpl_1.none().getOrNull(), null, "getOrNull should return Null on none");
        deepEqual(OptionImpl_1.some(1).getOrUndefined(), 1, "getOrUndefined should get on some");
        deepEqual(OptionImpl_1.none().getOrUndefined(), undefined, "getOrUndefined should return undefined on none");
        deepEqual(OptionImpl_1.some(1).map(function (x) { return x * 3; }).get(), 3, "map should work on some");
        ok(OptionImpl_1.none().map(function (x) { return x * 3; }).isEmpty(), "map should not act on None");
        deepEqual(OptionImpl_1.some(1).fold(function () { return 3; }, function (x) { return x * 3; }), 3, "fold should work on some");
        deepEqual(OptionImpl_1.none().fold(function () { return 5; }, function (x) { return x * 3; }), 5, "fold should work on none");
        deepEqual(OptionImpl_1.some(1).flatMap(function (x) { return OptionImpl_1.some(x * 3); }).get(), 3, "flatMap should work on some");
        ok(OptionImpl_1.none().flatMap(function (x) { return OptionImpl_1.some(x * 3); }).isEmpty(), "flatMap should not act on None");
        deepEqual(OptionImpl_1.some(OptionImpl_1.some(3)).flatten().get(), 3, "flatten should work on some");
        ok(OptionImpl_1.none().flatten().isEmpty(), "flatten should not act on None");
        deepEqual(OptionImpl_1.some(3).filter(function (x) { return x === 3; }).get(), 3, "filter should work on some");
        deepEqual(OptionImpl_1.some(1).filter(function (x) { return x === 3; }).getOrElse(function () { return 3; }), 3, "filter should work on some");
        ok(OptionImpl_1.none().filter(function (x) { return (x === 3); }).isEmpty(), "filter should not act on None");
        deepEqual(OptionImpl_1.some(3).filterNot(function (x) { return (x !== 3); }).get(), 3, "filterNot should work on some");
        deepEqual(OptionImpl_1.some(1).filterNot(function (x) { return (x === 1); }).getOrElse(function () { return 3; }), 3, "filterNot should work on some");
        ok(OptionImpl_1.none().filterNot(function (x) { return (x === 3); }).isEmpty(), "filterNot should not act on None");
        ok(OptionImpl_1.some(3).exists(function (x) { return (x === 3); }), "exist should work on some");
        ok(!OptionImpl_1.some(1).exists(function (x) { return (x === 3); }), "exist should work on some");
        ok(!OptionImpl_1.none().exists(function (x) { return (x === 3); }), "exist should not act on None");
        ok(OptionImpl_1.some(3).forAll(function (x) { return (x === 3); }), "forAll should work on some");
        ok(!OptionImpl_1.some(1).exists(function (x) { return (x === 3); }), "forAll should work on some");
        ok(OptionImpl_1.none().forAll(function (x) { return (x === 3); }), "forAll should return true on None");
        var isRun = false;
        OptionImpl_1.some(1).forEach(function (x) { return isRun = (x === 1); });
        ok(isRun, "forEach should run on Some");
        isRun = false;
        OptionImpl_1.none().forEach(function (x) { return isRun = true; });
        ok(!isRun, "forEach should not act on None");
        deepEqual(OptionImpl_1.some(1).collect({ someFn: function (x) { return x * 3; } }).get(), 3, "collect should work on some");
        ok(OptionImpl_1.some(1).collect({}).isEmpty(), "collect should work on some");
        ok(OptionImpl_1.none().map(function (x) { return x * 3; }).isEmpty(), "collect should not act on None");
        deepEqual(OptionImpl_1.some(1).orElse(function () { return OptionImpl_1.some(5); }).get(), 1, "orElse should work on some");
        deepEqual(OptionImpl_1.none().orElse(function () { return OptionImpl_1.some(5); }).get(), 5, "orElse should work on nome");
    }); });
    it('should work lazily', function (done) { return checkFail(done, function () {
        var l = OptionImpl_1.some(OptionImpl_1.some(3));
        var mapRun = 0;
        var filterRun = 0;
        var isOdd = function (x) {
            filterRun += 1;
            console.log("filtering " + x + ": " + (x % 2));
            return x % 2 !== 0;
        };
        var square = function (x) {
            mapRun += 1;
            console.log("squaring X");
            return x * x;
        };
        var lazyRes = l.flatten().filter(isOdd).map(square);
        deepEqual(filterRun, 0, "filter should not have run");
        deepEqual(mapRun, 0, "map should not have run");
        var res = lazyRes.get();
        deepEqual(res, 9, "should calculate the correct result");
        deepEqual(filterRun, 1, "filter should have run");
        deepEqual(mapRun, 1, "should have run");
    }); });
    it('should behave like a gentle Monad', function (done) { return checkFail(done, function () {
        var f = function (x) { return OptionImpl_1.some(x * x); };
        var g = function (x) { return OptionImpl_1.some(x + 2); };
        deepEqual(OptionImpl_1.some(3).flatMap(f).get(), f(3).get(), "1st Monad Law");
        deepEqual(OptionImpl_1.some(3).flatMap(OptionImpl_1.some).get(), OptionImpl_1.some(3).get(), "2nd Monad Law");
        deepEqual(OptionImpl_1.some(3).flatMap(function (x) { return f(x).flatMap(g); }).get(), OptionImpl_1.some(3).flatMap(f).flatMap(g).get(), "3rd Monad Law");
        deepEqual(OptionImpl_1.some(ListImpl_1.list(1, 2, 2)).flatten().get(), 1, "Some List of vals should be flattened to a a Some of the first val of the List");
    }); });
});
//# sourceMappingURL=Option.test.js.map