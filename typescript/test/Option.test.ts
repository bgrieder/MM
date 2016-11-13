/**
 * Author: Bruno Grieder
 * Date:   18/05/2015
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import * as TestsSetup from './TestsSetup'
import {list} from '../impl/ListImpl'


const checkFail = TestsSetup.checkFail;

const deepEqual: ( act: any, exp: any, msg?: string ) =>void = chai.assert.deepEqual;
// let notDeepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.notDeepEqual;
const ok: ( val: any, msg?: string ) => void = chai.assert.ok;


import {none, some} from '../impl/OptionImpl'


describe( 'Option', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )


    beforeEach( TestsSetup._beforeEach )
    afterEach( TestsSetup._afterEach )


    it( 'should take multiple constructors', ( done: MochaDone ) => checkFail( done, () => {

        const n = none();
        ok( n.isEmpty(), "None is not empty" )
        try {
            n.get()
            done( new Error( "None has a val" ) )
        }
        catch ( e ) {
        }

        deepEqual( some().get(), undefined, "empty Some can be constructed" )
        deepEqual( some( 1 ).get(), 1, "Some can be constructed from a single value" )
        deepEqual( some( some( 1 ) ).get().get(), 1, "Some can contain other Some" )
    } ) )


    it( 'should honor the Option interface', ( done: MochaDone ) => checkFail( done, () => {

        //map
        deepEqual( some( 2 ).map( ( x ) => x * x ).get(), 4, "Some should map" )
        ok( none().map( ( x ) => x * x ).isEmpty(), "None should not map" )

        //flatten
        deepEqual( some( some( 1 ) ).flatten().get(), 1, "some of some should be flattened" )
        deepEqual( some( none() ).flatten().getOrElse( () => 3 ), 3, "some of none should be flattened to an empty some" ) //really?
        deepEqual( some( 1 ).flatten().get(), 1, "some of non iterable values should not be flattened" )

        //getOrElse<U>( elseVal: () => U ): A|U
        deepEqual( some( 1 ).getOrElse( () => 2 ), 1, "getOrElse should get on some" )
        deepEqual( none().getOrElse( () => 2 ), 2, "getOrElse should else on none" )

        //getOrNull(): A
        deepEqual( some( 1 ).getOrNull(), 1, "getOrNull should get on some" )
        deepEqual( none().getOrNull(), null, "getOrNull should return Null on none" )

        //getOrUndefined(): A
        deepEqual( some( 1 ).getOrUndefined(), 1, "getOrUndefined should get on some" )
        deepEqual( none().getOrUndefined(), undefined, "getOrUndefined should return undefined on none" )

        //map<U>( f: ( value: A ) => U ): Option<U>
        deepEqual( some( 1 ).map( ( x ) => x * 3 ).get(), 3, "map should work on some" )
        ok( none().map( ( x ) => x * 3 ).isEmpty(), "map should not act on None" )

        //fold<U>( ifEmpty: () => U, f: ( value: A ) => U ): U
        deepEqual( some( 1 ).fold( () => 3, x => x * 3 ), 3, "fold should work on some" )
        deepEqual( none().fold( () => 5, x => x * 3 ), 5, "fold should work on none" )

        //flatMap<U>( f: ( value: A ) => Option<U> ): Option<U>
        deepEqual( some( 1 ).flatMap( x => some( x * 3 ) ).get(), 3, "flatMap should work on some" )
        ok( none().flatMap( x => some( x * 3 ) ).isEmpty(), "flatMap should not act on None" )

        //flatten<U>(): Option<U>
        deepEqual( some( some( 3 ) ).flatten().get(), 3, "flatten should work on some" )
        ok( none().flatten().isEmpty(), "flatten should not act on None" )

        //filter( test: ( value: A ) => boolean ): Option<A>
        deepEqual( some( 3 ).filter( x => x === 3 ).get(), 3, "filter should work on some" )
        deepEqual( some( 1 ).filter( x => x === 3 ).getOrElse( () => 3 ), 3, "filter should work on some" )
        ok( none().filter( x => (x === 3) ).isEmpty(), "filter should not act on None" )

        //filterNot( test: ( value: A ) => boolean ): Option<A>
        deepEqual( some( 3 ).filterNot( x => (x !== 3) ).get(), 3, "filterNot should work on some" )
        deepEqual( some( 1 ).filterNot( x => (x === 1) ).getOrElse( () => 3 ), 3, "filterNot should work on some" )
        ok( none().filterNot( x => (x === 3) ).isEmpty(), "filterNot should not act on None" )

        //exists( test: ( value: A ) => boolean ): boolean
        ok( some( 3 ).exists( x => (x === 3) ), "exist should work on some" )
        ok( !some( 1 ).exists( x => (x === 3) ), "exist should work on some" )
        ok( !none().exists( x => (x === 3) ), "exist should not act on None" )

        //forAll( test: ( value: A ) => boolean ): boolean
        ok( some( 3 ).forAll( x => (x === 3) ), "forAll should work on some" )
        ok( !some( 1 ).exists( x => (x === 3) ), "forAll should work on some" )
        ok( none().forAll( x => (x === 3) ), "forAll should return true on None" )

        //forEach<U>( f: ( value: A ) => U )
        let isRun = false
        some( 1 ).forEach( x => isRun = (x === 1) )
        ok( isRun, "forEach should run on Some" )

        isRun = false
        none().forEach( x => isRun = true )
        ok( !isRun, "forEach should not act on None" )

        //collect<U>( partialFunction: {someFn?: ( value: A ) => U} ): Option<U>
        //noinspection JSUnusedGlobalSymbols
        deepEqual( some( 1 ).collect( { someFn: x => x * 3 } ).get(), 3, "collect should work on some" )
        ok( some( 1 ).collect( {} ).isEmpty(), "collect should work on some" )
        ok( none().map( ( x ) => x * 3 ).isEmpty(), "collect should not act on None" )

        //orElse( alternative: () => Option<A> ): Option<A>
        deepEqual( some( 1 ).orElse( () => some( 5 ) ).get(), 1, "orElse should work on some" )
        deepEqual( none().orElse( () => some( 5 ) ).get(), 5, "orElse should work on nome" )
    } ) )


    it( 'should work lazily', ( done: MochaDone ) => checkFail( done, () => {

        const l = some( some( 3 ) );

        let mapRun = 0;
        let filterRun = 0;

        const isOdd = ( x: number ) => {
            filterRun += 1

            console.log( "filtering " + x + ": " + (x % 2) )
            return x % 2 !== 0
        };

        const square = ( x: number ) => {
            mapRun += 1
            console.log( "squaring X" )
            return x * x
        };

        const lazyRes = l.flatten().filter( isOdd ).map( square );

        deepEqual( filterRun, 0, "filter should not have run" )
        deepEqual( mapRun, 0, "map should not have run" )

        const res = lazyRes.get();

        deepEqual( res, 9, "should calculate the correct result" )
        deepEqual( filterRun, 1, "filter should have run" )
        deepEqual( mapRun, 1, "should have run" )
    } ) )


    it( 'should behave like a gentle Monad', ( done: MochaDone ) => checkFail( done, () => {

        //Monad Laws
        const f = ( x: any ) => some( x * x );
        const g = ( x: any ) => some( x + 2 );
        deepEqual( some( 3 ).flatMap( f ).get(), f( 3 ).get(), "1st Monad Law" )
        deepEqual( some( 3 ).flatMap( some ).get(), some( 3 ).get(), "2nd Monad Law" )
        deepEqual( some( 3 ).flatMap( ( x ) => f( x ).flatMap( g ) ).get(), some( 3 ).flatMap( f ).flatMap( g ).get(), "3rd Monad Law" )

        deepEqual( some( list( 1, 2, 2 ) ).flatten().get(), 1, "Some List of vals should be flattened to a a Some of the first val of the List" )
    } ) )


} )



