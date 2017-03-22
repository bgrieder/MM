/**
 * Created by Bruno Grieder.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test is two values are equals by first checking id they implement an `equals` methods
 * otherwise test using `===`
 */
function eq(a, b) {
    if (typeof b === 'object') {
        var feq = b['equals'];
        return (feq && feq.call(b, a)) || (a === b);
    }
    return (a === b);
}
exports.eq = eq;
