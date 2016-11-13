/**
 * Author: Bruno Grieder
 * Date:   18/04/2014
 * Time:   15:04
 */

require( 'source-map-support' ).install()

//var mso: MochaSetupOptions = {
//
//    ui:          'bdd',
//    timeout:     10000,
//    slow:        2500,
//    ignoreLeaks: false
//}
//mocha.setup( mso )


export function _beforeEach(): void {
    console.log( '\n\nTEST start >>>>>>>>> ' + this[ 'currentTest' ].fullTitle() )
}

export function _afterEach(): void {
    if ( this[ 'currentTest' ].state === 'failed' ) {
        console.error( 'TEST FAILED <<<<<<<<< ' + this[ 'currentTest' ].fullTitle() + ': ' + this[ 'currentTest' ].err.message + '\n' )
    }
    else {
        console.log( 'TEST OK <<<<<<<<< ' + this[ 'currentTest' ].fullTitle() + '\n' )
    }
}

export function checkFail( done: MochaDone, asserts: ()=>void ) {

    try {
        asserts()
        done()
    }
    catch ( e ) {
        console.error( 'TEST ERROR> ' + e.message, e );
        done( e )
    }
}
