M
==

**The missing Monads for Javascript and Typescript.** 

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
  alist(hugeArray).dropAt(2).map(expensiveOp).takeFirst(3)
  
  ```
  is not evaluated (iterated) until `toArray` is called on it, and when it is, only five iterations and 3 calls to `map` are performed 
  
Usage
-----

*Typescript / ES6*: `import { some, list, .. } from 'M'`

*ES5* `const M = require('M')`

License
-------

MIT

TODO, Contributing, etc..
--------------------------

Most Wanted: [enrich](./SeqAdditional.MD) `Seq`, `List` unit tests, `Range`, `Future`, `Try`,... 

I work on this library sporadically.

You are most welcome to contribute by opening new Pull Requests.
For new Monads, please get inspiration from the Scala definitions and try extending `Seq`

  
API
===
  
Seq
---

A Seq is an ordered sequence of values that are expected to be traversed in one direction or both. 

```
/**
/**
 * Create a Seq from one or two iterators and optionally specify its length
 */
function seq<A>( fit?: () => Iterator<A>, bit?: () =>Iterator<A>, length?: number ): Seq<A>
 
/**
* Create a seq from a list of values
*/
function aseq<A>( ...vals: A[] ): Seq<A> 


/**
 * Create a Seq from an Iterable
 */
function fseq<A>( it: Iterable<A> ): Seq<A> 

```
[Seq Interface](./typescript/API/Seq.ts) 

List
----

A List is a Seq that is expected to be traversed in the two directions.

```

/**
 * Create a list from rest parameters
 */
function list<A>( ...vals: A[] ): List<A>

/**
 * Create a list from an array
 */
function alist<A>( array: A[] ): List<A> 

/**
 * Create a list from an iterable
 */
function flist<A>( it: Iterable<A> ): List<A> 

```
[List Interface](./typescript/API/List.ts) 
  
Option
------

```
/**
 * Create a `None` if `value` is `undefined` or `null`
 * otherwise create a `Some` holding that value
 */
function option<A>(value?: A): Option<A> 

/**
 * Create a `Some` holding the value
 */
function some<A>( value?: A ): Some<A>

/**
 * Create a `Some` from an `Iterable`
 */
function fsome<A>( it: Iterable<A> ): Some<A>

/**
 * Creates a `None`
 */
function none(): None 

```

[Option Interface](./typescript/API/Option.ts) 

