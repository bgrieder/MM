"use strict";
function eq(a, b) {
    if (typeof b === 'object') {
        var feq = b['equals'];
        return (feq && feq.call(b, a)) || (a === b);
    }
    return (a === b);
}
exports.eq = eq;
//# sourceMappingURL=Utils.js.map