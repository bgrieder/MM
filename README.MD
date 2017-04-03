MM
===

**A few  Missing Monads for Javascript and Typescript.**

A small library that implements a few useful Monads for functional programming.
 - no external dependencies
 - based on iterators with lazy evaluation
 - largely inspired from Scala
 - typings automatically loaded when programming in Typescript
 
 
**Write shorter immutable code**
 
 Instead of 
 
 ```
 let value;
 if (typeof input === 'undefined' || input === null) {
     value = getDefaultValue()
 }
 else {
    value = calculateFromInput(input)
 }
```

write

```
const value = option(input).map(calculateFromInput).getOrElse(getDefaultValue) 
```
  
**Write lazy evaluated code**
  
```
seq(hugeArray).drop(2).map(expensiveOp).takeFirst(3)
  
```
is not evaluated (iterated) until `toArray` is called on it, and when it is, only five iterations on the Seq and 3 calls to `map` are performed
  
Usage
-----

*Typescript / ES6*: `import { some, seq, .. } from 'm.m'`

*ES5* `const MM = require('m.m')`

License
-------

MIT

TODO, Contributing, etc..
--------------------------

Most Wanted: `Try`, `Range`, `Try`,...

I work on this library sporadically.

You are most welcome to contribute by opening new Pull Requests.
For new Monads, please get inspiration from the Scala definitions and extend `Collection` for the implementation

  
API
===
  
Seq
---
A Seq is an ordered sequence of values

```
/**
 * Create a Seq
 */
function seq<A>( ...values: any[]  ): Seq<A>
```

 A `Seq` can be created from

   - a list of disctrete values e.g. `seq( 1, 2, 3 )`
   - any `Iterable` including an Array, another `Seq`, an ES6 `Map`, etc... e.g. `seq( [1 ,2, 3])`

  
Option
------

Represents optional values.

```

/**
 * Creates a None, i.e. an empty Option
 */
function none(): Option<A>

/**
 * Create a Some i.e. an Option holding a value
 */
function some<A>( value?: A ): Option<A>

/**
 * Create a None if value is undefined or null
 * otherwise create a Some holding that value
 */
function option<A>(value?: A): Option<A>
```

The most idiomatic way to use an Option is to treat it as a collection or monad and use `map`, `flatMap`, `filter`, or `foreach`:

```
const name = option( request.getParameter('name') )
const upper = name.map( n => n.trim() ).filter( n => n.length !== 0 ).map( n => n.toUpperCase() )
console.log(upper.getOrElse( () =>  "" ) )
```