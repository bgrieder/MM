

All methods that could be implemented on `Seq`

```
    //Tests whether this sequence contains a given sequence as a slice.
    def containsSlice[B](that: GenSeq[B]): Boolean

    def fold[A1 >: A](z: A1)(op: (A1, A1) ⇒ A1): A1

    //Folds the elements of this traversable or iterator using the specified associative binary operator.
    def foldLeft[B](z: B)(f: (B, A) ⇒ B): B

    //Applies a binary operator to a start value and all elements of this sequence, going left to right.
    def foldRight[B](z: B)(op: (A, B) ⇒ B): B

    //Applies a binary operator to all elements of this list and a start value, going right to left.
    def forall(p: (A) ⇒ Boolean): Boolean

    //Tests whether a predicate holds for all elements of this sequence.
    //final def foreach(f: (A) ⇒ Unit): Unit

    //[use case] Applies a function f to all elements of this list.
    def genericBuilder[B]: Builder[B, List[B]]

    //The generic builder that builds instances of Traversable at arbitrary element types.
    def groupBy[K](f: (A) ⇒ K): Map[K, List[A]]

    //Partitions this traversable collection into a map of traversable collections according to some discriminator function.
    def grouped(size: Int): Iterator[List[A]]

    //Partitions elements in fixed size iterable collections.
    def hasDefiniteSize: Boolean

    //Tests whether this traversable collection is known to have a finite size.
    def hashCode(): Int

    //Hashcodes for Seq produce a value from the hashcodes of all the elements of the sequence.
    def head: A

    //Selects the first element of this iterable collection.
    def headOption: Option[A]

    //Optionally selects the first element.
    def indexOf(elem: A, from: Int): Int

    //    [use case] Finds index of first occurrence of some value in this list after or at some start index.
    def indexOf(elem: A): Int

    //    [use case] Finds index of first occurrence of some value in this list.
    def indexOfSlice[B >: A](that: GenSeq[B], from: Int): Int

    //Finds first index after or at a start index where this sequence contains a given sequence as a slice.
    def indexOfSlice[B >: A](that: GenSeq[B]): Int

    //Finds first index where this sequence contains a given sequence as a slice.
    def indexWhere(p: (A) ⇒ Boolean, from: Int): Int

    //Finds index of the first element satisfying some predicate after or at some start index.
    def indexWhere(p: (A) ⇒ Boolean): Int

    //Finds index of first element satisfying some predicate.
    def indices: Range

    //Produces the range of all indices of this sequence.
    def init: List[A]

    //Selects all elements except the last.
    def inits: Iterator[List[A]]

    //Iterates over the inits of this traversable collection.
    def intersect(that: collection.Seq[A]): List[A]

    //[use case] Computes the multiset intersection between this list and another sequence.
    def isDefinedAt(x: Int): Boolean

    //Tests whether this sequence contains given index.

    //final def isTraversableAgain: Boolean

    //Tests whether this traversable collection can be repeatedly traversed.
    def iterator: Iterator[A]

    //Creates a new iterator over all elements contained in this iterable object.
    def last: A

    //Selects the last element.
    def lastIndexOf(elem: A, end: Int): Int

    //    [use case] Finds index of last occurrence of some value in this list before or at a given end index.
    def lastIndexOf(elem: A): Int

    //    [use case] Finds index of last occurrence of some value in this list.
    def lastIndexOfSlice[B >: A](that: GenSeq[B], end: Int): Int

    //Finds last index before or at a given end index where this sequence contains a given sequence as a slice.
    def lastIndexOfSlice[B >: A](that: GenSeq[B]): Int

    //Finds last index where this sequence contains a given sequence as a slice.
    def lastIndexWhere(p: (A) ⇒ Boolean, end: Int): Int

    //Finds index of last element satisfying some predicate before or at given end index.
    def lastIndexWhere(p: (A) ⇒ Boolean): Int

    //Finds index of last element satisfying some predicate.
    def lastOption: Option[A]

    //Optionally selects the last element.
    def length: Int

    //The length of the sequence.
    def lengthCompare(len: Int): Int

    //Compares the length of this sequence to a test value.
    def lift: (Int) ⇒ Option[A]

    //Turns this partial function into a plain function returning an Option result.
    //final def mapConserve(f: (A) ⇒ A): List[A]

    //[use case] Builds a new list by applying a function to all elements of this list.
    def max: A

    //    [use case] Finds the largest element.
    def maxBy[B](f: (A) ⇒ B): A

    //[use case] Finds the first element which yields the largest value measured by function f.
    def min: A

    //    [use case] Finds the smallest element.
    def minBy[B](f: (A) ⇒ B): A

    //[use case] Finds the first element which yields the smallest value measured by function f.
    def mkString: String

    //Displays all elements of this traversable or iterator in a string.
    def mkString(sep: String): String

    //Displays all elements of this traversable or iterator in a string using a separator string.
    def mkString(start: String, sep: String, end: String): String

    //Displays all elements of this traversable or iterator in a string using start, end, and separator strings.
    def nonEmpty: Boolean

    //Tests whether the traversable or iterator is not empty.
    def orElse[A1 <: Int, B1 >: A](that: PartialFunction[A1, B1]): PartialFunction[A1, B1]

    //Composes this partial function with a fallback partial function which gets applied where this partial function is not defined.
    def padTo(len: Int, elem: A): List[A]

    //[use case] A copy of this list with an element value appended until a given target length is reached.
    def par: ParSeq[A]

    //Returns a parallel implementation of this collection.
    def partition(p: (A) ⇒ Boolean): (List[A], List[A])

    //Partitions this traversable collection in two traversable collections according to a predicate.
    def patch(from: Int, that: GenSeq[A], replaced: Int): List[A]

    //[use case] Produces a new list where a slice of elements in this list is replaced by another sequence.
    def permutations: Iterator[List[A]]

    //Iterates over distinct permutations.
    def prefixLength(p: (A) ⇒ Boolean): Int

    //Returns the length of the longest prefix whose elements all satisfy some predicate.
    def product: A

    //    [use case] Multiplies up the elements of this collection.
    def productIterator: scala.Iterator[Any]

    //An iterator over all the elements of this product.
    def productPrefix: String

    //A string used in the toString methods of derived classes.
    def reduce[A1 >: A](op: (A1, A1) ⇒ A1): A1

    //Reduces the elements of this traversable or iterator using the specified associative binary operator.
    def reduceLeft[B >: A](f: (B, A) ⇒ B): B

    //Applies a binary operator to all elements of this sequence, going left to right.
    def reduceLeftOption[B >: A](op: (B, A) ⇒ B): Option[B]

    //Optionally applies a binary operator to all elements of this traversable or iterator, going left to right.
    def reduceOption[A1 >: A](op: (A1, A1) ⇒ A1): Option[A1]

    //Reduces the elements of this traversable or iterator, if any, using the specified associative binary operator.
    def reduceRight[B >: A](op: (A, B) ⇒ B): B

    //Applies a binary operator to all elements of this sequence, going right to left.
    def reduceRightOption[B >: A](op: (A, B) ⇒ B): Option[B]

    //Optionally applies a binary operator to all elements of this traversable or iterator, going right to left.
    def repr: List[A]

    //The collection of type traversable collection underlying this TraversableLike object.

    def reverseIterator: Iterator[A]

    //An iterator yielding elements in reversed order.
    def reverseMap[B](f: (A) ⇒ B): List[B]

    //[use case] Builds a new collection by applying a function to all elements of this list and collecting the results in reversed order.
    def reverse_:::(prefix: List[A]): List[A]

    //[use case] Adds the elements of a given list in reverse order in front of this list.
    def runWith[U](action: (A) ⇒ U): (Int) ⇒ Boolean

    //Composes this partial function with an action function which gets applied to results of this partial function.
    def sameElements(that: GenIterable[A]): Boolean

    //[use case] Checks if the other iterable collection contains the same elements in the same order as this list.
    def scan[B >: A, That](z: B)(op: (B, B) ⇒ B)(implicit cbf: CanBuildFrom[List[A], B, That]): That

    //Computes a prefix scan of the elements of the collection.
    def scanLeft[B, That](z: B)(op: (B, A) ⇒ B)(implicit bf: CanBuildFrom[List[A], B, That]): That

    //Produces a collection containing cumulative results of applying the operator going left to right.
    def scanRight[B, That](z: B)(op: (A, B) ⇒ B)(implicit bf: CanBuildFrom[List[A], B, That]): That

    //Produces a collection containing cumulative results of applying the operator going right to left.
    def segmentLength(p: (A) ⇒ Boolean, from: Int): Int

    //Computes length of longest segment whose elements all satisfy some predicate.
    def seq: LinearSeq[A]

    //A version of this collection with all of the operations implemented sequentially (i.e., in a single-threaded manner).
    def size: Int

    //The size of this sequence, equivalent to length.
    def sliding(size: Int, step: Int): Iterator[List[A]]

    //Groups elements in fixed size blocks by passing a "sliding window" over them (as opposed to partitioning them, as is done in grouped.)
    def sliding(size: Int): Iterator[List[A]]

    //Groups elements in fixed size blocks by passing a "sliding window" over them (as opposed to partitioning them, as is done in grouped.) "Sliding window" step is 1 by default.
    def sortBy[B](f: (A) ⇒ B)(implicit ord: math.Ordering[B]): List[A]

    //Sorts this Seq according to the Ordering which results from transforming an implicitly given Ordering with a transformation function.
    def sortWith(lt: (A, A) ⇒ Boolean): List[A]

    //Sorts this sequence according to a comparison function.
    def sorted[B >: A](implicit ord: math.Ordering[B]): List[A]

    //Sorts this sequence according to an Ordering.
    //final def span(p: (A) ⇒ Boolean): (List[A], List[A])

    //Splits this list into a prefix/suffix pair according to a predicate.
    def splitAt(n: Int): (List[A], List[A])

    //Splits this list into two at a given position.
    def startsWith[B](that: GenSeq[B], offset: Int): Boolean

    //Tests whether this sequence contains the given sequence at a given index.
    def startsWith[B](that: GenSeq[B]): Boolean

    //Tests whether this general sequence starts with the given sequence.
    def stringPrefix: String

    //Defines the prefix of this object's toString representation.
    def sum: A

    //    [use case] Sums up the elements of this collection.
    def tail: List[A]

    //Selects all elements except the first.
    def tails: Iterator[List[A]]

    //Iterates over the tails of this traversable collection.
    def take(n: Int): List[A]

    //Selects first n elements.
    def takeRight(n: Int): List[A]

    //Selects last n elements.
    //final def takeWhile(p: (A) ⇒ Boolean): List[A]

    //Takes longest prefix of elements that satisfy a predicate.
    def to[Col[_]]: Col[A]

    //[use case] Converts this list into another by copying all elements.
    def toBuffer[B >: A]: Buffer[B]

    //Uses the contents of this traversable or iterator to create a new mutable buffer.
    def toIndexedSeq: IndexedSeq[A]

    //Converts this traversable or iterator to an indexed sequence.
    def toIterable: collection.Iterable[A]

    //Returns this iterable collection as an iterable collection.
    def toIterator: Iterator[A]

    //Returns an Iterator over the elements in this iterable collection.
    def toList: List[A]

    //Converts this list to a list.
    def toMap[T, U]: collection.Map[T, U]

    //[use case] Converts this list to a map.
    def toParArray: ParArray[T]
    def toSeq: Seq[A]

    //Converts this immutable sequence to a sequence.
    def toSet[B >: A]: Set[B]

    //Converts this traversable or iterator to a set.
    def toStream: Stream[A]

    //Converts this list to a stream.
    def toString(): String

    //Converts this sequence to a string.
    def toTraversable: collection.Traversable[A]

    //Converts this traversable collection to an unspecified Traversable.
    def toVector: scala.Vector[A]

    //Converts this traversable or iterator to a Vector.
    def transpose[B](implicit asTraversable: (A) ⇒ GenTraversableOnce[B]): List[List[B]]

    //Transposes this collection of traversable collections into a collection of collections.
    def union(that: collection.Seq[A]): List[A]

    //[use case] Produces a new sequence which contains all elements of this list and also all elements of a given sequence.
    def unzip[A1, A2](implicit asPair: (A) ⇒ (A1, A2)): (List[A1], List[A2])

    //Converts this collection of pairs into two collections of the first and second half of each pair.
    def unzip3[A1, A2, A3](implicit asTriple: (A) ⇒ (A1, A2, A3)): (List[A1], List[A2], List[A3])

    //Converts this collection of triples into three collections of the first, second, and third element of each triple.
    def updated(index: Int, elem: A): List[A]

    //[use case] A copy of this list with one single replaced element.
    def view(from: Int, until: Int): SeqView[A, List[A]]

    //Creates a non-strict view of a slice of this sequence.
    def view: SeqView[A, List[A]]

    //Creates a non-strict view of this sequence.
    def withFilter(p: (A) ⇒ Boolean): FilterMonadic[A, List[A]]

    //Creates a non-strict filter of this traversable collection.
    def zip[B](that: GenIterable[B]): List[(A, B)]

    //[use case] Returns a list formed from this list and another iterable collection by combining corresponding elements in pairs.
    def zipAll[B](that: collection.Iterable[B], thisElem: A, thatElem: B): List[(A, B)]

    //[use case] Returns a list formed from this list and another iterable collection by combining corresponding elements in pairs.
    def zipWithIndex: List[(A, Int)]

    //[use case] Zips this list with its indices.
```

