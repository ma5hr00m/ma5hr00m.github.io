# Java Web Getting Deeper

> 阿菇的Java学习笔记第二篇，参考学习路线：https://roadmap.sh/java

![20231105233623](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231105233623.png)


## 范型 Generics

> Java Generic methods and generic classes enable programmers to specify, with a single method declaration, a set of related methods, or with a single class declaration, a set of related types, respectively.

范型意味着参数化类型。其思想是允许类型（整数、字符串等等，以及用户定义的类型）作为函数、类和接口的参数。使用范型，可以创建适用于不同数据类型的类、函数以及接口。

### 为什么使用范型

在Java中，`Object`是所有类的父类，`Object`引用可以引用任何对象。这种做法并不安全。

Java引入了范型，以便在编译时检查类型安全，并减少运行时错误。例如，如果你有一个`Object`引用，它指向一个`String`对象，但你尝试将其转换为`Integer`，则会抛出`ClassCastException`异常。这是因为`String`和`Integer`是不同的类，它们之间没有继承关系。使用范型可以确保类型匹配，从而避免此类运行时错误。

### 范型类型参数

- `T` - Type（Java 类）  
  表示一个通用的Java类型，可以是任意的类或接口。例如，`ArrayList<T>`表示一个存储任意类型的列表。
- `E` - Element（元素）  
  表示集合中的元素类型，通常用在集合类或迭代器中。例如，`Iterator<E>`表示一个遍历元素类型为E的集合的迭代器。
- `K` - Key（键）  
  表示映射中的键的类型，通常用在`Map`或`Entry`中。例如，`Map<K,V>`表示一个存储键类型为K和值类型为V的映射。
- `V` - Value（值）  
  表示映射中的值的类型，通常用在`Map`或`Entry`中。例如，`Map<K,V>`表示一个存储键类型为K和值类型为V的映射。
- `N` - Number（数值类型）  
  表示一个数值类型，可以是原始类型或包装类型。例如，`List<N>`表示一个存储数值类型的列表。
- `?` - 通配符（Wildcard）  
  表示一个未知的类型，可以是任意类型。通配符可以有上界或下界，表示类型的范围。例如，`List<? extends Number>`表示一个存储`Number`或其子类的列表，`List<? super Integer>`表示一个存储`Integer`或其父类的列表。

### 范型类

Java中一般使用`<>`声明范型类的参数类型，下面是一个简单的例子：

```java
// Java program to show working of user defined Generic classes

// We use < > to specify Parameter type
class Test<T> {
	// An object of type T is declared
	T obj;
	Test(T obj) { this.obj = obj; } // constructor
	public T getObject() { return this.obj; }
}

// Driver class to test above
class Main {
	public static void main(String[] args)
	{
		// instance of Integer type
		Test<Integer> iObj = new Test<Integer>(15);
		System.out.println(iObj.getObject());

		// instance of String type
		Test<String> sObj
			= new Test<String>("GeeksForGeeks");
		System.out.println(sObj.getObject());
	}
}

// 15 GeeksForGeeks
```

我们也可以在范型类中传递多个`Type`参数：

```java
// Java program to show multiple type parameters in Java Generics

// We use < > to specify Parameter type
class Test<T, U>
{
	T obj1; // An object of type T
	U obj2; // An object of type U

	// constructor
	Test(T obj1, U obj2)
	{
		this.obj1 = obj1;
		this.obj2 = obj2;
	}

	// To print objects of T and U
	public void print()
	{
		System.out.println(obj1);
		System.out.println(obj2);
	}
}

// Driver class to test above
class Main
{
	public static void main (String[] args)
	{
		Test <String, Integer> obj =
			new Test<String, Integer>("GfG", 15);

		obj.print();
	}
}
```

### 范型函数

我们还可以编写泛型函数，根据传递给泛型方法的参数类型，用不同类型的参数调用这些函数。

> 编译器负责处理每个方法，开发者不需要自己去做复杂的类型转换。

```java
// Java program to show working of user defined Generic functions

class Test {
	// A Generic method example
	static <T> void genericDisplay(T element)
	{
		System.out.println(element.getClass().getName()
						+ " = " + element);
	}

	// Driver method
	public static void main(String[] args)
	{
		// Calling generic method with Integer argument
		genericDisplay(11);

		// Calling generic method with String argument
		genericDisplay("GeeksForGeeks");

		// Calling generic method with double argument
		genericDisplay(1.0);
	}
}
```

### 仅引用类型

当我们声明范型类型实例时，传递给type的参数只能是引用类型，如果使用`int`等基本数据类型会在编译时报错。
我们可以使用基本数据类型的包装类来解决这个问题，比如`Integer`替换`int`，上面的代码中已经体现了。

同时，我们可以传入基本数据类型数组，因为数组是引用类型。

```java
// error
Test<int> obj = new Test<int>(20); 

// right
ArrayList<int[]> a = new ArrayList<>();
```

### 参数类型不同，范型不同

以下面的代码为例：

