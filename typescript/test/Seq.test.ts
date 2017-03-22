/**
 * Author: Bruno Grieder
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import {Seq, seq, Iterable, Iterator} from '../Seq'


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;
// let notDeepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.notDeepEqual;
// const ok: ( val: any, msg?: string ) => void = chai.assert.ok;


const iter: Iterable<number> = {
    [Symbol.iterator]: (): Iterator<number> => {
        let count = -1
        //noinspection JSUnusedGlobalSymbols
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
}
const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

describe( 'Iterable', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )

    // beforeEach( TestsSetup._beforeEach )
    // afterEach( TestsSetup._afterEach )

    it( 'collect', ( done: MochaDone ) => {
        const a1 = seq<number>( [ 1, 2, 3, 4, 5, 6 ] )
        deepEqual( a1.collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray(), [ 4, 8, 12 ], "collect failed" )
        deepEqual( seq<number>( iter ).collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray(), [ 0, 4, 8, 12, 16 ], "collect failed" )
        done()
    } )

    it( 'concat', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        const a2 = seq( [ 4, 5, 6 ] )
        const a3 = a1.concat( a2 )
        deepEqual( a3.toArray(), [ 1, 2, 3, 4, 5, 6 ], "concat failed" )
        deepEqual( seq<number>( iter ).concat( seq<number>( iter ) ).toArray(), [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "concat failed" )
        done()
    } )

    it( 'contains', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).contains( 2 ), true, "contains failed" )
        deepEqual( seq<number>( arr ).contains( 10 ), false, "contains failed" )
        deepEqual( seq<number>( iter ).contains( 2 ), true, "contains failed" )
        deepEqual( seq<number>( iter ).contains( 10 ), false, "contains failed" )
        done()
    } )

    it( 'count', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).count( v => v % 2 === 0 ), 5, "count failed" )
        deepEqual( seq<number>( iter ).count( v => v % 2 === 0 ), 5, "count failed" )
        done()
    } )

    it( 'equals', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        deepEqual( a1.equals( seq( [ 1, 2, 3 ] ) ), true, "equals failed" )
        deepEqual( a1.equals( seq( [ 1, 2 ] ) ), false, "equals failed" )
        deepEqual( a1.equals( seq( [ 1, '2', 3 ] ) ), false, "equals failed" )
        deepEqual( seq<number>( iter ).equals( seq<number>( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ) ), true, "equals failed" )
        done()
    } )

    it( 'exists', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).exists( v => v === 3 ), true, "exists failed" )
        deepEqual( seq<number>( arr ).exists( v => v === 10 ), false, "exists failed" )
        deepEqual( seq<number>( iter ).exists( v => v === 3 ), true, "exists failed" )
        deepEqual( seq<number>( iter ).exists( v => v === 10 ), false, "exists failed" )
        done()
    } )

    it( 'filter', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).filter( v => v % 2 === 0 ).toArray(), [ 0, 2, 4, 6, 8 ], "filter failed" )
        deepEqual( seq<number>( iter ).filter( v => v % 2 === 0 ).toArray(), [ 0, 2, 4, 6, 8 ], "filter failed" )
        done()
    } )

    it( 'filterNot', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).filterNot( v => v % 2 === 0 ).toArray(), [ 1, 3, 5, 7, 9 ], "filterNot failed" )
        deepEqual( seq<number>( iter ).filterNot( v => v % 2 === 0 ).toArray(), [ 1, 3, 5, 7, 9 ], "filterNot failed" )
        done()
    } )

    it( 'flatten', ( done: MochaDone ) => {
        const a1 = seq( [ seq( [ 0, 1 ] ), seq( [ 2, 3 ] ), 4, seq( [ 5, 6 ] ) ] )
        deepEqual( a1.flatten().toArray(), [ 0, 1, 2, 3, 4, 5, 6 ], "flatten failed" )
        deepEqual( seq<number>( [ seq<number>( iter ), seq<number>( iter ) ] ).flatten().toArray(), [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "flatten failed" )
        done()
    } )

    it( 'flatMap', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        deepEqual( a1.flatMap( ( v: number ) => seq( [ v * 2 ] ) ).toArray(), [ 2, 4, 6 ], "flatMap failed" )
        deepEqual( seq<number>( iter ).flatMap( v => seq<number>( [ v * 2 ] ) ).toArray(), [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "flatMap failed" )
        done()
    } )

    it( 'map', ( done: MochaDone ) => {
        const a1 = seq<number>( [ 1, 2, 3 ] )
        deepEqual( a1.map( v => v * 2 ).toArray(), [ 2, 4, 6 ], "map failed" )
        deepEqual( seq<number>( iter ).map( v => v * 2 ).toArray(), [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "map failed" )
        done()
    } )

    it( 'size', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).size, 10, "size failed" )
        deepEqual( seq<number>( iter ).size, 10, "size failed" )
        done()
    } )

    it( 'take', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).take( 3 ).toArray(), [ 0, 1, 2 ], "take failed" )
        deepEqual( seq<number>( iter ).take( 3 ).toArray(), [ 0, 1, 2 ], "take failed" )
        done()
    } )

    it( 'should be a monad', ( done: MochaDone ) => {
        //Monad Laws
        const f = ( x: number ) => seq( [ x * x ] );
        const g = ( x: number ) => seq( [ x + 2 ] );
        deepEqual( seq( [ 3 ] ).flatMap( f ).toArray(), f( 3 ).toArray(), "1st Monad Law" )
        deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => seq( [ x ] ) ).toArray(), seq( [ 1, 2, 3 ] ).toArray(), "2nd Monad Law" )
        deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => f( x ).flatMap( g ) ).toArray(), seq( [ 1, 2, 3 ] ).flatMap( f ).flatMap( g ).toArray(), "3rd Monad Law" )
        done()
    } )

    it( 'should be lazy', ( done: MochaDone ) => {

        let count = 0
        const f = ( /*value: number*/ ): boolean => {
            count = count + 1
            return true
        }

        seq<number>( arr ).filter( f ).take( 3 ).toArray()
        deepEqual( count, 3, "lazy failed" )

        count = 0
        seq<number>( iter ).filter( f ).take( 3 ).toArray()
        deepEqual( count, 3, "lazy failed" )

        done()
    } )

} )



