# Java 运行原理
`Java` 代码从编写到运行，流程如下：

1. Java 源程序（.java文件）经过 *编译器* 编译，变成 Java 字节码；
2. Java 字节码经过 *JVM* 解释执行，传递给解释器；
3. *解释器* 将字节码翻译成合适的机器码，在机器中运行；

这省略了很多细节，我想要相对详细地了解 Java 代码从编写到运行的过程中经历了什么。
如果你也感兴趣的话，可以接着往下看。

![20230927135500](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230927135500.png)

## 前置知识 🚀

### JDK - Java开发工具包
JDK（*Java Development Kit*）是 Java 开发工具包，提供了 Java 开发环境和运行环境。    
JDK 包含了 JRE，同时还包含了编译器（javac）和其他开发工具，用于开发、编译、调试和运行 Java 程序。

### JRE - Java运行环境
JRE（*Java Runtime Environment*）是 Java 运行时环境，它包含了 Java 虚拟机（JVM）以及运行 Java 程序所需的核心类库和支持文件。  
JRE 提供了 Java 程序的运行环境，可以执行已经编译好的 Java 字节码。

### JVM - Java虚拟机
JVM（*Java Virtual Machine*）Java 程序的执行环境。JVM 介于 Java 编译器和 OS 之间，利用软件方法实现了一个虚拟的计算机，可以解释和执行 Java 字节码。  
Java 程序在 JVM 上运行，通过 JVM 实现跨平台的特性，这是因为在不同操作系统上的 JVM 都能够执行相同的 Java 字节码。


## 编译源代码 ✒
开发者主要做的是编写 Java 源文件（*source file*），通常以 `.java` 结尾。但文件中的代源码（*source code*）是给开发者阅读的，而不是机器，源文件不能直接运行。

比如，我们用 Java 编写了一段 HelloWorld 代码：

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

💡我们使用 javac（*java编译器*，JDK中携带）编译这个源文件，将其转化以 `.class` 结尾为 Java 字节码文件。

```bash
javac HelloWorld.java
# output: HelloWorld.class
```
> 编译器是一种将高级语言代码转化为低级语言代码的程序。

### javac 编译 Java 源码
javac 将 Java 源代码作为输入，进行词法分析、语法分析和语义分析等过程，最终生成对应的字节码文件。流程如下：

1. *词法分析*  
  javac 首先读取源文件的字符流，并将其分解为一系列的词素（*token*）。词素是源代码中的最小语法单位，如关键字、标识符、操作符和常量等。  
  该过程的结果是得到规范化的 token 流。

2. *语法分析*  
  javac 对 token 流进行分析，并根据语法规则构建语法树（*Syntax Tree*）。语法树表示源代码的结构和层次关系。  
  该过程的结果是得到一个符合 Java 语言规定的抽象语法树。

3. *语义分析*  
  编译器对语法树进行进一步处理，检查代码是否符合语言的语义规则。它会验证变量的声明和使用、类型匹配、函数调用等语义相关的问题，并生成符号表（Symbol Table）来管理变量和函数的信息。  
  该过程的结果是生成一个经过简化的抽象语法树，更加接近字节码。

4. *字节码生成*  
  将经过简化的抽象语法树生成符合 JVM 规范的字节码。

编译阶段的报错，统称为编译期错误，不会继续生成 .class 文件。

### 反编译
我们可以使用编译器将高级语言代码编译为低级语言代码，自然也可以使用反编译工具将已编译的代码转化为未编译的状代码

Java反编译（*Java Decompilation*）是指将 Java 字节码文件转换回 Java 源代码的过程。JDK 中与 javac 相对的反编译器是 javap，可以使用 javap 来反编译 .class 文件。
我们可以使用 javap 反编译刚生成的 HelloWorld.class，看看会获得什么：

```bash
javap -c HelloWorld
```

我们可以看到反编译的结果：