```java
// Java program to show working of user-defined Generic classes

// We use < > to specify Parameter type
class Test<T> {
	// An object of type T is declared
	T obj;
	Test(T obj) { this.obj = obj; } // constructor
	public T getObject() { return this.obj; }
}

// Driver class to test above
class Main {
	public static void main(String[] args)
	{
		// instance of Integer type
		Test<Integer> iObj = new Test<Integer>(15);
		System.out.println(iObj.getObject());

		// instance of String type
		Test<String> sObj
			= new Test<String>("GeeksForGeeks");
		System.out.println(sObj.getObject());
		iObj = sObj; // This results an error
	}
}
```

以上代码会报错：

```zsh
error:
 incompatible types:
 Test cannot be converted to Test 
```

在上面的代码中，`iObj`和`sObj`都是`Test<T>`范型实例，但它们是对不同类型的引用，因为它们的参数类型不同。
范型通过这种方式增强类型安全以避免报错。

### 优势

用范型肯定有好处。

1. 代码重用：我们可以只写一次方法/类/接口，然后用它来处理任何类型的数据。
2. 类型安全：泛型使错误在编译时而不是运行时出现（在编译时发现代码中的问题总比让代码在运行时失败要好）。假设你想创建一个`ArrayList`来存储学生的名字，如果程序员不小心添加了一个整数对象而不是字符串，编译器会允许这样做。但是，当我们从`ArrayList`中取出这些数据时，就会出现运行时的问题。
3. 不需要单独的类型转换：如果我们不使用泛型，那么在上面的例子中，每次从`ArrayList`中取出数据，我们都必须进行类型转换。每次取出操作都进行类型转换是非常麻烦的。如果我们已经知道我们的列表只存储字符串数据，我们就不需要每次都进行类型转换。
4. 实现泛型算法：通过使用泛型，我们可以实现可以处理不同类型对象的算法，并且同时保证类型安全。


## 集合框架 Collection Framework
> The Collection in Java is a framework that provides an architecture to store and manipulate the group of objects. Java Collections can achieve all the operations that you perform on a data such as searching, sorting, insertion, manipulation, and deletion.

任何由多个独立对象构成的组都可以视为独立的单元。在Java中，这样的一个独立单元被称为一个 *对象集合*。

`JDK1.2`中定义了一个名为 `Collection Fraework` 的独立框架，该框架包含所有的集合类和集合接口。集合接口（`java.util.Collection`）和映射接口（`java.util.Map`）是Java集合类的两个主要“根”接口。

