"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
function _beforeEach() {
    console.log('\n\nTEST start >>>>>>>>> ' + this['currentTest'].fullTitle());
}
exports._beforeEach = _beforeEach;
function _afterEach() {
    if (this['currentTest'].state === 'failed') {
        console.error('TEST FAILED <<<<<<<<< ' + this['currentTest'].fullTitle() + ': ' + this['currentTest'].err.message + '\n');
    }
    else {
        console.log('TEST OK <<<<<<<<< ' + this['currentTest'].fullTitle() + '\n');
    }
}
exports._afterEach = _afterEach;
function checkFail(done, asserts) {
    try {
        asserts();
        done();
    }
    catch (e) {
        console.error('TEST ERROR> ' + e.message, e);
        done(e);
    }
}
exports.checkFail = checkFail;
//# sourceMappingURL=TestsSetup.js.map