"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Range_1 = require("../Range");
require('source-map-support').install();
var chai = require("chai");
var deepEqual = chai.assert.deepEqual;
describe('Range', function () {
    before(function (done) {
        done();
    });
    after(function (done) {
        done();
    });
    it('range', function (done) {
        deepEqual(Range_1.range(10).toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'range failed');
        deepEqual(Range_1.range(2, 10).toArray, [2, 3, 4, 5, 6, 7, 8, 9], 'range failed');
        deepEqual(Range_1.range(3, 10, 2).toArray, [3, 5, 7, 9], 'range failed');
        done();
    });
});
//# sourceMappingURL=Range.test.js.map