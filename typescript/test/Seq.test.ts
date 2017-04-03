/**
 * Author: Bruno Grieder
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import {Iterable, Iterator} from '../Iter'
import {seq} from '../Seq'
import {none, option, some} from '../Option'


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;

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

describe( 'Seq', function () {

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
        deepEqual( a1.collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [ 4, 8, 12 ], "collect failed" )
        deepEqual( seq<number>( iter ).collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [ 0, 4, 8, 12, 16 ], "collect failed" )
        done()
    } )

    it( 'collectFirst', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).collectFirst( x => x === 3 )( x => x * 2 ).equals( some( 6 ) ), true, "collectFirst failed" )
        deepEqual( seq<number>( arr ).collectFirst( x => x === 13 )( x => x * 2 ).equals( none() ), true, "collectFirst failed" )
        deepEqual( seq<number>( iter ).collectFirst( x => x === 3 )( x => x * 2 ).equals( some( 6 ) ), true, "collectFirst failed" )
        deepEqual( seq<number>( iter ).collectFirst( x => x === 13 )( x => x * 2 ).equals( none() ), true, "collectFirst failed" )
        done()
    } )

    it( 'concat', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        const a2 = seq( [ 4, 5, 6 ] )
        const a3 = a1.concat( a2 )
        deepEqual( a3.toArray, [ 1, 2, 3, 4, 5, 6 ], "concat failed" )
        deepEqual( seq<number>( iter ).concat( seq<number>( iter ) ).toArray, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "concat failed" )
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

    it( 'drop', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).drop( 3 ).head, 3, "drop failed" )
        deepEqual( seq<number>( arr ).drop( 3 ).size, 7, "drop failed" )
        deepEqual( seq<number>( arr ).drop( 50 ).size, 0, "drop failed" )
        deepEqual( seq<number>( iter ).drop( 3 ).head, 3, "drop failed" )
        deepEqual( seq<number>( iter ).drop( 3 ).size, 7, "drop failed" )
        deepEqual( seq<number>( iter ).drop( 50 ).size, 0, "drop failed" )
        done()
    } )

    it( 'dropWhile', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).dropWhile( w => w < 3 ).head, 3, "dropWhile failed" )
        deepEqual( seq<number>( arr ).dropWhile( w => w < 3 ).size, 7, "dropWhile failed" )
        deepEqual( seq<number>( arr ).dropWhile( w => w < 50 ).size, 0, "dropWhile failed" )
        deepEqual( seq<number>( iter ).dropWhile( w => w < 3 ).head, 3, "dropWhile failed" )
        deepEqual( seq<number>( iter ).dropWhile( w => w < 3 ).size, 7, "dropWhile failed" )
        deepEqual( seq<number>( iter ).dropWhile( w => w < 50 ).size, 0, "dropWhile failed" )
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
        deepEqual( seq<number>( arr ).filter( v => v % 2 === 0 ).toArray, [ 0, 2, 4, 6, 8 ], "filter failed" )
        deepEqual( seq<number>( iter ).filter( v => v % 2 === 0 ).toArray, [ 0, 2, 4, 6, 8 ], "filter failed" )
        done()
    } )

    it( 'filterNot', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).filterNot( v => v % 2 === 0 ).toArray, [ 1, 3, 5, 7, 9 ], "filterNot failed" )
        deepEqual( seq<number>( iter ).filterNot( v => v % 2 === 0 ).toArray, [ 1, 3, 5, 7, 9 ], "filterNot failed" )
        done()
    } )

    it( 'flatten', ( done: MochaDone ) => {
        const a1 = option( [ option( [ 0, 1 ] ), option( [ 2, 3 ] ), 4, option( [ 5, 6 ] ) ] )
        deepEqual( a1.flatten().toArray, [ 0, 1, 2, 3, 4, 5, 6 ], "flatten failed" )
        deepEqual( seq<number>( [ seq<number>( iter ), seq<number>( iter ) ] ).flatten().toArray, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "flatten failed" )
        done()
    } )

    it( 'flatMap', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        deepEqual( a1.flatMap( ( v: number ) => seq( [ v * 2 ] ) ).toArray, [ 2, 4, 6 ], "flatMap failed" )
        deepEqual( seq<number>( iter ).flatMap( v => seq<number>( [ v * 2 ] ) ).toArray, [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "flatMap failed" )
        done()
    } )

    it( 'find', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).find( x => x === 3 ).equals( some( 3 ) ), true, "find failed" )
        deepEqual( seq<number>( arr ).find( x => x === 13 ).equals( none() ), true, "find failed" )
        deepEqual( seq<number>( iter ).find( x => x === 3 ).equals( some( 3 ) ), true, "find failed" )
        deepEqual( seq<number>( iter ).find( x => x === 13 ).equals( none() ), true, "find failed" )
        done()
    } )

    it( 'foldLeft', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).foldLeft( 1 )( ( acc, v ) => acc + v ), 46, "foldLeft failed" )
        deepEqual( seq<number>( iter ).foldLeft( 1 )( ( acc, v ) => acc + v ), 46, "foldLeft failed" )
        done()
    } )

    it( 'foldRight', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).foldRight( 1 )( ( acc, v ) => acc + v ), 46, "foldRight failed" )
        deepEqual( seq<number>( iter ).foldRight( 1 )( ( acc, v ) => acc + v ), 46, "foldRight failed" )
        done()
    } )

    it( 'forall', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).forall( v => v < 50 ), true, "forall failed" )
        deepEqual( seq<number>( arr ).forall( v => v < 3 ), false, "forall failed" )
        deepEqual( seq<number>( iter ).forall( v => v < 50 ), true, "forall failed" )
        deepEqual( seq<number>( iter ).forall( v => v < 3 ), false, "forall failed" )
        done()
    } )

    it( 'foreach', ( done: MochaDone ) => {

        let count = 0
        const f = ( value: number ): void => {
            count = count + value
        }

        count = 0
        seq<number>( arr ).foreach( f )
        deepEqual( count, 45, "foreach failed" )

        count = 0
        seq<number>( iter ).foreach( f )
        deepEqual( count, 45, "foreach failed" )
        done()
    } )

    it( 'hasDefiniteSize', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).hasDefiniteSize, true, "hasDefiniteSize failed" )
        deepEqual( seq<number>( iter ).hasDefiniteSize, false, "hasDefiniteSize failed" )
        done()
    } )

    it( 'head', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).head, 0, "head failed" )
        deepEqual( seq<number>( iter ).head, 0, "head failed" )
        done()
    } )

    it( 'headOption', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).headOption.equals( some( 0 ) ), true, "headOption failed" )
        deepEqual( seq<number>( iter ).headOption.equals( some( 0 ) ), true, "headOption failed" )
        deepEqual( seq<number>( [] ).headOption.equals( none() ), true, "headOption failed" )
        done()
    } )

    it( 'indexOf', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).indexOf( 2 ), 2, "indexOf failed" )
        deepEqual( seq<number>( arr ).indexOf( 2, 3 ), -1, "indexOf failed" )
        deepEqual( seq<number>( iter ).indexOf( 2 ), 2, "indexOf failed" )
        deepEqual( seq<number>( iter ).indexOf( 2, 3 ), -1, "indexOf failed" )
        done()
    } )

    it( 'isEmpty', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).isEmpty, false, "isEmpty failed" )
        deepEqual( seq<number>( [] ).isEmpty, true, "isEmpty failed" )
        deepEqual( seq<number>( iter ).isEmpty, false, "isEmpty failed" )
        done()
    } )

    it( 'isIndexed', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).isIndexed, true, "isIndexed failed" )
        deepEqual( seq<number>( iter ).isIndexed, false, "isIndexed failed" )
        deepEqual( seq<string>( "abcdef" ).isIndexed, true, "isIndexed failed" )
        done()
    } )

    it( 'length', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).length, 10, "length failed" )
        deepEqual( seq<number>( iter ).length, 10, "length failed" )
        done()
    } )

    it( 'last', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).last, 9, "last failed" )
        deepEqual( seq<number>( iter ).last, 9, "last failed" )
        done()
    } )

    it( 'lastOption', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).lastOption.equals( some( 9 ) ), true, "lastOption failed" )
        deepEqual( seq<number>( iter ).lastOption.equals( some( 9 ) ), true, "lastOption failed" )
        deepEqual( seq<number>( [] ).lastOption.equals( none() ), true, "lastOption failed" )
        done()
    } )

    it( 'map', ( done: MochaDone ) => {
        const a1 = seq<number>( [ 1, 2, 3 ] )
        deepEqual( a1.map( v => v * 2 ).toArray, [ 2, 4, 6 ], "map failed" )
        deepEqual( seq<number>( iter ).map( v => v * 2 ).toArray, [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ], "map failed" )
        done()
    } )

    it( 'mkString', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).mkString(), "0123456789", "mkString failed" )
        deepEqual( seq<number>( iter ).mkString(), "0123456789", "mkString failed" )
        deepEqual( seq<number>( arr ).mkString( ',' ), "0,1,2,3,4,5,6,7,8,9", "mkString failed" )
        deepEqual( seq<number>( iter ).mkString( ',' ), "0,1,2,3,4,5,6,7,8,9", "mkString failed" )
        deepEqual( seq<number>( arr ).mkString( ',' ), "0,1,2,3,4,5,6,7,8,9", "mkString failed" )
        deepEqual( seq<number>( iter ).mkString( '[', ',', ']' ), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed" )
        deepEqual( seq<number>( arr ).mkString( '[', ',', ']' ), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed" )
        done()
    } )

    it( 'nonEmpty', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).nonEmpty, true, "nonEmpty failed" )
        deepEqual( seq<number>( [] ).nonEmpty, false, "nonEmpty failed" )
        deepEqual( seq<number>( iter ).nonEmpty, true, "nonEmpty failed" )
        done()
    } )


    it( 'reverse', ( done: MochaDone ) => {
        deepEqual( seq<number>( iter ).reverse.toArray, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].reverse(), "reverse failed" )
        deepEqual( seq<number>( arr ).reverse.toArray, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].reverse(), "reverse failed" )
        done()
    } )

    it( 'slice', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).slice( 2, 5 ).toArray, [ 2, 3, 4 ], "slice failed" )
        deepEqual( seq<number>( arr ).slice( 12, 15 ).toArray, [ ], "slice failed" )
        deepEqual( seq<number>( iter ).slice( 2, 5 ).toArray, [ 2, 3, 4 ], "slice failed" )
        done()
    } )

    it( 'size', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).size, 10, "size failed" )
        deepEqual( seq<number>( iter ).size, 10, "size failed" )
        done()
    } )

    it( 'sum', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).sum, 45, "sum failed" )
        deepEqual( seq<number>( iter ).sum, 45, "sum failed" )
        deepEqual( seq<string>( "abcdef" ).sum, "abcdef", "sum failed" )
        done()
    } )

    it( 'tail', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).tail.toArray, [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "tail failed" )
        deepEqual( seq<number>( iter ).tail.toArray, [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "tail failed" )
        done()
    } )

    it( 'take', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).take( 3 ).toArray, [ 0, 1, 2 ], "take failed" )
        deepEqual( seq<number>( iter ).take( 3 ).toArray, [ 0, 1, 2 ], "take failed" )
        done()
    } )

    it( 'toIndexed', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).toIndexed.isIndexed, true, "toIndexed failed" )
        deepEqual( seq<number>( iter ).toIndexed.isIndexed, true, "toIndexed failed" )
        deepEqual( seq<string>( "abcdef" ).toIndexed.isIndexed, true, "toIndexed failed" )
        done()
    } )

    it( 'toString', ( done: MochaDone ) => {
        deepEqual( seq<number>( arr ).toString, "0123456789", "toString failed" )
        deepEqual( seq<number>( iter ).toString, "0123456789", "toString failed" )
        done()
    } )

    it( 'should be a monad', ( done: MochaDone ) => {
        //Monad Laws
        const f = ( x: number ) => seq( [ x * x ] );
        const g = ( x: number ) => seq( [ x + 2 ] );
        deepEqual( seq( [ 3 ] ).flatMap( f ).toArray, f( 3 ).toArray, "1st Monad Law" )
        deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => seq( [ x ] ) ).toArray, seq( [ 1, 2, 3 ] ).toArray, "2nd Monad Law" )
        deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => f( x ).flatMap( g ) ).toArray, seq( [ 1, 2, 3 ] ).flatMap( f ).flatMap( g ).toArray, "3rd Monad Law" )
        done()
    } )

    it( 'should be lazy', ( done: MochaDone ) => {

        let count = 0
        const f = ( value: number ): boolean => {
            count = count + 1
            return value > 3
        }

        count = 0
        seq<number>( arr ).filter( f ).take( 3 ).toArray
        deepEqual( count, 7, "lazy failed" )

        count = 0
        let head = seq<number>( arr ).filter( f ).head
        deepEqual( count, 5, "lazy failed" )
        deepEqual( head, 4, "lazy failed" )

        count = 0
        seq<number>( iter ).filter( f ).take( 3 ).toArray
        deepEqual( count, 7, "lazy failed" )

        count = 0
        head = seq<number>( iter ).filter( f ).head
        deepEqual( count, 5, "lazy failed" )
        deepEqual( head, 4, "lazy failed" )

        done()
    } )

    it( 'should build from a list', ( done: MochaDone ) => {
        deepEqual( seq( 1, 2, 3 ).toArray, [ 1, 2, 3 ], "seq from list failed" )
        done()
    } )

    it( 'should build from a string', ( done: MochaDone ) => {
        deepEqual( seq( "abcd" ).toArray, [ 'a', 'b', 'c', 'd' ], "seq from string failed" )
        done()
    } )
} )



