/**
 * Author: Bruno Grieder
 */

require( 'source-map-support' ).install()
import * as chai from 'chai'
import {checkFail, _beforeEach, _afterEach} from './TestsSetup'
import {iterable} from '../impl/IterableImpl'
import {iterator} from '../impl/IteratorImpl'

import {Seq} from '../API/Seq'
import {fseq, aseq} from '../impl/SeqImpl'


//var checkFail = TestsSetup.checkFail

const deepEqual: ( act: any, exp: any, msg?: string ) =>void = chai.assert.deepEqual;
const ok: ( val: any, msg?: string ) => void = chai.assert.ok;




describe( 'Seq', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )


    beforeEach( _beforeEach )
    afterEach( _afterEach )


    it( 'should take multiple constructors', ( done: MochaDone ) => checkFail( done, () => {

        deepEqual( aseq().toArray(), [], "empty seq (mzero) can be constructed" )
        deepEqual( aseq().reverse().toArray(), [], "empty seq (mzero) can be constructed" )
        deepEqual( aseq( 1 ).toArray(), [ 1 ], "seq can be constructed from a single value" )
        deepEqual( aseq( 1, 2, 3 ).toArray(), [ 1, 2, 3 ], "seq can be constructed from multiple values" )
        deepEqual( aseq( 1, 2, 3 ).reverse().toArray(), [ 1, 2, 3 ].reverse(), "seq can be constructed from multiple values and read backwards" )
        deepEqual( aseq( aseq( 1, 2, 3 ) ).toArray()[ 0 ].toArray(), [ 1, 2, 3 ], "seq can contain other seqs" )


    } ) )


    it( 'should honor the Seq interface', ( done: MochaDone ) => checkFail( done, () => {

        //size
        deepEqual( aseq().size(), 0, "seq should have size 0" )
        deepEqual( aseq( 1, 2, 3 ).size(), 3, "seq should have size 3" )

        //map
        deepEqual( aseq( 1, 2, 3 ).map( ( x ) => x * x ).toArray(), [ 1, 4, 9 ], "seq should map" )
        deepEqual( aseq( 1, 2, 3 ).map( ( x ) => x * x ).reverse().toArray(), [ 1, 4, 9 ].reverse(), "seq should map" )

        //flatten
        deepEqual( aseq( aseq( 1, 2 ), aseq( 2, 3 ) ).flatten().toArray(), [ 1, 2, 2, 3 ], "seq of seq should be flattened" )
        deepEqual( aseq( aseq( 1, 2 ), aseq( 2, 3 ) ).flatten().reverse().toArray(), [ 1, 2, 2, 3 ].reverse(), "seq of seq should be flattened" )
        deepEqual( aseq( 1, 2, 3 ).flatten().toArray(), [ 1, 2, 3 ], "seq of non convertible values should not be flattened" )

        //flatMap
        deepEqual( aseq( 1, 2, 3 ).flatMap( ( x ) => aseq( 0, x * x ) ).toArray(), [ 0, 1, 0, 4, 0, 9 ], "seq should map" )
        deepEqual( aseq( 1, 2, 3 ).flatMap( ( x ) => aseq( 0, x * x ) ).reverse().toArray(), [ 0, 1, 0, 4, 0, 9 ].reverse(), "seq should map" )

        //filter
        deepEqual( aseq( 1, 2, 3, 4, 5 ).filter( ( x ) => x % 2 == 0 ).toArray(), [ 2, 4 ], "seq should filter" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).filter( ( x ) => x % 2 == 0 ).reverse().toArray(), [ 2, 4 ].reverse(), "seq should filter" )

        //filterNot
        deepEqual( aseq( 1, 2, 3, 4, 5 ).filterNot( ( x ) => x % 2 == 0 ).toArray(), [ 1, 3, 5 ], "filterNot should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).filterNot( ( x ) => x % 2 == 0 ).reverse().toArray(), [ 1, 3, 5 ].reverse(), "filterNot should work" )

        //take
        deepEqual( aseq( 1, 2, 3, 4, 5 ).takeFirst( 3 ).toArray(), [ 1, 2, 3 ], "take should take what is required" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).takeFirst( 3 ).reverse().toArray(), [ 3, 2, 1 ], "take should take what is required" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).reverse().takeFirst( 3 ).toArray(), [ 5, 4, 3 ], "take should take what is required" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).takeLast( 3 ).toArray(), [ 3, 4, 5 ], "take should take what is required" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).takeLast( 3 ).reverse().toArray(), [ 5, 4, 3 ], "take should take what is required" )
        deepEqual( aseq( 1, 2, 3, 4, 5 ).reverse().takeLast( 3 ).toArray(), [ 3, 2, 1 ], "take should take what is required" )


        //concat
        deepEqual( aseq( 1, 2, 3 ).map( x => 2 * x ).concat( aseq( 4, 5, 6 ).map( x => 3 * x ) ).toArray(), [ 2, 4, 6, 12, 15, 18 ], "seq should concat(enate)" )
        deepEqual( aseq( 1, 2, 3 ).map( x => 2 * x ).concat( aseq( 4, 5, 6 ).map( x => 3 * x ) ).reverse().toArray(), [ 2, 4, 6, 12, 15, 18 ].reverse(), "seq should concat(enate)" )

        //prepend
        deepEqual( aseq( 1, 2, 3 ).prepend( 0 ).toArray(), [ 0, 1, 2, 3 ], "elements can prepended" )
        deepEqual( aseq( 1, 2, 3 ).prepend( 0 ).reverse().toArray(), [ 0, 1, 2, 3 ].reverse(), "elements can prepended" )

        //append
        deepEqual( aseq( 1, 2, 3 ).append( 4 ).toArray(), [ 1, 2, 3, 4 ], "elements can appended" )
        deepEqual( aseq( 1, 2, 3 ).append( 4 ).reverse().toArray(), [ 1, 2, 3, 4 ].reverse(), "elements can appended" )

        //push
        deepEqual( aseq( 1, 2, 3 ).push( 4 ).toArray(), [ 1, 2, 3, 4 ], "elements can pushed" )
        deepEqual( aseq( 1, 2, 3 ).push( 4 ).reverse().toArray(), [ 1, 2, 3, 4 ].reverse(), "elements can pushed" )

        //takeAt/apply
        deepEqual( aseq( 1, 2, 3 ).takeAt( 2 ), 3, "elements can be retrieved" )
        deepEqual( aseq( 1, 2, 3 ).reverse().takeAt( 2 ), 1, "elements can be retrieved" )
        deepEqual( aseq( 1, 2, 3 ).apply( 0 ), 1, "elements can be retrieved" )
        deepEqual( aseq( 1, 2, 3 ).reverse().apply( 2 ), 1, "elements can be retrieved" )

        //takeAtOrElse/applyOrElse
        deepEqual( aseq( 1, 2, 3 ).takeAtOrElse( 2, () => 0 ), 3, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).reverse().takeAtOrElse( 2, () => 0 ), 1, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).takeAtOrElse( 4, () => 0 ), 0, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).reverse().takeAtOrElse( 4, () => 0 ), 0, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).applyOrElse( 2, () => 0 ), 3, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).reverse().applyOrElse( 2, () => 0 ), 1, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).applyOrElse( 4, () => 0 ), 0, "elements can be retrieved with getAtr" )
        deepEqual( aseq( 1, 2, 3 ).reverse().applyOrElse( 4, () => 0 ), 0, "elements can be retrieved with getAtr" )

        //contains
        deepEqual( aseq( 1, 2, 3 ).contains( 3 ), true, "contains should work" )
        deepEqual( aseq( 1, 2, 3 ).contains( 4 ), false, "contains should work" )
        deepEqual( aseq( 1, 2, 3 ).reverse().contains( 3 ), true, "contains should work" )
        deepEqual( aseq( 1, 2, 3 ).reverse().contains( 4 ), false, "contains should work" )


        //indexOf
        deepEqual( aseq( 1, 2, 3 ).indexOf( 3 ), 2, "indexOf should work" )
        deepEqual( aseq( 1, 2, 3 ).indexOf( 4 ), -1, "indexOf should work" )

        //equals
        ok( aseq( 1, 2, 3 ).equals( aseq( 1, 2, 3 ) ), "equals should work" )
        ok( !aseq( 1, 2, 3 ).equals( aseq( 3, 2, 1 ) ), "equals should work" )
        ok( aseq( aseq( 1, 2, 3 ), aseq( 1, 2, 3 ) ).equals( aseq( aseq( 1, 2, 3 ), aseq( 1, 2, 3 ) ) ), "equals should work" )

        //exists
        ok( aseq( 1, 2, 3 ).exists( x => x === 2 ), "exists should work" )
        ok( !aseq( 1, 2, 3 ).exists( x => x === 4 ), "exists should work" )

        //corresponds
        ok( aseq( 1, 2, 3 ).corresponds( aseq( 2, 4, 6 ), ( a, b ) => b === 2 * a ), "corresponds should work" )
        ok( !aseq( 1, 2, 3 ).corresponds( aseq( 2, 4, 6 ), ( a, b ) => b === 3 * a ), "corresponds should work" )

        //count
        deepEqual( aseq( 1, 2, 3 ).count( x => x % 2 === 0 ), 1, "count should work" )
        deepEqual( aseq( 1, 2, 3 ).count( x => x === 4 ), 0, "count should work" )

        //drop
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 2 ).toArray(), [ 3, 4, 5, 1, 2, 6 ], "drop should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 0 ).toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ], "drop should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 8 ).toArray(), [], "drop should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 2 ).reverse().toArray(), [ 3, 4, 5, 1, 2, 6 ].reverse(), "drop should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 0 ).reverse().toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ].reverse(), "drop should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropFirst( 8 ).reverse().toArray(), [].reverse(), "drop should work" )

        //dropLast
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 2 ).toArray(), [ 1, 2, 3, 4, 5, 1 ], "dropLast should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 0 ).toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ], "dropLast should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 8 ).toArray(), [], "dropLast should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 2 ).reverse().toArray(), [ 1, 2, 3, 4, 5, 1 ].reverse(), "dropLast should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 0 ).reverse().toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ].reverse(), "dropLast should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropLast( 8 ).reverse().toArray(), [].reverse(), "dropLast should work" )

        //dropWhile
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 3 ).toArray(), [ 3, 4, 5, 1, 2, 6 ], "dropWhile should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 0 ).toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ], "dropWhile should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 8 ).toArray(), [], "dropWhile should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 3 ).reverse().toArray(), [ 3, 4, 5, 1, 2, 6 ].reverse(), "dropWhile should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 0 ).reverse().toArray(), [ 1, 2, 3, 4, 5, 1, 2, 6 ].reverse(), "dropWhile should work" )
        deepEqual( aseq( 1, 2, 3, 4, 5, 1, 2, 6 ).dropWhile( x => x < 8 ).reverse().toArray(), [].reverse(), "dropWhile should work" )

        //dropAt
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 0, 5 ).toArray(), [ 1, 2, 3, 4 ], "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 1, 2 ).toArray(), [ 0, 3, 4, 5 ], "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 2, 2 ).toArray(), [ 0, 1, 3, 4, 5 ], "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 2, 7 ).toArray(), [ 0, 1, 3, 4, 5 ], "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( -1, 7 ).toArray(), [ 0, 1, 2, 3, 4, 5 ], "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 0, 5 ).reverse().toArray(), [ 1, 2, 3, 4 ].reverse(), "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 1, 2 ).reverse().toArray(), [ 0, 3, 4, 5 ].reverse(), "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 2, 2 ).reverse().toArray(), [ 0, 1, 3, 4, 5 ].reverse(), "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( 2, 7 ).reverse().toArray(), [ 0, 1, 3, 4, 5 ].reverse(), "dropAt should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).dropAt( -1, 7 ).reverse().toArray(), [ 0, 1, 2, 3, 4, 5 ].reverse(), "dropAt should work" )

        //difference
        deepEqual( aseq( 1, 2, 3, 4, 1 ).difference( aseq( 1, 3 ) ).toArray(), [ 2, 4 ], "difference should work" )
        deepEqual( aseq( 1, 2, 3, 4, 1 ).difference( aseq( 1, 3 ) ).reverse().toArray(), [ 2, 4 ].reverse(), "difference should work" )

        //diff
        deepEqual( aseq( 1, 2, 3, 4, 1, 2, 3 ).diff( aseq( 1, 2, 3 ) ).toArray(), [ 4, 1, 2, 3 ], "diff should work" )
        deepEqual( aseq( 1, 2, 3, 4, 1, 2, 3 ).diff( aseq( 1, 2, 3 ) ).reverse().toArray(), [ 3, 2, 1, 4 ], "diff should work" )

        //distinct
        deepEqual( aseq( 1, 2, 3, 4, 1, 2, 3 ).distinct().toArray(), [ 1, 2, 3, 4 ], "distinct should work" )
        deepEqual( aseq( 1, 2, 3, 4, 1, 2, 3 ).distinct().reverse().toArray(), [ 1, 2, 3, 4 ].reverse(), "distinct should work" )

        //endsWith
        ok( aseq( 1, 2, 3, 4, 5, 6, 7 ).endsWith( aseq( 5, 6, 7 ) ), "endsWith should work" )
        ok( !aseq( 1, 2, 3, 4, 5, 6, 7 ).endsWith( aseq( 3, 4, 5 ) ), "endsWith should work" )
        ok( !aseq( 1, 2, 3, 4, 5, 6, 7 ).endsWith( aseq( 5, 6, 7, 1 ) ), "endsWith should work" )
        ok( aseq( 1, 2, 3, 4, 5, 6, 7 ).endsWith( aseq<number>() ), "endsWith should work" )

        //startsWith
        ok( aseq( 1, 2, 3, 4, 5, 6, 7 ).startsWith( aseq( 1, 2, 3 ) ), "startsWith should work" )
        ok( !aseq( 1, 2, 3, 4, 5, 6, 7 ).startsWith( aseq( 3, 4, 5 ) ), "startsWith should work" )
        ok( !aseq( 1, 2, 3, 4, 5, 6, 7 ).startsWith( aseq( 1, 2, 3, 5 ) ), "startsWith should work" )
        ok( aseq( 1, 2, 3, 4, 5, 6, 7 ).startsWith( aseq<number>() ), "startsWith should work" )


        //slice
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 0 ).toArray(), [ 0, 1, 2, 3, 4, 5 ], "slice should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 2, 5 ).toArray(), [ 2, 3, 4 ], "slice should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 2, 15 ).toArray(), [ 2, 3, 4, 5 ], "slice should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 0 ).reverse().toArray(), [ 0, 1, 2, 3, 4, 5 ].reverse(), "slice should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 2, 5 ).reverse().toArray(), [ 2, 3, 4 ].reverse(), "slice should work" )
        deepEqual( aseq( 0, 1, 2, 3, 4, 5 ).slice( 2, 15 ).reverse().toArray(), [ 2, 3, 4, 5 ].reverse(), "slice should work" )


        console.log( "DONE" )

    } ) )


    it( '.take() should iterate only what it needs', ( done: MochaDone ) => checkFail( done, () => {

        const vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
        const len = vals.length;
        let findex = -1;
        let bindex = -1;

        const fit = () => {
            let index = -1;
            return iterator(
                () => {
                    ++findex
                    return (++index) < len
                },
                () => vals[ index ]
            )
        };

        const bit = () => {
            let index = vals.length;
            return iterator(
                () => {
                    ++bindex
                    return (--index >= 0)

                },
                () => vals[ index ]
            )
        };

        const s = fseq( iterable( fit, bit ) );

        const resf = s.takeFirst( 8 ).takeFirst( 6 ).takeFirst( 3 ).toArray();
        deepEqual( resf, [ 1, 2, 3 ], "take should take the correct values" )
        deepEqual( findex, 2, "take should only iterate what is needed" )

        const resb = s.takeFirst( 3 ).reverse().toArray();
        //var resb = s.takeFirst( 8 ).takeFirst( 6 ).takeFirst( 3 ).reverse().toArray()
        deepEqual( resb, [ 3, 2, 1 ], "take should take the correct values" )
        deepEqual( bindex, 19, "take should only iterate what is needed" )

    } ) )

    it( 'should work lazily', ( done: MochaDone ) => checkFail( done, () => {

        const l = aseq( aseq( 1 ), aseq( 2, 3, 4, 5 ), aseq( 6, 7, 8, 9 ) );

        let mapRun = 0;
        let filterRun = 0;

        const isOdd = ( x: number ) => {
            filterRun += 1
            return x % 2 !== 0
        };

        const square = ( x: number ) => {
            mapRun += 1
            return x * x
        };

        const lazyRes = l.flatten().filter( isOdd ).map( square ).takeFirst( 2 );

        deepEqual( filterRun, 0, "filter should not have run" )
        deepEqual( mapRun, 0, "map should not have run" )

        const res = lazyRes.toArray();

        deepEqual( res, [ 1, 9 ], "should calculate the correct result" )
        deepEqual( filterRun, 3, "filter should run 3 times" )
        deepEqual( mapRun, 2, "should run twice" )

    } ) )


    it( 'should behave like a gentle Monad', ( done: MochaDone ) => checkFail( done, () => {

        //Monad Laws
        const f = ( x: number ) => aseq( x * x );
        const g = ( x: number ) => aseq( x + 2 );
        deepEqual( aseq( 3 ).flatMap( f ).toArray(), f( 3 ).toArray(), "1st Monad Law" )
        deepEqual( aseq( 1, 2, 3 ).flatMap( aseq ).toArray(), aseq( 1, 2, 3 ).toArray(), "2nd Monad Law" )
        deepEqual( aseq( 1, 2, 3 ).flatMap( ( x ) => f( x ).flatMap( g ) ).toArray(), aseq( 1, 2, 3 ).flatMap( f ).flatMap( g ).toArray(), "3rd Monad Law" )
    } ) )


} )

