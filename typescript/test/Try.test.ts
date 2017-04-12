/**
 * Author: Bruno Grieder
 */
import {none, option, some} from '../Option'

require( 'source-map-support' ).install()
import chai = require('chai')
import {tri, Try} from '../Try'


const deepEqual: ( act: any, exp: any, msg?: string ) => void = chai.assert.deepEqual;


describe( 'Try', function () {

    before( ( done: MochaDone ) => {
        done()
    } )

    after( ( done: MochaDone ) => {
        done()
    } )

    it( 'collect', ( done: MochaDone ) => {
        deepEqual( tri<number>( () => 2 ).collect<number>( () => true )( v => v * 2 ).get, 4, "collect failed" )
        deepEqual( tri<number>( () => 2 ).collect<number>( () => false )( v => v * 2 ).isFailure, true, "collect failed" )
        deepEqual( tri<number>( () => {throw new Error( 'OK' )} ).collect<number>( () => true )( v => v * 2 ).isFailure, true, "collect failed" )
        done()
    } )

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

    it( 'fold', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).fold( ( e: Error ) => 3, ( v: number ) => v * 2 ), 4, "fold failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).fold( ( e: Error ) => 3, ( v: number ) => v * 2 ), 3, "fold failed" )
        done()
    } )
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

    it( 'map', ( done: MochaDone ) => {
        deepEqual( tri<number>( () => 2 ).map( v => v * 2 ).get, 4, "map failed" )
        deepEqual( tri<number>( () => { throw new Error( 'OK' )} ).map( v => v * 2 ).isFailure, true, "map failed" )
        done()
    } )

    it( 'orElse', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).orElse( () => tri( () => 3 ) ).get, 2, "orElse failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).orElse( () => tri( () => 3 ) ).get, 3, "orElse failed" )
        done()
    } )

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

    it( 'toPromise', async () => {
        deepEqual( await tri<number>( () => 2 ).toPromise, 2, "toPromise failed" )
        deepEqual( await tri<number>( () => { throw new Error( 'OK' )} ).toPromise.catch( () => 2 ), 2, "toPromise failed" )
    } )

    it( 'transform', ( done: MochaDone ) => {
        deepEqual( tri( () => 2 ).transform( ( e: Error ) => tri( () => 3 ), ( v: number ) => tri( () => v * 2 ) ).get, 4, "transform failed" )
        deepEqual( tri( () => {throw new Error( 'OK' )} ).transform( ( e: Error ) => tri( () => 3 ), ( v: number ) => tri( () => v * 2 ) ).get, 3, "transform failed" )
        done()
    } )

    it( 'should be a monad', ( done: MochaDone ) => {
        //Monad Laws
        const f = ( x: number ) => tri( () => x * x );
        const g = ( x: number ) => tri( () => x + 2 );
        deepEqual( tri( () => 3 ).flatMap( f ).get, f( 3 ).get, "1st Monad Law" )
        deepEqual( tri( () => 2 ).flatMap( ( x: number ) => tri( () => x ) ).get, tri( () => 2 ).get, "2nd Monad Law" )
        deepEqual( tri( () => 4 ).flatMap( ( x: number ) => f( x ).flatMap( g ) ).get, tri( () => 4 ).flatMap( f ).flatMap( g ).get, "3rd Monad Law" )
        done()
    } )

    it( 'should be lazy', ( done: MochaDone ) => {

        let count = 0
        const f = (): number => {
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

    it( 'example', ( done: MochaDone ) => {

        function divide( numerator: any, denominator: any ): Try<number> {
            const parseNumerator = () => option( parseFloat( numerator ) ).orThrow( () => "Please provide a valid numerator" );
            const parseDenominator = () => option( parseFloat( denominator ) ).orThrow( () => "Please provide a valid denominator" );
            return tri( parseNumerator ).flatMap( num => tri( parseDenominator ).map( den => num / den ) )
        }

        deepEqual( divide( 6, 3 ).get, 2, 'example failed' )
        deepEqual( divide( 6, 0 ).get, Infinity, 'example failed' )
        deepEqual( divide( "blah", 3 )
                       .recover( ( e: Error ) => {
                           deepEqual( e.message.indexOf("numerator") !== -1, true, 'example failed' )
                           return Infinity
                       } )
                       .get,
                   Infinity, 'example failed' )
        deepEqual( divide( 6, "blah" )
                       .recover( ( e: Error ) => {
                           deepEqual( e.message.indexOf("denominator") !== -1, true, 'example failed' )
                           return Infinity
                       } )
                       .get,
                   Infinity, 'example failed' )

        done()
    } )

} )



