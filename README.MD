MM
===

**A few  Missing Monads for Javascript and Typescript.**

  - `Option` (aka Maybe): represents optional values and avoids ugly tests for `null`, `undefined` or `NaN`
  - `Seq`: an ordered sequence of values with numerous methods to manipulate it
  - `Range`: numeric values in range [start;end) with non-zero step value step
  - `Try`: a computation that may either result in an error, or return a successfully computed value and that may be easily chained with other computations

A small library that implements a few useful Monads for functional programming.
 - no external dependencies
 - works with ES5
 - based on iterators with lazy evaluation
 - largely inspired from Scala
 - typings automatically loaded when programming in Typescript
 - excellent tests coverage


**Write shorter immutable code**
 
 Instead of 
 
 ```javascript
 let value;
 if (typeof input === 'undefined' || input === null) {
     value = getDefaultValue()
 }
 else {
    value = calculateFromInput(input)
 }
```

write

```javascript
const value = option(input).map(calculateFromInput).getOrElse(getDefaultValue) 
```
  
**Write lazy evaluated code**
  
```javascript
seq(hugeArray).drop(2).map(expensiveOp).takeFirst(3)
  
```
is not evaluated (iterated) until `toArray` is called on it, and when it is, only five iterations on the Seq and 3 calls to `map` are performed
  
Usage
-----

*Typescript / ES6*: `import { some, seq, .. } from 'm.m'`

*ES5* `var MM = require('m.m')`

License
-------

MIT

TODO, Contributing, etc..
--------------------------

Most Wanted: `Either`,...

You are most welcome to contribute by opening new Pull Requests.
For new Monads, please get inspiration from the Scala definitions and extend `Collection` for the implementation


API
===


Option
------

Represents optional values.

```typescript

/**
 * Creates a None, i.e. an empty Option
 */
function none(): Option<A>

/**
 * Create a Some i.e. an Option holding a value
 */
function some<A>( value?: A ): Option<A>

/**
 * Create a None if value is undefined or null or NaN
 * otherwise create a Some holding that value
 */
function option<A>(value?: A): Option<A>
```

The most idiomatic way to use an Option is to treat it as a collection or monad and use `map`, `flatMap`, `filter`, or `foreach`:

```typescript
const name = option( request.getParameter('name') )
const upper = name.map( n => n.trim() ).filter( n => n.length !== 0 ).map( n => n.toUpperCase() )
console.log(upper.getOrElse( () =>  "" ) )
```

Seq
---
A Seq is an ordered sequence of values

```typescript
/**
 * Create a Seq
 */
function seq<A>( ...values: any[]  ): Seq<A>
```

 A `Seq` can be created from

   - a list of disctrete values e.g. `seq( 1, 2, 3 )`
   - any `Iterable` including an Array, a String, another `Seq`, an ES6 `Map`, etc... e.g. `seq( [1 ,2, 3] )`, `seq('abcd')`


 Examples:

  ```typescript
  seq('dlroW olleH').reverse.mkString(' ')    // 'H e l l o   W o r l d'

  seq(1, 2, 'a', 3, 'b', 4).collect( n => !isNaN(n) )( n => n*2 ).mkString('[', ',', ']')    // '[2,4,6,8]'

  seq( seq( [1, 2] ), 3, seq( 4, 5 ) ).flatten().toArray // [ 1, 2, 3, 4, 5 ]
  ```

Range
-----
The Range class represents numeric values in range with non-zero step value step.
A Range is a special case of Seq.

```typescript
/**
 * Create a range of integers of the specified length starting at 0
 */
export function range( length: number ): Range;

/**
 * Create a range from the specified start to the element (end - 1) included in steps of 1
 */
export function range( start: number, end: number ): Range

/**
 * Create a range from start to (end - step) included
 */
export function range( start: number, end: number, step: number ): Range
```

Ranges are not indexed but based on (lazy) iterators; it is therefore possible to manipulate `Infinity` in Ranges:
```javascript
range(0, Infinity).take(10).toArray   //[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
 ```

Try
---
A Try represents a computation that may either result in an error, or return a successfully computed value.

A computation can be created by passing function without arguments to `tri()`.

```typescript
/**
 * Wraps this computation in a Try
 */
function tri<A>( computation: ( ) => A ): Try<A>
```
Please note that the function is spelled with an 'i' to avoid a conflict with the reserved keyword `try`

As with other monads of this library, `Try` is lazy and the computation will only be performed when attempting to "extract" a result.

What is interesting with `Try` is the ability to chain error throwing functions with a fail fast behavior, and
potentially recover from these error(s)

```typescript
function divide( numerator: any, denominator: any ): Try<number> {

    const parseNumerator = () => option( parseFloat( numerator ) ).orThrow( () => "Invalid numerator" );
    const parseDenominator = () => option( parseFloat( denominator ) ).orThrow( () => "Invalid denominator" );

    //chain error throwing functions
    return tri( parseNumerator ).flatMap( num => tri( parseDenominator ).map( den => num / den ) )
}

//now, divide(), can itself be chained
divide(num, den).map(x => x*2)

//or can be "recovered" from

divide( num, den )
    .recover( ( e: Error ) => {
                console.log('Divide failed. '+e.message+'. Returning Infinity')
                return Infinity
            } )
   .get

//divide('blah',3) -> Infinity

```