```java
Compiled from "HelloWorld.java"
public class HelloWorld {
  public HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #13                 // String Hello, World!
       5: invokevirtual #15                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

### 字节码
Java 源代码经过虚拟机编译器编译后产生的文件（即扩展为 .class 的文件），它不面向任何特定的处理器，只面向虚拟机。

## JVM 📝
我们已经获得了 .class 字节码文件，来看看它是如何在 JVM 中运行。

### 类加载
💡JVM 中的类加载器（*类加载子系统*）负责定位并加载类文件，可以分为以下三个小阶段：

1. ***加载 Loading***  
  加载是类加载的第一个阶段。JVM 会根据类的全限定名（*Fully Qualified Name*）查找并读取类的字节码文件，
  将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构，
  然后在 Java 堆内存中生成一个代表这个类的 *java.lang.Class* 实例，作为方法区中这个类的各种数据的访问入口。

2. ***链接 Linking***  
  链接是类加载的第二个阶段。JVM 会对加载的类进行一些准备工作，包括以下三步：
    - 验证：验证字节码的正确性和安全性，检查类的结构、字段和方法的引用是否有效；
    - 准备：为类的静态变量分配内存空间，并设置默认初始值；
    - 解析：将符号引用转化为直接引用，即将类、字段和方法的符号引用解析为内存地址引用。

3. ***初始化 Initialization***  
  初始化是类加载的最后一个阶段。JVM 会执行类的静态代码块并对静态变量的赋值操作。  
  初始化阶段是类加载过程中最耗时的阶段，它需要确保类的静态资源正确初始化，并且只会执行一次。直到这一步，才会真正开始执行开发者编写的 java 代码。

> 阅读文章以了解类加载的更多内容：[Java 类加载机制](https://zhuanlan.zhihu.com/p/25228545)

### 执行引擎
💡执行引擎负责解释或编译字节码为机器码，并执行。

JVM 执行引擎是 JVM 核心组成部分之一。它负责将字节码指令解释/编译为 *对应平台* 上的机器指令，这是 Java 跨平台特性的关键。

![20230927180316](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230927180316.png)

执行引擎的主要有以下工作：

1. *字节码验证 Bytecode Verification*  
  JVM 首先会对内存中的字节码进行验证，以确保它的结构和语义是正确的。字节码验证是为了防止恶意代码或错误的字节码破坏 JVM 的安全和稳定性。

2. *解释/编译*  
  JVM 有两种方式将字节码转化为机器码，但通常混用：
     - *解释执行*  
      JVM 使用解释器（*Interpreter*）逐行读取字节码，并将其转换为机器码，然后由处理器执行。解释执行的优点是简单、跨平台，缺点是效率低下，因为每次执行都需要重新解释。  
     - *编译执行*  
      JVM 使用即时编译器（*Just-In-Time Compiler*）将字节码转化为机器码，并将其缓存起来，以便下次直接执行。编译执行的优点是效率高，缺点是需要额外的编译时间和内存空间。  
     - *混合模式*  
      为了兼顾解释执行和编译执行的优势，JVM通常会采用混合模式（Mixed Mode），即对于频繁执行的热点代码，使用编译执行，对于不常执行的冷代码，使用解释执行。这样可以提高程序的整体性能。

3. *执行机器码 Execution*  
  经过解释/编译后，字节码被转化为平台特定的机器码。JVM 会将机器码加载到处理器中执行，实现程序的功能。

到此，我们的 Java 源代码就经过了从编写到执行整个过程。

### JVM生命周期
JVM 在 Java 程序开始运行时运行，结束时也随之结束。

一个 Java 程序对应一个 JVM 进程。

JVM 中有两种线程：
- *守护线程*  
  JVM 自用，如垃圾回收（*GC*）
- *普通进程*  
  一般 Java 程序的线程

## 参考
- [Java JVM 运行机制及基本原理](https://zhuanlan.zhihu.com/p/25713880)
- [Java 的运行原理](https://www.cnblogs.com/o-andy-o/archive/2012/04/11/2442109.html)
- [javac 源码笔记与简单的编译原理](https://rensifei.site/2017/03/javac/)