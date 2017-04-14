/**
 * Author: Bruno Grieder
 */
import {range, Range} from '../Range'

require( 'source-map-support' ).install()
import chai = require('chai')


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;


describe( 'Range', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )

    it( 'range', ( done: MochaDone ) => {
        deepEqual( range( 10 ).toArray, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], 'range failed' )
        deepEqual( range( 2, 10 ).toArray, [ 2, 3, 4, 5, 6, 7, 8, 9 ], 'range failed' )
        deepEqual( range( 3, 10, 2 ).toArray, [ 3, 5, 7, 9 ], 'range failed' )
        done()
    } )

} )



