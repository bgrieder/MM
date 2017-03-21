/**
 * Author: Bruno Grieder
 * Date:   18/05/2015
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import * as TestsSetup from './TestsSetup'
import {Iterable, iterable, JSIterable, JSIterator} from '../Iterable'


const checkFail = TestsSetup.checkFail;

const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;
// let notDeepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.notDeepEqual;
const ok: ( val: any, msg?: string ) => void = chai.assert.ok;


const getIterator: () => JSIterator<number> = () => {
    let count = -1
    return {
        next: () => {
            count = count + 1
            return {
                done:  count == 10,
                value: count
            }
        }
    }
}

const iter: JSIterable<number> = {
    [Symbol.iterator]: getIterator
}

describe( 'Iterable', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )

    // beforeEach( TestsSetup._beforeEach )
    // afterEach( TestsSetup._afterEach )

    it( 'collect', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable<number>( [ 1, 2, 3, 4, 5, 6 ] )
        deepEqual( a1.collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray(), [ 4, 8, 12 ], "collect failed" )
        deepEqual( iterable<number>( iter ).collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray(), [ 0, 4, 8, 12, 16 ], "collect failed" )
    } ) )

    it( 'concat', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable( [ 1, 2, 3 ] )
        const a2 = iterable( [ 4, 5, 6 ] )
        const a3 = a1.concat( a2 )
        deepEqual( a3.toArray(), [ 1, 2, 3, 4, 5, 6 ], "concat failed" )
        deepEqual( iterable<number>( iter ).concat( iterable<number>( iter ) ).toArray(), [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "concat failed" )
    } ) )

    it( 'equals', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable( [ 1, 2, 3 ] )
        deepEqual( a1.equals( iterable( [ 1, 2, 3 ] ) ), true, "equals failed" )
        deepEqual( a1.equals( iterable( [ 1, 2 ] ) ), false, "equals failed" )
        deepEqual( a1.equals( iterable( [ 1, '2', 3 ] ) ), false, "equals failed" )
        deepEqual( iterable<number>( iter ).equals( iterable<number>( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ) ), true, "equals failed" )
    } ) )

    it( 'filter', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable<number>( [ 1, 2, 3, 4, 5, 6 ] )
        deepEqual( a1.filter( v => v % 2 === 0 ).toArray(), [ 2, 4, 6 ], "filter failed" )
        deepEqual( iterable<number>( iter ).filter( v => v % 2 === 0 ).toArray(), [ 0, 2, 4, 6, 8 ], "filter failed" )
    } ) )

    it( 'flatten', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable( [ iterable( [ 0, 1 ] ), iterable( [ 2, 3 ] ), 4, iterable( [ 5, 6 ] ) ] )
        deepEqual( a1.flatten().toArray(), [ 0, 1, 2, 3, 4, 5, 6 ], "flatten failed" )
        deepEqual( iterable<number>( [ iterable<number>( iter ), iterable<number>( iter ) ] ).flatten().toArray(), [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "flatten failed" )
    } ) )

    it( 'flatMap', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable( [ 1, 2, 3 ] )
        deepEqual( a1.flatMap( ( v: number ) => iterable( [ v * 2 ] ) ).toArray(), [ 2, 4, 6 ], "flatMap failed" )
        deepEqual( iterable<number>( iter ).flatMap( v => iterable<number>( [ v * 2 ] ) ).toArray(), [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "flatMap failed" )
    } ) )

    it( 'map', ( done: MochaDone ) => checkFail( done, () => {
        const a1 = iterable<number>( [ 1, 2, 3 ] )
        deepEqual( a1.map( v => v * 2 ).toArray(), [ 2, 4, 6 ], "map failed" )
        deepEqual( iterable<number>( iter ).map( v => v * 2 ).toArray(), [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "map failed" )
    } ) )

    it( 'should be a monad', ( done: MochaDone ) => checkFail( done, () => {
        //Monad Laws
        const f = ( x: number ) => iterable( [ x * x ] );
        const g = ( x: number ) => iterable( [ x + 2 ] );
        deepEqual( iterable( [ 3 ] ).flatMap( f ).toArray(), f( 3 ).toArray(), "1st Monad Law" )
        deepEqual( iterable( [ 1, 2, 3 ] ).flatMap( ( x: number ) => iterable( [ x ] ) ).toArray(), iterable( [ 1, 2, 3 ] ).toArray(), "2nd Monad Law" )
        deepEqual( iterable( [ 1, 2, 3 ] ).flatMap( ( x: number ) => f( x ).flatMap( g ) ).toArray(), iterable( [ 1, 2, 3 ] ).flatMap( f ).flatMap( g ).toArray(), "3rd Monad Law" )
    } ) )

} )