More...

```
def find(p: (A) ⇒ Boolean): Option[A]
//Finds the first element of the sequence satisfying a predicate, if any.


//final def collect[B](pf: PartialFunction[A, B]): List[B]
//[use case] Builds a new collection by applying a partial function to all elements of this list on which the function is defined.


def /:[B](z: B)(op: (B, A) ⇒ B): B
//Applies a binary operator to a start value and all elements of this traversable or iterator, going left to right.

def :\[B](z: B)(op: (A, B) ⇒ B): B
//Applies a binary operator to all elements of this traversable or iterator and a start value, going right to left.

def addString(b: StringBuilder): StringBuilder
//Appends all elements of this traversable or iterator to a string builder.

def addString(b: StringBuilder, sep: String): StringBuilder
//Appends all elements of this traversable or iterator to a string builder using a separator string.

def addString(b: StringBuilder, start: String, sep: String, end: String): StringBuilder
//Appends all elements of this traversable or iterator to a string builder using start, end, and separator strings.

def aggregate[B](z: ⇒ B)(seqop: (B, A) ⇒ B, combop: (B, B) ⇒ B): B
//Aggregates the results of applying an operator to subsequent elements.

def andThen[C](k: (A) ⇒ C): PartialFunction[Int, C]
//Composes this partial function with a transformation function that gets applied to results of this partial function.

def canEqual(that: Any): Boolean
//Method called from equality methods, so that user-defined subclasses can refuse to be equal to other collections of the same kind.

def collectFirst[B](pf: PartialFunction[A, B]): Option[B]
//Finds the first element of the traversable or iterator for which the given partial function is defined, and applies the partial function to it.

def combinations(n: Int): Iterator[List[A]]
//Iterates over combinations.

def companion: GenericCompanion[List]
//The factory companion object that builds instances of class List.

def compose[A](g: (A) ⇒ Int): (A) ⇒ A
//Composes two instances of Function1 in a new Function1, with this function applied last.

```