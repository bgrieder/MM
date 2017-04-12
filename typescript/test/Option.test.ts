/**
 * Author: Bruno Grieder
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import {seq} from '../Seq'
import {none, option, some} from '../Option'


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;


describe( 'Option', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )

    // beforeEach( TestsSetup._beforeEach )
    // afterEach( TestsSetup._afterEach )

    it( 'collect', ( done: MochaDone ) => {
        deepEqual( none().collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [], "collect failed" )
        deepEqual( some( 2 ).collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [ 4 ], "collect failed" )
        done()
    } )

    it( 'collectFirst', ( done: MochaDone ) => {
        deepEqual( none().collectFirst( x => x === 3 )( x => x * 2 ).equals( none() ), true, "collectFirst failed" )
        deepEqual( some( 2 ).collectFirst( x => x === 2 )( x => x * 3 ).equals( some( 6 ) ), true, "collectFirst failed" )
        deepEqual( some( 2 ).collectFirst( x => x === 13 )( x => x * 3 ).equals( none() ), true, "collectFirst failed" )
        done()
    } )

    it( 'concat', ( done: MochaDone ) => {
        deepEqual( some( 2 ).concat( some( 3 ) ).toArray, [ 2, 3 ], "concat failed" )
        deepEqual( some( 2 ).concat( none() ).toArray, [ 2 ], "concat failed" )
        deepEqual( none().concat( some( 3 ) ).toArray, [ 3 ], "concat failed" )
        deepEqual( none().concat( none() ).toArray, [], "concat failed" )
        done()
    } )

    it( 'contains', ( done: MochaDone ) => {
        deepEqual( none().contains( 2 ), false, "contains failed" )
        deepEqual( some( 2 ).contains( 2 ), true, "contains failed" )
        deepEqual( some( 2 ).contains( 10 ), false, "contains failed" )
        done()
    } )

    it( 'count', ( done: MochaDone ) => {
        deepEqual( none().count( v => v % 2 === 0 ), 0, "count failed" )
        deepEqual( some( 2 ).count( v => v % 2 === 0 ), 1, "count failed" )
        deepEqual( some( 2 ).count( v => v % 3 === 0 ), 0, "count failed" )
        done()
    } )

    it( 'drop', ( done: MochaDone ) => {
        deepEqual( none().drop( 3 ).isEmpty, true, "drop failed" )
        deepEqual( none().drop( 3 ).size, 0, "drop failed" )
        deepEqual( some( 2 ).drop( 1 ).size, 0, "drop failed" )
        done()
    } )

    it( 'dropWhile', ( done: MochaDone ) => {
        deepEqual( none().dropWhile( w => w < 3 ).isEmpty, true, "dropWhile failed" )
        deepEqual( some( 2 ).dropWhile( w => w < 3 ).isEmpty, true, "dropWhile failed" )
        deepEqual( some( 2 ).dropWhile( w => w > 50 ).isEmpty, false, "dropWhile failed" )
        done()
    } )

    it( 'equals', ( done: MochaDone ) => {
        const a1 = seq( [ 1, 2, 3 ] )
        deepEqual( some( 2 ).equals( some( 2 ) ), true, "equals failed" )
        deepEqual( some( 2 ).equals( none() ), false, "equals failed" )
        deepEqual( none().equals( none() ), true, "equals failed" )
        deepEqual( none().equals( some( 2 ) ), false, "equals failed" )
        deepEqual( seq( 2 ).equals( some( 2 ) ), true, "equals failed" )
        done()
    } )

    it( 'exists', ( done: MochaDone ) => {
        deepEqual( none().exists( v => v === 3 ), false, "exists failed" )
        deepEqual( some( 2 ).exists( v => v === 2 ), true, "exists failed" )
        deepEqual( some( 2 ).exists( v => v === 10 ), false, "exists failed" )
        done()
    } )

    it( 'filter', ( done: MochaDone ) => {
        deepEqual( none().filter( v => v % 2 === 0 ).equals( none() ), true, "filter failed" )
        deepEqual( some( 2 ).filter( v => v % 2 === 0 ).equals( some( 2 ) ), true, "filter failed" )
        deepEqual( some( 2 ).filter( v => v % 2 === 1 ).equals( none() ), true, "filter failed" )
        done()
    } )

    it( 'filterNot', ( done: MochaDone ) => {
        deepEqual( none().filterNot( v => v % 2 === 0 ).equals( none() ), true, "filterNot failed" )
        deepEqual( some( 2 ).filterNot( v => v % 2 === 0 ).equals( none() ), true, "filterNot failed" )
        deepEqual( some( 2 ).filterNot( v => v % 2 === 1 ).equals( some( 2 ) ), true, "filterNot failed" )
        done()
    } )

    it( 'flatten', ( done: MochaDone ) => {
        deepEqual( none().flatten().equals( none() ), true, "flatten failed" )
        deepEqual( some( none() ).flatten().equals( none() ), true, "flatten failed" )
        deepEqual( some( some( 3 ) ).flatten().equals( some( 3 ) ), true, "flatten failed" )
        done()
    } )

    it( 'flatMap', ( done: MochaDone ) => {
        deepEqual( none().flatMap( ( v: number ) => some( v * 2 ) ).isEmpty, true, "flatMap failed" )
        deepEqual( some( 2 ).flatMap( ( v: number ) => some( v * 2 ) ).get, 4, "flatMap failed" )
        deepEqual( some( 2 ).flatMap( ( v: number ) => some( v * 2 ) ).equals( some( 4 ) ), true, "flatMap failed" )
        done()
    } )

    it( 'find', ( done: MochaDone ) => {
        deepEqual( none().find( x => x === 3 ).equals( none() ), true, "find failed" )
        deepEqual( some( 2 ).find( x => x === 2 ).equals( some( 2 ) ), true, "find failed" )
        deepEqual( some( 2 ).find( x => x === 13 ).equals( none() ), true, "find failed" )
        done()
    } )

    it( 'foldLeft', ( done: MochaDone ) => {
        deepEqual( none().foldLeft( 1 )( ( acc, v ) => acc + v ), 1, "foldLeft failed" )
        deepEqual( some( 2 ).foldLeft( 1 )( ( acc, v ) => acc + v ), 3, "foldLeft failed" )
        done()
    } )

    it( 'foldRight', ( done: MochaDone ) => {
        deepEqual( none().foldRight( 1 )( ( acc, v ) => acc + v ), 1, "foldRight failed" )
        deepEqual( some( 2 ).foldRight( 1 )( ( acc, v ) => acc + v ), 3, "foldRight failed" )
        done()
    } )

    it( 'forall', ( done: MochaDone ) => {
        deepEqual( none().forall( v => v < 50 ), true, "forall failed" )
        deepEqual( some( 2 ).forall( v => v > 50 ), false, "forall failed" )
        deepEqual( some( 2 ).forall( v => v < 3 ), true, "forall failed" )
        done()
    } )

    it( 'foreach', ( done: MochaDone ) => {

        let count = 0
        const f = ( value: number ): void => {
            count = count + value
        }

        count = 0
        none().foreach( f )
        deepEqual( count, 0, "foreach failed" )

        count = 0
        some( 2 ).foreach( f )
        deepEqual( count, 2, "foreach failed" )
        done()
    } )

    it( 'get', ( done: MochaDone ) => {
        try {
            none().get
            return done( new Error( "get Failed" ) )
        }
        catch ( e ) { /* ignore */}
        deepEqual( some( 2 ).get, 2, "get failed" )
        done()
    } )

    it( 'getOrElse', ( done: MochaDone ) => {
        deepEqual( none().getOrElse( () => 3 ), 3, "getOrElse failed" )
        deepEqual( some( 2 ).getOrElse( () => 3 ), 2, "getOrElse failed" )
        done()
    } )

    it( 'hasDefiniteSize', ( done: MochaDone ) => {
        deepEqual( none().hasDefiniteSize, true, "hasDefiniteSize failed" )
        deepEqual( some( 2 ).hasDefiniteSize, true, "hasDefiniteSize failed" )
        done()
    } )

    it( 'head', ( done: MochaDone ) => {
        try {
            none().head
            return done( new Error( "head Failed" ) )
        }
        catch ( e ) { /* ignore */}
        deepEqual( some( 2 ).head, 2, "head failed" )
        done()
    } )

    it( 'headOption', ( done: MochaDone ) => {
        deepEqual( none().headOption.equals( none() ), true, "headOption failed" )
        deepEqual( some( 2 ).headOption.equals( some( 2 ) ), true, "headOption failed" )
        done()
    } )

    it( 'indexOf', ( done: MochaDone ) => {
        deepEqual( none().indexOf( 2 ), -1, "indexOf failed" )
        deepEqual( some( 2 ).indexOf( 2 ), 0, "indexOf failed" )
        deepEqual( some( 2 ).indexOf( 3 ), -1, "indexOf failed" )
        done()
    } )

    it( 'isDefined', ( done: MochaDone ) => {
        deepEqual( none().isDefined, false, "isDefined failed" )
        deepEqual( some( 2 ).isDefined, true, "isDefined failed" )
        done()
    } )

    it( 'isEmpty', ( done: MochaDone ) => {
        deepEqual( none().isEmpty, true, "isEmpty failed" )
        deepEqual( some( 2 ).isEmpty, false, "isEmpty failed" )
        done()
    } )

    it( 'isIndexed', ( done: MochaDone ) => {
        deepEqual( none().isIndexed, true, "isIndexed failed" )
        deepEqual( some( 2 ).isIndexed, true, "isIndexed failed" )
        done()
    } )

    it( 'length', ( done: MochaDone ) => {
        deepEqual( none().length, 0, "length failed" )
        deepEqual( some( 2 ).length, 1, "length failed" )
        done()
    } )

    it( 'last', ( done: MochaDone ) => {
        try {
            none().last
            return done( new Error( "last Failed" ) )
        }
        catch ( e ) { /* ignore */}
        deepEqual( some( 2 ).last, 2, "last failed" )
        done()
    } )

    it( 'lastOption', ( done: MochaDone ) => {
        deepEqual( none().lastOption.equals( none() ), true, "lastOption failed" )
        deepEqual( some( 2 ).lastOption.equals( some( 2 ) ), true, "lastOption failed" )
        done()
    } )

    it( 'map', ( done: MochaDone ) => {
        deepEqual( none().map( v => v * 2 ).equals( none() ), true, "map failed" )
        deepEqual( some( 2 ).map( v => v * 2 ).equals( some( 4 ) ), true, "map failed" )
        done()
    } )

    it( 'mkString', ( done: MochaDone ) => {
        deepEqual( none().mkString(), "", "mkString failed" )
        deepEqual( some( 2 ).mkString(), "2", "mkString failed" )
        done()
    } )

    it( 'nonEmpty', ( done: MochaDone ) => {
        deepEqual( none().nonEmpty, false, "nonEmpty failed" )
        deepEqual( some( 2 ).nonEmpty, true, "nonEmpty failed" )
        done()
    } )

    it( 'orElse', ( done: MochaDone ) => {
        deepEqual( none().orElse( () => some( 3 ) ).equals( some( 3 ) ), true, "orElse failed" )
        deepEqual( some( 2 ).orElse( () => some( 3 ) ).equals( some( 2 ) ), true, "orElse failed" )
        done()
    } )

    it( 'orNull', ( done: MochaDone ) => {
        deepEqual( none().orNull, null, "orNull failed" )
        deepEqual( some( 2 ).orNull, 2, "orNull failed" )
        done()
    } )

    it( 'orThrow', ( done: MochaDone ) => {
        try {
            none().orThrow( () => "OK" )
            return done( new Error( "orThrow Failed" ) )
        }
        catch ( e ) {
            deepEqual( e.message, "OK", "orNull failed" )
        }
        deepEqual( some( 2 ).orThrow( () => "Not OK" ), 2, "orThrow failed" )
        done()
    } )

    it( 'orUndefined', ( done: MochaDone ) => {
        deepEqual( none().orUndefined, void 0, "orUndefined failed" )
        deepEqual( some( 2 ).orUndefined, 2, "orUndefined failed" )
        done()
    } )

    it( 'reverse', ( done: MochaDone ) => {
        deepEqual( some( 2 ).reverse.toArray, [ 2 ], "reverse failed" )
        deepEqual( none().reverse.toArray, [], "reverse failed" )
        done()
    } )

    it( 'slice', ( done: MochaDone ) => {
        deepEqual( none().slice( 2, 5 ).toArray, [], "slice failed" )
        deepEqual( some( 2 ).slice( 0, 1 ).toArray, [ 2 ], "slice failed" )
        deepEqual( some( 2 ).slice( 2, 5 ).toArray, [], "slice failed" )
        done()
    } )

    it( 'size', ( done: MochaDone ) => {
        deepEqual( none().size, 0, "size failed" )
        deepEqual( some( 2 ).size, 1, "size failed" )
        done()
    } )

    it( 'sum', ( done: MochaDone ) => {
        try {
            none().sum
            return done( new Error( "sum Failed" ) )
        }
        catch ( e ) { /* ignore */}
        deepEqual( some( 2 ).sum, 2, "sum failed" )
        done()
    } )

    it( 'tail', ( done: MochaDone ) => {
        deepEqual( none().tail.toArray, [], "tail failed" )
        deepEqual( some( 2 ).tail.toArray, [], "tail failed" )
        done()
    } )

    it( 'take', ( done: MochaDone ) => {
        deepEqual( none().take( 3 ).toArray, [], "take failed" )
        deepEqual( some( 2 ).take( 3 ).toArray, [ 2 ], "take failed" )
        done()
    } )

    it( 'toIndexed', ( done: MochaDone ) => {
        deepEqual( none().toIndexed.isIndexed, true, "toIndexed failed" )
        deepEqual( some( 2 ).toIndexed.isIndexed, true, "toIndexed failed" )
        done()
    } )

    it( 'toPromise', async () => {
        deepEqual( await none().toPromise.catch( () => 2 ), 2, "toPromise failed" )
        deepEqual( await some( 2 ).toPromise, 2, "toPromise failed" )
    } )

    it( 'toString', ( done: MochaDone ) => {
        deepEqual( none().toString, "", "toString failed" )
        deepEqual( some( 2 ).toString, "2", "toString failed" )
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
            return value < 3
        }

        count = 0
        none().filter( f ).take( 3 ).toArray
        deepEqual( count, 0, "lazy failed" )

        count = 0
        some( 2 ).filter( f ).take( 3 )
        deepEqual( count, 0, "lazy failed" )

        count = 0
        some( 2 ).filter( f ).take( 3 ).toArray
        deepEqual( count, 1, "lazy failed" )

        done()
    } )

    it( 'option', ( done: MochaDone ) => {
        deepEqual( option( null ).isEmpty, true, "option failed" )
        deepEqual( option( void 0 ).isEmpty, true, "option failed" )
        deepEqual( option( parseInt( "blah" ) ).isEmpty, true, "option failed" )
        deepEqual( option( 2 ).isDefined, true, "option failed" )
        done()
    } )
} )



