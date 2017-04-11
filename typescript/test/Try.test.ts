import {none, some} from '../Option'
/**
 * Author: Bruno Grieder
 */

require( 'source-map-support' ).install()
import chai = require('chai')
import {tri} from '../Try'


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;


describe( 'Try', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )


    // it( 'collect', ( done: MochaDone ) => {
    //     deepEqual( none().collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [], "collect failed" )
    //     deepEqual( some( 2 ).collect<number>( v => v % 2 === 0 )( v => v * 2 ).toArray, [ 4 ], "collect failed" )
    //     done()
    // } )
    //
    // it( 'collectFirst', ( done: MochaDone ) => {
    //     deepEqual( none().collectFirst( x => x === 3 )( x => x * 2 ).equals( none() ), true, "collectFirst failed" )
    //     deepEqual( some( 2 ).collectFirst( x => x === 2 )( x => x * 3 ).equals( some( 6 ) ), true, "collectFirst failed" )
    //     deepEqual( some( 2 ).collectFirst( x => x === 13 )( x => x * 3 ).equals( none() ), true, "collectFirst failed" )
    //     done()
    // } )
    //
    // it( 'concat', ( done: MochaDone ) => {
    //     deepEqual( some( 2 ).concat( some( 3 ) ).toArray, [ 2, 3 ], "concat failed" )
    //     deepEqual( some( 2 ).concat( none() ).toArray, [ 2 ], "concat failed" )
    //     deepEqual( none().concat( some( 3 ) ).toArray, [ 3 ], "concat failed" )
    //     deepEqual( none().concat( none() ).toArray, [], "concat failed" )
    //     done()
    // } )
    //
    // it( 'contains', ( done: MochaDone ) => {
    //     deepEqual( none().contains( 2 ), false, "contains failed" )
    //     deepEqual( some( 2 ).contains( 2 ), true, "contains failed" )
    //     deepEqual( some( 2 ).contains( 10 ), false, "contains failed" )
    //     done()
    // } )
    //
    // it( 'count', ( done: MochaDone ) => {
    //     deepEqual( none().count( v => v % 2 === 0 ), 0, "count failed" )
    //     deepEqual( some( 2 ).count( v => v % 2 === 0 ), 1, "count failed" )
    //     deepEqual( some( 2 ).count( v => v % 3 === 0 ), 0, "count failed" )
    //     done()
    // } )
    //
    // it( 'drop', ( done: MochaDone ) => {
    //     deepEqual( none().drop( 3 ).isEmpty, true, "drop failed" )
    //     deepEqual( none().drop( 3 ).size, 0, "drop failed" )
    //     deepEqual( some( 2 ).drop( 1 ).size, 0, "drop failed" )
    //     done()
    // } )
    //
    // it( 'dropWhile', ( done: MochaDone ) => {
    //     deepEqual( none().dropWhile( w => w < 3 ).isEmpty, true, "dropWhile failed" )
    //     deepEqual( some( 2 ).dropWhile( w => w < 3 ).isEmpty, true, "dropWhile failed" )
    //     deepEqual( some( 2 ).dropWhile( w => w > 50 ).isEmpty, false, "dropWhile failed" )
    //     done()
    // } )
    //
    // it( 'equals', ( done: MochaDone ) => {
    //     const a1 = seq( [ 1, 2, 3 ] )
    //     deepEqual( some( 2 ).equals( some( 2 ) ), true, "equals failed" )
    //     deepEqual( some( 2 ).equals( none() ), false, "equals failed" )
    //     deepEqual( none().equals( none() ), true, "equals failed" )
    //     deepEqual( none().equals( some( 2 ) ), false, "equals failed" )
    //     deepEqual( seq( 2 ).equals( some( 2 ) ), true, "equals failed" )
    //     done()
    // } )
    //
    // it( 'exists', ( done: MochaDone ) => {
    //     deepEqual( none().exists( v => v === 3 ), false, "exists failed" )
    //     deepEqual( some( 2 ).exists( v => v === 2 ), true, "exists failed" )
    //     deepEqual( some( 2 ).exists( v => v === 10 ), false, "exists failed" )
    //     done()
    // } )

    it( 'filter', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).filter( () => true ).get, 2, "filter failed" )
        try {
            tri( () => 2 ).filter( () => false ).get
            return done( new Error( 'filter failed' ) )
        }
        catch ( e ) {
            /* ignore */
        }
        try {
            tri( () => { throw new Error( 'OK' ) } ).filter( () => true ).get
            return done( new Error( 'filter failed' ) )
        }
        catch ( e ) {
            /* ignore */
        }
        try {
            tri( () => { throw new Error( 'OK' ) } ).filter( () => false ).get
            return done( new Error( 'filter failed' ) )
        }
        catch ( e ) {
            /* ignore */
        }
        done()
    } )
    //
    // it( 'filterNot', ( done: MochaDone ) => {
    //     deepEqual( none().filterNot( v => v % 2 === 0 ).equals( none() ), true, "filterNot failed" )
    //     deepEqual( some( 2 ).filterNot( v => v % 2 === 0 ).equals( none() ), true, "filterNot failed" )
    //     deepEqual( some( 2 ).filterNot( v => v % 2 === 1 ).equals( some( 2 ) ), true, "filterNot failed" )
    //     done()
    // } )

    it( 'flatten', ( done: MochaDone ) => {
        deepEqual( tri( () => tri( () => 2 ) ).flatten().get, 2, "flatten failed" )
        deepEqual( tri( () => 2 ).flatten().get, 2, "flatten failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).flatten().isFailure, true, "flatten failed" )
        deepEqual( tri( () => tri( () => {throw new Error( 'OK' )} ) ).flatten().isFailure, true, "flatten failed" )
        done()
    } )

    it( 'flatMap', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).flatMap( ( v: number ) => tri( () => v * 3 ) ).get, 6, "flatMap failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).flatMap( ( v: number ) => tri( () => v * 3 ) ).isFailure, true, "flatMap failed" )
        done()
    } )
    //
    // it( 'find', ( done: MochaDone ) => {
    //     deepEqual( none().find( x => x === 3 ).equals( none() ), true, "find failed" )
    //     deepEqual( some( 2 ).find( x => x === 2 ).equals( some( 2 ) ), true, "find failed" )
    //     deepEqual( some( 2 ).find( x => x === 13 ).equals( none() ), true, "find failed" )
    //     done()
    // } )
    //
    // it( 'foldLeft', ( done: MochaDone ) => {
    //     deepEqual( none().foldLeft( 1 )( ( acc, v ) => acc + v ), 1, "foldLeft failed" )
    //     deepEqual( some( 2 ).foldLeft( 1 )( ( acc, v ) => acc + v ), 3, "foldLeft failed" )
    //     done()
    // } )
    //
    // it( 'foldRight', ( done: MochaDone ) => {
    //     deepEqual( none().foldRight( 1 )( ( acc, v ) => acc + v ), 1, "foldRight failed" )
    //     deepEqual( some( 2 ).foldRight( 1 )( ( acc, v ) => acc + v ), 3, "foldRight failed" )
    //     done()
    // } )
    //
    // it( 'forall', ( done: MochaDone ) => {
    //     deepEqual( none().forall( v => v < 50 ), true, "forall failed" )
    //     deepEqual( some( 2 ).forall( v => v > 50 ), false, "forall failed" )
    //     deepEqual( some( 2 ).forall( v => v < 3 ), true, "forall failed" )
    //     done()
    // } )
    //
    it( 'foreach', ( done: MochaDone ) => {

        let count = 0
        const f = ( value: number ): void => {
            count = count + value
        }

        count = 0
        tri( () => {throw new Error( 'OK' )} ).foreach( f )
        deepEqual( count, 0, "foreach failed" )

        count = 0
        tri( () => 2 ).foreach( f )
        deepEqual( count, 2, "foreach failed" )
        done()
    } )

    it( 'get', ( done: MochaDone ) => {
        try {
            tri( () => { throw new Error( 'OK' ) } ).get
            return done( new Error( "get Failed" ) )
        }
        catch ( e ) {
            /* ignore */
        }
        deepEqual( tri( () => 2 ).get, 2, 'get Failed' )
        done()
    } )

    it( 'getOrElse', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).getOrElse( () => 3 ), 2, "getOrElse failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).getOrElse( () => 3 ), 3, "getOrElse failed" )
        done()
    } )
    //
    // it( 'isDefined', ( done: MochaDone ) => {
    //     deepEqual( none().isDefined, false, "isDefined failed" )
    //     deepEqual( some( 2 ).isDefined, true, "isDefined failed" )
    //     done()
    // } )
    //
    // it( 'isEmpty', ( done: MochaDone ) => {
    //     deepEqual( none().isEmpty, true, "isEmpty failed" )
    //     deepEqual( some( 2 ).isEmpty, false, "isEmpty failed" )
    //     done()
    // } )
    //
    // it( 'isIndexed', ( done: MochaDone ) => {
    //     deepEqual( none().isIndexed, true, "isIndexed failed" )
    //     deepEqual( some( 2 ).isIndexed, true, "isIndexed failed" )
    //     done()
    // } )
    //
    // it( 'length', ( done: MochaDone ) => {
    //     deepEqual( none().length, 0, "length failed" )
    //     deepEqual( some( 2 ).length, 1, "length failed" )
    //     done()
    // } )
    //
    // it( 'last', ( done: MochaDone ) => {
    //     try {
    //         none().last
    //         return done( new Error( "last Failed" ) )
    //     }
    //     catch ( e ) { /* ignore */}
    //     deepEqual( some( 2 ).last, 2, "last failed" )
    //     done()
    // } )
    //
    // it( 'lastOption', ( done: MochaDone ) => {
    //     deepEqual( none().lastOption.equals( none() ), true, "lastOption failed" )
    //     deepEqual( some( 2 ).lastOption.equals( some( 2 ) ), true, "lastOption failed" )
    //     done()
    // } )

    it( 'map', ( done: MochaDone ) => {
        deepEqual( tri<number>( () => 2 ).map( v => v * 2 ).get, 4, "map failed" )
        deepEqual( tri<number>( () => { throw new Error( 'OK' )} ).map( v => v * 2 ).isFailure, true, "map failed" )
        done()
    } )
    //
    // it( 'mkString', ( done: MochaDone ) => {
    //     deepEqual( none().mkString(), "", "mkString failed" )
    //     deepEqual( some( 2 ).mkString(), "2", "mkString failed" )
    //     done()
    // } )
    //
    // it( 'nonEmpty', ( done: MochaDone ) => {
    //     deepEqual( none().nonEmpty, false, "nonEmpty failed" )
    //     deepEqual( some( 2 ).nonEmpty, true, "nonEmpty failed" )
    //     done()
    // } )

    it( 'orElse', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).orElse( () => tri( () => 3 ) ).get, 2, "orElse failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).orElse( () => tri( () => 3 ) ).get, 3, "orElse failed" )
        done()
    } )

    // it( 'orNull', ( done: MochaDone ) => {
    //     deepEqual( none().orNull, null, "orNull failed" )
    //     deepEqual( some( 2 ).orNull, 2, "orNull failed" )
    //     done()
    // } )
    //
    // it( 'orUndefined', ( done: MochaDone ) => {
    //     deepEqual( none().orUndefined, void 0, "orUndefined failed" )
    //     deepEqual( some( 2 ).orUndefined, 2, "orUndefined failed" )
    //     done()
    // } )

    it( 'recover', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).recover( ( e: Error ) => 3 ).get, 2, "recover failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).recover( ( e: Error ) => 3 ).get, 3, "recover failed" )
        done()
    } )

    it( 'recoverWith', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).recoverWith( ( e: Error ) => tri( () => 3 ) ).get, 2, "recoverWith failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).recoverWith( ( e: Error ) => tri( () => 3 ) ).get, 3, "recoverWith failed" )
        done()
    } )
    //
    // it( 'reverse', ( done: MochaDone ) => {
    //     deepEqual( some( 2 ).reverse.toArray, [ 2 ], "reverse failed" )
    //     deepEqual( none().reverse.toArray, [], "reverse failed" )
    //     done()
    // } )
    //
    // it( 'slice', ( done: MochaDone ) => {
    //     deepEqual( none().slice( 2, 5 ).toArray, [], "slice failed" )
    //     deepEqual( some( 2 ).slice( 0, 1 ).toArray, [ 2 ], "slice failed" )
    //     deepEqual( some( 2 ).slice( 2, 5 ).toArray, [], "slice failed" )
    //     done()
    // } )
    //
    // it( 'size', ( done: MochaDone ) => {
    //     deepEqual( none().size, 0, "size failed" )
    //     deepEqual( some( 2 ).size, 1, "size failed" )
    //     done()
    // } )

    it( 'toOption', ( done: MochaDone ) => {
        deepEqual( tri<number>( () => 2 ).toOption.get, 2, "toOption failed" )
        deepEqual( tri<number>( () => 2 ).toOption.equals( some( 2 ) ), true, "toOption failed" )
        deepEqual( tri<number>( () => { throw new Error( 'OK' )} ).toOption.equals( none() ), true, "toOption failed" )
        let count = 0
        const f = (): number => {
            count = count + 1
            return count * 2
        }
        const opt = tri( f )
        deepEqual( count, 0, "toOption failed" )
        deepEqual( opt.get, 2, "toOption failed" )
        deepEqual( count, 1, "toOption failed" )
        done()

    } )

    // it( 'toPromise', async ( ) => {
    //     deepEqual( await none().toPromise.catch( () => 2 ), 2, "toPromise failed" )
    //     deepEqual( await some( 2 ).toPromise, 2, "toPromise failed" )
    // } )
    //
    // it( 'toString', ( done: MochaDone ) => {
    //     deepEqual( none().toString, "", "toString failed" )
    //     deepEqual( some( 2 ).toString, "2", "toString failed" )
    //     done()
    // } )
    //
    // it( 'should be a monad', ( done: MochaDone ) => {
    //     //Monad Laws
    //     const f = ( x: number ) => seq( [ x * x ] );
    //     const g = ( x: number ) => seq( [ x + 2 ] );
    //     deepEqual( seq( [ 3 ] ).flatMap( f ).toArray, f( 3 ).toArray, "1st Monad Law" )
    //     deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => seq( [ x ] ) ).toArray, seq( [ 1, 2, 3 ] ).toArray, "2nd Monad Law" )
    //     deepEqual( seq( [ 1, 2, 3 ] ).flatMap( ( x: number ) => f( x ).flatMap( g ) ).toArray, seq( [ 1, 2, 3 ] ).flatMap( f ).flatMap( g ).toArray, "3rd Monad Law" )
    //     done()
    // } )

    it( 'should be lazy', ( done: MochaDone ) => {

        let count = 0
        const f = ( value: number ): number => {
            count = count + 1
            return 2
        }

        const t = tri<number>( f ).filter( () => true )
        deepEqual( count, 0, 'lazy failed' )

        deepEqual( t.get, 2, 'lazy failed' )
        deepEqual( count, 1, 'lazy failed' )

        deepEqual( t.isSuccess, true, 'lazy failed' )
        deepEqual( count, 1, 'lazy failed' )
        done()
    } )
} )