![Java集合框架图](https://www.runoob.com/wp-content/uploads/2014/01/2243690-9cd9c896e0d512ed.gif)

> 目前看不懂这张图 😢

### 什么是框架

框架是一种软件开发的工具，它提供了一些现成的类和接口，让开发者可以直接使用或者扩展，而不需要从零开始编写代码。框架中的类和接口通常遵循一定的设计模式和规范，以保证代码的质量和可维护性。

使用框架的好处是，它可以节省开发时间和成本，提高代码的复用性和可靠性，降低出错的风险，以及方便与其他开发者协作。框架通常针对特定的领域或功能，比如网络开发、数据库操作、图形界面、测试等，提供了一些常用的功能和组件，让开发者可以专注于业务逻辑和需求，而不需要关心底层的细节和实现。

当然，并不是说使用框架就不需要编写任何代码了。框架只是提供了一个基础的架构和模板，开发者还需要根据自己的需求来实现新的功能或类，或者对框架中的类和接口进行修改和扩展。

> In order to implement a new feature or a class, there is no need to define a framework.

### 优势

- 提供一致的`API`  
  `API`有一套基本的接口，如`Collection`、`Set`、`List`或`Map`，所有实现了这些接口的类，如`ArrayList`、`LinkedList`、`Vector`等，都有一些共同的方法。
- 减少工作量  
  程序员不必担心集合的设计，而只需关注如何在程序中最佳地使用集合。因此，面向对象编程的基本概念（即抽象）得到了成功的实现。
- 提高程序速度和质量  
  通过提供高性能的数据结构和算法的实现，提高了程序的性能，因为在这种情况下，程序员不需要考虑特定数据结构的最佳实现。他只需使用最佳的实现，就可以大幅提升他的算法/程序的性能。

### 结构层次

`java.util` 包含了所有集合框架需要的类和接口。集合框架提供了一个迭代器接口，这个接口可以迭代遍历所有集合。迭代器接口由主集合接口扩展，主集合接口充当集合框架的根。所有集合都扩展了迭代器接口，从而扩展了其的属性和的方法。

![20231106111353](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231106111353.png)

Java集合框架主要包括以下几个部分：

- 接口  
  是代表集合的抽象数据类型。例如`Collection`、`List`、`Set`、`Map`等。它们定义了集合的基本操作和属性，如添加、删除、遍历、大小等。
- 实现类  
  是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：`ArrayList`、`LinkedList`、`HashSet`、`HashMap`等。它们提供了不同的性能和特点。
- 算法  
  是实现集合接口的对象里的方法执行的一些有用的计算，例如：排序、搜索、复制、最大值、最小值等。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。

### 案例

使用`List`接口的例子。`List`是一个有序的集合，可以包含重复的元素。

```java
import java.util.List;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();  // 使用ArrayList实现
        list.add("Hello");
        list.add("World");
        System.out.println(list.get(0));  // 输出 "Hello"
    }
}
```

使用`HashSet`的例子。`HashSet`是一个不包含重复元素的集合。

```java
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();  // 使用HashSet实现
        set.add("Hello");
        set.add("World");
        set.add("Hello");
        System.out.println(set.size());  // 输出 2，因为"Hello"只被计算一次
    }
}
```

使用`Collections.sort()`方法排序`ArrayList`的例子。`Collections`类提供了一系列静态方法实现对各种集合的操作。

```java
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(5);
        list.add(1);
        list.add(3);
        Collections.sort(list);  // 排序
        System.out.println(list);  // 输出 [1, 3, 5]
    }
}
```


## 流 Streams
> Java provides a new additional package in Java 8 called java.util.stream. This package consists of classes, interfaces and enum to allows functional-style operations on the elements. You can use stream by importing java.util.stream package.

Java的Stream是一种抽象的数据操作接口，允许开发者以声明性的方式处理数据，无需关心数据的内部实现和处理过程。

- `Stream`不是一个数据结构，而是从集合、数组或I/O通道中获取输入。
- 它不会改变原始的数据结构，而是根据管道方法提供结果。
- 每个中间操作都是延迟执行的，并返回一个流作为结果，因此可以将多个中间操作进行管道化。终端操作标志着流的结束并返回结果。


### 流式处理

流式处理（Stream Processing）是一种数据处理的模式，它将数据分为连续的、有序的数据流，并在数据流上进行逐个处理。在流式处理中，数据被分为一系列的数据项，每个数据项都经过一系列的操作进行处理，最终得到所需的结果。

流中有两种类型的操作：中间操作（Intermediate Operations）和终止操作（Terminate Operations）。中间操作是对流进行转换和处理的操作，而终端操作是触发流处理并生成结果的操作。

![20231106141519](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231106141519.png)

### 中间操作 Intermediate Operations

当我们在Java中使用Stream进行流式处理时，中间操作是对流进行转换和处理的步骤。本质上是对流中的元素进行操作，生成一个新的流，用于在流的处理过程中对元素进行过滤、映射、排序等操作，以便得到我们所需的结果。

下面举一些比较重要的中间操作的例子。

#### map()

使用`map()`方法可以对流中的每个元素应用一个函数，将其转换为另一个值。

```java
// 对一个整数列表中的每个元素进行平方操作，并将结果收集到一个新的列表中。
List number = Arrays.asList(2,3,4,5);
List square = number.stream().map(x->x*x).collect(Collectors.toList());
```

#### filter()

使用`filter()`方法可以根据指定的条件筛选流中的元素，只保留满足条件的元素。

```java
// 保留以字母"S"开头的字符串，即筛选出流中以"S"开头的元素，并将它们收集到一个新的列表中
List names = Arrays.asList("Reflection","Collection","Stream");
List result = names.stream().filter(s->s.startsWith("S")).collect(Collectors.toList());
```

#### sorted()

使用`sorted()`方法可以对流中的元素进行排序操作。

```java
// 将对字符串列表进行字母顺序排序，排序后的结果将被收集到一个新的列表中。
List names = Arrays.asList("Reflection","Collection","Stream");
List result = names.stream().sorted().collect(Collectors.toList());
```

#### flagMap()

使用`flatMap()`方法可以将流中的每个元素转换为一个新的流，并将所有新的流合并成一个流。

> 这在处理嵌套的数据结构时特别有用。

```java
// 将一个包含多个列表的流扁平化为一个单独的流。
List<List<Integer>> numbers = Arrays.asList(Arrays.asList(1, 2), Arrays.asList(3, 4), Arrays.asList(5, 6));
List<Integer> flattenedNumbers = numbers.stream()
                                        .flatMap(List::stream)
                                        .collect(Collectors.toList());
System.out.println(flattenedNumbers);  // 输出：[1, 2, 3, 4, 5, 6]

```

#### `distinct()`

使用`distinct()`方法可以去除流中的重复元素，根据元素的`equals()`方法进行判断。

```java
// 去除一个整数流中的重复元素。
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 4, 5);
List<Integer> distinctNumbers = numbers.stream()
                                       .distinct()
                                       .collect(Collectors.toList());
System.out.println(distinctNumbers);  // 输出：[1, 2, 3, 4, 5]

```

### 终止操作 Terminate Operations

终止操作是返回结果的操作类型。这些操作不会进一步处理，只是返回一个最终结果值。

#### collect()

`collect()`方法用于将Stream中的元素收集到一个集合或者其他数据结构中。

```java
// 将每个元素的平方值添加到Set中
List number = Arrays.asList(2,3,4,5,3);
Set square = number.stream().map(x->x*x).collect(Collectors.toSet());
```

#### forEach()

`forEach()`方法用于对Stream中的每个元素执行指定的操作。

```java
// 对每个元素进行平方操作，并将结果打印到控制台
List number = Arrays.asList(2,3,4,5);
number.stream().map(x->x*x).forEach(y->System.out.println(y));
```

#### reduce()

`reduce()`方法用于将Stream中的元素进行归约操作，将多个元素合并为一个结果。

```java
// 对元素进行过滤，只保留偶数，并将它们相加得到最终结果
List number = Arrays.asList(2,3,4,5);
int even = number.stream().filter(x->x%2==0).reduce(0,(ans,i)-> ans+i);
```

### 惰性执行
`Stream`的惰性执行是指中间操作只是定义了一个操作规则，而不会立即对数据源进行处理，只有当遇到终止操作时，才会触发Stream开始流式处理。这样可以提高Stream的性能，避免不必要的计算和内存占用，允许流在处理大量数据时进行优化操作。

惰性执行的特点允许实现无限流，即可以对一个无穷大的数据源进行操作，只要限制终止操作的范围。例如，以下的代码可以生成一个无限的自然数流，然后取出前10个偶数：

```java
Stream.iterate(1, n -> n + 1) // 生成无限自然数流
    .filter(n -> n % 2 == 0) // 惰性操作，筛选偶数
    .limit(10) // 惰性操作，限制元素个数
    .forEach(System.out::println); // 终止操作，打印输出
```

### 示范

:::details 示范代码
```java
// Java program to demonstrate the use of stream in java
import java.util.*;
import java.util.stream.*;

class Demo {
	public static void main(String args[])
	{
		// create a list of integers
		List<Integer> number = Arrays.asList(2, 3, 4, 5); 

		// demonstration of map method
		List<Integer> square 
		= number.stream()
			.map(x -> x * x)
			.collect(Collectors.toList());

		// create a list of String
		List<String> names = Arrays.asList(
			"Reflection", "Collection", "Stream");

		// demonstration of filter method
		List<String> result
		= names.stream()
			.filter(s -> s.startsWith("S"))
			.collect(Collectors.toList());
	
		System.out.println(result);

		// demonstration of sorted method
		List<String> show 
		= names.stream()
			.sorted()
			.collect(Collectors.toList());
	
		System.out.println(show);

		// create a list of integers
		List<Integer> numbers
			= Arrays.asList(2, 3, 4, 5, 2);

		// collect method returns a set
		Set<Integer> squareSet
		= numbers.stream()
			.map(x -> x * x)
			.collect(Collectors.toSet());
	
		System.out.println(squareSet);

		// demonstration of forEach method
		number.stream()
			.map(x -> x * x)
			.forEach(y -> System.out.println(y));

		// demonstration of reduce method
		int even 
		= number.stream()
			.filter(x -> x % 2 == 0)
			.reduce(0, (ans, i) -> ans + i);

		System.out.println(even);
	}
}
```

输出结果：
```zsh
[4, 9, 16, 25]
[Stream]
[Collection, Reflection, Stream]
[16, 4, 9, 25]
4
9
16
25
6
```
:::

### 注意

还有些奇奇怪怪的注意点，大部分上面都已经涉及到了：

1. 流由一个源（如集合、数组或 I/O 资源）以及零个或多个中间方法组合（串联）而成，最后是一个终端方法来处理从源获取的对象。
2. 流的操作是惰性执行的。即在调用终端方法之前，中间方法不会立即执行，而是等待终端方法的触发。
3. 流的操作不会改变原始对象的值。中间方法和终端方法的操作都是基于流中的元素进行的，不会修改原始对象本身。
4. 流可以并行处理。流提供了并行处理的能力，可以自动将操作并行化以提高处理速度，比如通过调用`parallel()`方法，可以将流转换为并行流，在多个线程上并行执行操作。



## JVM运行原理 How JVM Works
> The Java Virtual Machine is a program whose purpose is to execute other programs. JVMs are available for many hardware and software platforms (i.e. JVM is platform dependent). JVM is the one that actually calls the main method present in a java code. JVM is a part of JRE(Java Runtime Environment)

:::tip
暂时跳转之前的学习笔记：[Java 运行原理](/posts/java/how-java-run)
:::


## 内存管理 Memory Management
> In Java, memory management is the process of allocation and de-allocation of objects, called Memory management.

JVM自带内存管理功能，不需要开发者进行显式干预。垃圾收集器本身会确保未使用的空间得到清理，并在不需要时释放内存。那我们为什么要学习内存管理？

很简单，JVM自带的内存管理功能并不能保证一切都安然无恙，有些对象不符合自动回收的条件，会悄悄地浪费我们的计算机资源。Java开发者有必要学习内存管理，以实现高性能的程序，避免崩溃；即使发生崩溃也要知道该如何去修复Web服务。

> 内存泄漏可能造成服务性能下降、程序/系统崩溃、资源泄漏等严重问题。

无论在什么编程语言中，内存都是一种重要且稀缺的资源。因此，有必要对内存进行彻底的管理，避免任何泄漏。内存的分配和释放是一项关键任务，需要非常小心和慎重。然而，Java与其他编程语言不同，JVM（Java虚拟机），具体来说是垃圾收集器，负责管理内存分配，程序员不需要关心这个过程。而在其他编程语言（如C）中，程序员直接访问内存，并在代码中分配内存，从而为内存泄漏创造了很多机会。

### 内存结构

JVM在运行Java程序时，会根据Java虚拟机规范，将其管理的内存划分为几个不同的部分，每个部分有不同的名称和功能，这些部分就是运行时数据区域。运行时数据区域是Java程序运行所需要的数据和信息的存储空间，例如类信息、对象实例、方法调用、变量值等。

![20231106152924](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231106152924.png)

运行时数据区域可以分为两种类型，一种是由JVM负责创建和销毁的，这些区域是所有线程共享的，也就是说，不同的线程可以访问和修改这些区域中的数据。另一种是由线程负责创建和销毁的，这些区域是线程私有的，也就是说，每个线程都有自己的这些区域，其他线程不能访问和修改这些区域中的数据。

- 由JVM创建和销毁的运行时数据区域的生命周期与JVM的生命周期一致，只有在JVM启动时才会创建这些区域，只有在JVM退出时才会销毁这些区域。这些区域不会因为线程的开始和结束而改变。例如，方法区和堆就是由JVM创建和销毁的运行时数据区域，它们是所有线程共享的，用于存储类信息、常量、静态变量、对象实例和数组等数据。
- 由线程创建和销毁的运行时数据区域的生命周期与线程的生命周期一致，只有在线程开始时才会创建这些区域，只有在线程结束时才会销毁这些区域。这些区域不会因为JVM的启动和退出而改变。例如，程序计数器、虚拟机栈和本地方法栈就是由线程创建和销毁的运行时数据区域，它们是线程私有的，用于存储当前线程执行的字节码指令地址、方法调用的相关信息和Native方法的相关信息等。

接下来按照Java内存区域的划分来分开介绍。

这五个部分在Java虚拟机（JVM）中扮演着不同的角色，下面是它们的作用和在Web开发中的实际使用场景的详细说明：

#### 堆 Heap
堆是用于存储动态分配的对象的区域。所有通过`new`关键字创建的对象都存储在堆中。
在Web开发中，堆常用于存储应用程序的对象实例，例如Servlet对象、会话对象和数据库连接对象等。堆的动态分配特性使得可以根据应用程序的需求来创建和销毁对象。

```java
public class User {
    private String name;
    private int age;

    // 构造方法和其他成员方法

    public static void main(String[] args) {
        User user = new User(); // 在堆中为User对象分配内存空间
        user.setName("John");
        user.setAge(25);
        // 其他操作...
    }
}
```

#### 方法区 Method Area
方法区是堆的逻辑部分，用于存储类结构、方法数据和静态变量等信息。
在Web开发中，方法区存储了应用程序的类定义、方法定义和静态变量等信息。这些信息在应用程序的整个生命周期内保持不变，因此可以在多个请求之间共享。

```java
public class DatabaseConnection {
    private static Connection connection; // 静态变量存储在方法区

    public static Connection getConnection() {
        if (connection == null) {
            // 创建数据库连接
            // ...
        }
        return connection;
    }

    // 其他方法和成员变量
}
```

#### JVM栈 JVM Stacks
JVM栈用于存储方法的数据和部分结果，包括局部变量、方法参数和返回值等。
在Web开发中，JVM栈用于处理请求和执行方法。每个请求都可以在独立的栈帧中执行，栈帧包含了方法的参数、局部变量和返回值等信息。

```java
public class Calculator {
    public int add(int a, int b) {
        int sum = a + b; // 局部变量sum存储在JVM栈中
        return sum;
    }

    public static void main(String[] args) {
        Calculator calculator = new Calculator();
        int result = calculator.add(5, 3);
        System.out.println(result);
    }
}
```

#### 本地方法栈 Native Method Stacks
本地方法栈用于存储非Java语言编写的方法的数据。
在Web开发中，本地方法栈主要用于与底层操作系统或其他非Java语言编写的库进行交互。例如，通过本地方法栈可以调用C/C++编写的本地库来实现高性能的图像处理或加密算法等功能。

```java
public class ImageProcessing {
    // 通过本地方法栈调用本地图像处理库
    public native void processImage(String imagePath);

    public static void main(String[] args) {
        ImageProcessing imageProcessing = new ImageProcessing();
        imageProcessing.processImage("image.jpg");
    }

    // 加载本地图像处理库
    static {
        System.loadLibrary("image_processing");
    }
}
```

#### 程序计数器 Program Counter
程序计数器存储当前线程正在执行的JVM指令的地址或本地指针。
程序计数器在Web开发中主要用于线程切换和指令执行。它可以帮助JVM跟踪线程的执行状态，确保每个线程按照正确的顺序执行指令。

```java
public class Counter {
    public static void main(String[] args) {
        int count = 0;
        for (int i = 0; i < 10; i++) {
            count++;
        }
        System.out.println(count);
    }
}
```


### 演示

```java
// 定义一个Person类
class Person {
    // 定义一个静态变量name，存储在方法区中
    public static String name = "Alice";
    // 定义一个实例变量age，存储在堆中的对象实例数据中
    public int age;

    // 定义一个构造方法，用于初始化对象
    public Person(int age) {
        this.age = age;
    }

    // 定义一个静态方法，用于打印name，存储在方法区中
    public static void printName() {
        System.out.println(name);
    }

    // 定义一个实例方法，用于打印age，存储在方法区中
    public void printAge() {
        System.out.println(age);
    }
}

// 定义一个测试类
public class Test {
    // 定义一个main方法，作为程序的入口，存储在方法区中
    public static void main(String[] args) {
        // 调用Person类的静态方法，不需要创建对象，直接通过类名访问
        Person.printName(); // 输出 Alice
        // 创建一个Person对象，使用new指令在堆中分配内存空间，并调用构造方法初始化对象
        Person p = new Person(18); // p是一个引用变量，存储在栈中，指向堆中的对象
        // 调用Person对象的实例方法，需要通过引用变量访问
        p.printAge(); // 输出 18
    }
}
```


## Garbage Collection
> Java garbage collection is the process by which Java programs perform automatic memory management. Java programs compile to bytecode that can be run on a Java Virtual Machine, or JVM for short. When Java programs run on the JVM, objects are created on the heap, which is a portion of memory dedicated to the program




## Basics of Threads
> A thread in Java is the direction or path that is taken while a program is being executed. Generally, all the programs have at least one thread, known as the main thread, that is provided by the JVM or Java Virtual Machine at the starting of the program’s execution

在操作系统中，线程通常被定义为一个轻量级的子进程，是进程的最小执行单元，也拥有独立的执行路径。
这些线程虽然使用共享内存，但它们独立运行，因此即使一个线程出现异常，也不会影响其他线程的工作。

<div align='center'>
    <img src='https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231106192259.png'>
</div>

上图为操作系统的共享内存中运行的不同线程。在操作系统的共享内存环境中，线程在进程内运行，线程之间会进行基于上下文的切换。操作系统中可以同时运行多个进程，每个进程又可以同时运行多个线程。多线程概念在游戏、动画等领域得到了广泛应用。

### 进程和线程

进程是操作系统分配资源的最小单位，它包含了程序的代码、数据和状态信息，以及一个或多个线程。
线程是操作系统调度的最小单位，它是进程中的一个执行流，共享进程的资源，但有自己的栈、寄存器和局部变量。

二者在很多方面存在区别：

- 资源：进程之间是相互独立的，每个进程都有自己的地址空间，进程之间的资源不共享，也不影响。线程之间是相互协作的，同一个进程的线程共享地址空间，线程之间的资源共享，也会相互影响。
- 开销：创建和销毁进程的开销比较大，因为涉及到资源的分配和回收，以及上下文的切换。创建和销毁线程的开销比较小，因为只需要分配一些栈空间和寄存器，以及少量的上下文切换。
- 通信：进程之间的通信需要借助操作系统提供的特殊机制，如管道、信号、消息队列、共享内存等，通信的效率和安全性都比较低。线程之间的通信可以直接通过共享内存和全局变量，通信的效率和安全性都比较高。
- 使用场景：多进程适合处理那些需要独立运行的、相互隔离的、不需要频繁交互的任务，例如网络服务器、数据库系统、科学计算等。多线程适合处理那些需要并发执行的、相互协作的、需要频繁交互的任务，例如图形界面、游戏、动画等。

### 多任务

为了方便用户，操作系统提供了多任务的功能，让用户可以在机器上同时执行多个操作。这种多任务可以通过两种方式实现：
1. 基于进程的多任务 *多进程*
2. 基于线程的多任务 *多线程*

### 多进程 & 多线程

多进程是指在操作系统中同时运行多个独立的进程。

每个进程都有自己独立的地址空间和系统资源，包括内存、文件描述符等。多进程之间通过进程间通信（IPC）来进行数据交换和同步。每个进程都有自己的代码段、数据段和堆栈段，它们之间相互隔离，一个进程的异常不会影响其他进程。然而，由于进程间切换的开销较大，因此多进程通常在需要独立的环境和资源隔离的场景中使用，例如服务器端的并发处理和任务分发。

多线程是指在同一个进程内同时运行多个线程。

所有线程共享进程的地址空间和系统资源，包括内存、文件描述符等。线程之间可以直接访问共享内存，因此线程之间的通信和数据交换更加方便快捷。多线程通过线程调度来实现并发执行，操作系统会在不同的线程之间进行上下文切换。然而，由于线程之间共享内存，需要进行同步和互斥操作，以避免数据竞争和不一致的状态。多线程通常在需要共享数据和资源、并发处理和提高系统响应性能的场景中使用，例如图形界面应用程序和多线程服务器。

### 为什么选择多线程

前面的基础知识稍微补补，我们就可以理解为什么要使用线程：因为它们具有轻量级的优势，可以以低成本在多个线程之间提供通信，从而有助于在共享内存环境中实现有效的多任务处理。

### 线程生命周期

Java中的线程生命周期是指线程的状态转换。

Java中，调用`Thread`的`start()`方法生成并执行一个线程实例，使得该线程实例进入可运行状态；
调用`Thread`的`sleep()`或者`wait()`方法，使进程进入不可运行状态；
线程从不可运行状态能返回到可运行状态开始执行语句，在退出`run()`进程时死亡。

一个线程的生命周期大致分为以下五种状态，这五种状态之间的关系如图所示：

- New
- Runnable
- Running
- Blocked(Non-runnable)
- Dead/Terminated

![20231106194938](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231106194938.png)

#### New
使用`Thread`类创建一个线程实例，此时的线程实例被定义为New状态。此时程序尚未开始运行。

#### Runnable
使用`start()`激活一个处于New状态的线程实例，使得其进入可运行状态随时准备执行代码，进入等待执行的线程队列。

#### Running
使用`run()`使一个处于可运行状态下的线程开始运行。运行状态意味着处理器（CPU）为线程分配了执行时间段。当调度程序选择可运行状态的线程进行执行时，它进入运行状态。

#### Blocked
当线程处于活动状态，即线程类对象存在，但无法被调度程序选择执行时，它进入阻塞状态。此时线程是不活动的。

#### Dead/Terminated
当线程的`run()`函数结束执行时，它会自动进入死亡状态；遇到不正常的事件时，比如遇到错误代码或什么异常，线程会异常终止，此时会进入死亡状态；当调用`stop()`函数时，线程也会进入死亡状态。

死亡状态下的线程不可再用。

> 就是我们常说的：“杀死某个进程”。

### 主线程

在Java中，主线程（Main Thread）是程序执行的起点，它是由Java虚拟机（JVM）创建的第一个线程。主线程负责执行程序的入口点，即`main()`方法。在主线程中，程序开始执行，创建其他线程（如果需要），并在主线程结束之前执行程序的最后一条语句。

虽然主进程是在程序启动时自动创建的，但它可以由一个`Thread`对象控制。我们可以调用方法`currentThread()`获得它的一个引用，`currentThread()`是`Thread`类的公有的静态成员。它的通常形式如下：

```java
static Thread currentThread()
```

该方法返回一个调用它的线程的引用。
一旦我们获得主线程的引用，就可以像控制其他线程那样控制主线程。
这里给出一个简单的示范代码，展示下如何控制我们程序的主进程：

:::details 控制Java程序主进程
```java
// 主类
public class MainThreadDemo {
    // 主方法
    public static void main(String[] args) {
        // 获取当前线程，即主线程
        Thread mainThread = Thread.currentThread();
        // 打印主线程的名称
        System.out.println("主线程的名称：" + mainThread.getName());
        // 设置主线程的名称为"my-main-thread"
        mainThread.setName("my-main-thread");
        // 打印主线程的新名称
        System.out.println("主线程的新名称：" + mainThread.getName());
        // 打印主线程的优先级
        System.out.println("主线程的优先级：" + mainThread.getPriority());
        // 设置主线程的优先级为最高（10）
        mainThread.setPriority(Thread.MAX_PRIORITY);
        // 打印主线程的新优先级
        System.out.println("主线程的新优先级：" + mainThread.getPriority());
        // 在主线程中执行一个循环
        for (int i = 0; i < 5; i++) {
            System.out.println("主线程执行循环：" + i);
        }
    }
}
```
输出结果：
```zsh
主线程的名称：main
主线程的新名称：my-main-thread
主线程的优先级：5
主线程的新优先级：10
主线程执行循环：0
主线程执行循环：1
主线程执行循环：2
主线程执行循环：3
主线程执行循环：4
```
:::

### 创建线程

#### 通过继承`Thread`类创建进程

```java
import java.io.*;
import java.util.*;

public class GFG extends Thread {
	// initiated run method for Thread
	public void run()
	{
		System.out.println("Thread Started Running...");
	}
	public static void main(String[] args)
	{
		GFG g1 = new GFG();

		// Invoking Thread using start() method
		g1.start();
	}
}
```
> 输出结果：
> ```
> Thread Started Running...
> ```


#### 通过拓展`Runnable`接口创建线程

```java
import java.io.*;
import java.util.*;

public class GFG implements Runnable {
	// method to start Thread
	public void run()
	{
		System.out.println(
			"Thread is Running Successfully");
	}

	public static void main(String[] args)
	{
		GFG g1 = new GFG();
		// initializing Thread Object
		Thread t1 = new Thread(g1);
		t1.start();
	}
}
```
> 输出结果
> ```
> Thread is Running Successfully
> ```

#### 使用`Thread(String name)`创建线程

```java
import java.io.*;
import java.util.*;

public class GFG {
	public static void main(String args[])
	{
		// Thread object created and initiated with data
		Thread t = new Thread("Hello Geeks!");

		// Thread gets started
		t.start();

		// getting data of Thread through String
		String s = t.getName();
		System.out.println(s);
	}
}
```
> 输出结果
> ```
> Hello Geeks!
> ```

#### 使用`Thread(Runnable r, String name)`创建线程

```java
import java.io.*;
import java.util.*;

public class GFG implements Runnable {
	public void run()
	{
		System.out.println(
			"Thread is created and running successfully...");
	}
	public static void main(String[] args)
	{
		// aligning GFG Class with Runnable interface
		Runnable r1 = new GFG();
		Thread t1 = new Thread(r1, "My Thread");
		// Thread object started
		t1.start();
		// getting the Thread with String Method
		String str = t1.getName();
		System.out.println(str);
	}
}
```
> 输出结果
> ```
> My Thread
> Thread is created and running successfully...
> ```

### 观察生命周期

运行实例代码以观察线程的生命周期。

:::details 观察生命周期的Java代码
```java
import java.io.*;
import java.util.*;

class GFG implements Runnable {
	public void run()
	{
		// implementing try-catch Block to set sleep state for inactive thread
		try {
			Thread.sleep(102);
		}
		catch (InterruptedException i1) {
			i1.printStackTrace();
		}
		System.out.println(
			"The state for t1 after it invoked join method() on thread t2"
			+ " " + ThreadState.t1.getState());

		// implementing try-catch block
		try {
			Thread.sleep(202);
		}
		catch (InterruptedException i2) {
			i2.printStackTrace();
		}
	}
}

// creation of ThreadState class  to implement Runnable interface
public class ThreadState implements Runnable {
	public static Thread t1;
	public static ThreadState o1;
	public static void main(String args[])
	{
		o1 = new ThreadState();
		t1 = new Thread(o1);
		System.out.println("post-spanning, state of t1 is"
						+ " " + t1.getState());
		// lets invoke start() method on t1
		t1.start();
		// Now,Thread t1 is moved to runnable state
		System.out.println(
			"post invoking of start() method, state of t1 is"
			+ " " + t1.getState());
	}
	public void run()
	{
		GFG g1 = new GFG();
		Thread t2 = new Thread(g1);
		// Thread is created and its in new state.
		t2.start();
		// Now t2 is moved to runnable state
		System.out.println(
			"state of t2 Thread, post-calling of start() method is"
			+ " " + t2.getState());
		// create a try-catch block to set t1 in waiting state
		try {
			Thread.sleep(202);
		}
		catch (InterruptedException i2) {
			i2.printStackTrace();
		}
		System.out.println(
			"State of Thread t2 after invoking to method sleep() is"
			+ " " + t2.getState());
		try {
			t2.join();
			System.out.println(
				"State of Thread t2 after join() is"
				+ " " + t2.getState());
		}
		catch (InterruptedException i3) {
			i3.printStackTrace();
		}
		System.out.println(
			"state of Thread t1 after completing the execution is"
			+ " " + t1.getState());
	}
}
```
运行结果：
```
post-spanning, state of t1 is NEW
post invoking of start() method, state of t1 is RUNNABLE
state of t2 Thread, post-calling of start() method is RUNNABLE
The state for t1 after it invoked join method() on thread t2 TIMED_WAITING
State of Thread t2 after invoking to method sleep() is TIMED_WAITING
State of Thread t2 after join() is TERMINATED
state of Thread t1 after completing the execution is RUNNABLE
```
:::


## Networking sockets
> - Java Networking is a concept of connecting two or more computing devices together so that we can share resources.
> - Java socket programming provides facility to share data between different computing devices.
> - A socket is one endpoint of a two-way communication link between two programs running on the network. A socket is bound to a port number so that the TCP layer can identify the application that data is destined to be sent to.

需要知道什么是`socket`，可以看 [oracle Java Tutorial Sockets](https://docs.oracle.com/javase/tutorial/networking/sockets/index.html)，挺清晰的。

### 客户端

```java
// A Java program for a Client
import java.io.*;
import java.net.*;

public class Client {
	// initialize socket and input output streams
	private Socket socket = null;
	private DataInputStream input = null;
	private DataOutputStream out = null;

	// constructor to put ip address and port
	public Client(String address, int port)
	{
		// establish a connection
		try {
			socket = new Socket(address, port);
			System.out.println("Connected");

			// takes input from terminal
			input = new DataInputStream(System.in);

			// sends output to the socket
			out = new DataOutputStream(
				socket.getOutputStream());
		}
		catch (UnknownHostException u) {
			System.out.println(u);
			return;
		}
		catch (IOException i) {
			System.out.println(i);
			return;
		}

		// string to read message from input
		String line = "";

		// keep reading until "Over" is input
		while (!line.equals("Over")) {
			try {
				line = input.readLine();
				out.writeUTF(line);
			}
			catch (IOException i) {
				System.out.println(i);
			}
		}

		// close the connection
		try {
			input.close();
			out.close();
			socket.close();
		}
		catch (IOException i) {
			System.out.println(i);
		}
	}

	public static void main(String args[])
	{
		Client client = new Client("127.0.0.1", 5000);
	}
}
```

### 服务端

```java
// A Java program for a Server
import java.net.*;
import java.io.*;

public class Server
{
	//initialize socket and input stream
	private Socket		 socket = null;
	private ServerSocket server = null;
	private DataInputStream in	 = null;

	// constructor with port
	public Server(int port)
	{
		// starts server and waits for a connection
		try
		{
			server = new ServerSocket(port);
			System.out.println("Server started");

			System.out.println("Waiting for a client ...");

			socket = server.accept();
			System.out.println("Client accepted");

			// takes input from the client socket
			in = new DataInputStream(
				new BufferedInputStream(socket.getInputStream()));

			String line = "";

			// reads message from client until "Over" is sent
			while (!line.equals("Over"))
			{
				try
				{
					line = in.readUTF();
					System.out.println(line);

				}
				catch(IOException i)
				{
					System.out.println(i);
				}
			}
			System.out.println("Closing connection");

			// close connection
			socket.close();
			in.close();
		}
		catch(IOException i)
		{
			System.out.println(i);
		}
	}

	public static void main(String args[])
	{
		Server server = new Server(5000);
	}
}
```

把以上两段代码编译后运行，先`Server`再`Client`，即可看到客户端和服务端连接成功。此时在客户端控制台中输入信息，可以在服务端看到对应信息。


## Serialization
> Serialization is the conversion of the state of an object into a byte stream; deserialization does the opposite. Stated differently, serialization is the conversion of a Java object into a static stream (sequence) of bytes, which we can then save to a database or transfer over a network.

<br/>