# JavaScript 执行原理

最近在复习 JavaScript 反混淆相关内容，正好给执行原理补个档，之前旧版的随旧博客一起遗失了，这里重新写了一篇。

预计之后还会有 [JavaScript执行原理·补](#) 和 [JavaScript混淆/反混淆](#)，慢慢写吧。

:::tip

跳转到 [JavaScript混淆/反混淆](https://ma5hr00m.top/archives/2024/02/js-obfuscation-deobfuscation.html)

:::

## JavaScript

JavaScript 是一门解释型语言，与 C/Golang 等静态编译语言不同。静态编译型语言通过编译器直接将代码转化为机器码，然后运行在机器上；JS 是先经过编译产生字节码，然后在虚拟机上运行字节码（这点与 Java&JVM 很相似），性能虽不及静态编译型语言，但获得了更多的灵活性。

## 前置知识

### JS Engine 引擎

为什么需要 [JS Engine](https://en.wikipedia.org/wiki/JavaScript_engine)🤔️？

JS Engine 其实就可以理解为上文中所说的虚拟机。机器底层的 CPU 只能执行指令集中的指令（即对应的汇编代码），无法直接识别高级语言。JS Engine 可以将 JS 代码编译为字节码，然后执行代码，同时还提供了分配内存和垃圾回收的功能，极大程度上减轻了开发人员的工作量，何乐而不为。

从本质上来讲，JS Engine 就是一段程序，用于实现上述功能。

互联网中最常见、使用最广泛的 JS Engine 是 **Google V8**。Google V8 是用 C++ 编写的开源高性能 JS Engine（同时也是 WebAssembly Engine），目前已被用于 Chrome 浏览器、Node.js、MongoDB 等多个知名项目。Chrome 占据了全球浏览器市场 60% 的份额，而 Node.js 已然成为服务器端 JS 代码的执行标准，由此可见 V8 使用之广泛。

除此之外，还有一些常见的 JS Engine：

- 由 Mozilla 为 Firefox 开发的 SpiderMonkey
- 为 Safari 浏览器提供支持的 JavaScriptCore
- 为 IE 提供支持的 Chakra

本篇接下来的 JS Engine 都默认为 Google V8。

### JS Runtime 运行时

我们可以把 JS Runtime 理解为一栋房子，JS 代码都需要在这栋房子中运行。而这栋房子由很多部分共同组成，包括 JS Engine、外部 API 和回调队列（callback queue）。有时也把 JS 用到的 core lib 核心库看作 Runtime 的一部分。

![20240221083858](https://img.ma5hr00m.top/blog/20240221083858.png)

以 Chrome 浏览器的 JS Runtime 举例，浏览器的 Runtime 由对应的 JS Engine、Web API 和回调队列组成。JS Engine 在上文中有讲，不再赘述；Web API 是浏览器提供给 Engine 的一系列接口，并不是 JS 的一部分，目的是方便操纵数据和增强浏览器的功能，常用的 Web API 包括 DOM、Web Worker 等；回调队列包括准备好执行的回调函数，回调队列确保回调以先进先出（FIFO）方法执行，并在堆栈为空时将其传递到堆栈中。

与浏览器 Runtime 不同的是，Node.js 没有 Web API，而是有叫作 C++ 绑定和线程池的其他部分。

我们可以这样说，Chrome 和 Node.js 中的 JS 代码都依赖于 V8 运行，但它们运行在不同的 Runtime 中。

在开始之前，我们要知道，V8 是一个非常复杂的项目，有超过 100w 行代码。我们可以根据功能将 V8 Engine 分为不同的子模块，其中最重要的四个子模块分别是：

- [Parser](https://v8.dev/blog/scanner)：解析器，将 JS 源码转换为抽象语法树（AST）；
- [Ignition](https://v8.dev/docs/ignition)：解释器，将 AST 转换为字节码（Bytecode），然后解释执行 Bytecode，同时收集 TurboFan 优化编译所需的信息，比如函数参数的类型；
- [TurboFan](https://v8.dev/docs/turbofan)：编译器，利用 Ignitio 所收集的类型信息，将 Bytecode 转换为优化后的汇编代码；
- [Orinoco](https://v8.dev/blog/trash-talk)：垃圾回收模块，负责将程序不再需要的内存空间回收；

前三个子模块可以代表 JS 运行的主要三个阶段：解析、解释、编译，最后运行。接下来，我会以 V8 Engine 为例，讲讲 JS 代码到底是如何从编写到运行的。

## Parser 解析

Parser 的功能是将 JS 源码转化为 AST。更确切地说，源码是先经过词法分析转化为 Token，然后 Toekn 经过语法分析转换为 AST。

### Lexing 词法分析

**词法分析** 这个过程会将由字符组成的字符串分解成代码块，这些代码块被称为“词法单元”（Token）。从数据方面来说，这一步是字符流（char stream）转换为标记流（token stream）。

我们编写一个`main.js`文件，写入以下内容：

```JavaScript
const a = 3;
```

以这段代码为例，会被分为`const`、`a`、`=`、`3`、`;`词法单元。`space`是否被当作词法单元，取决于其在当前编程语言中是否有意义，JS 中的空格是无意义，不会被当作词法单元。

以下为经过词法分析的 JSON 格式的 Tokens：

```JSON
[
    {
        "type": "Keyword",
        "value": "const"
    },
    {
        "type": "Identifier",
        "value": "a"
    },
    {
        "type": "Punctuator",
        "value": "="
    },
    {
        "type": "Numeric",
        "value": "3"
    },
    {
        "type": "Punctuator",
        "value": ";"
    }
]
```

分词（Tokenizing）和词法分析（Lexing）的区别在于：词法单元的识别是通过有状态还是无状态的方式进行的，无状态的为分词。这里“状态”的有无则是根据数据的处理过程是否需要考虑其他相关信息决定的。

在 JS 解析的过程中，我们需要考虑当前词法单元与前面的词法单元之间的关系，因此，JS 的解析是一个有状态的过程，我们就会将字符流转换为 token 的这一过程称为 Lexing 而非 Tokenizing。

### Parsing 语法分析

**语法分析** 是将标记流转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树，我们称其为抽象语法树（AST）。

上文中的 Tokens 经过语法分析得到的 JSON 格式的 AST 如下：

```JSON
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "value": 3,
            "raw": "3"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "script"
}
```

解析的过程就这么多，最终效果就是得到源码对应的AST。

[Esprima](https://esprima.org/demo/parse.html#) 站点提供了在线解析 JS 代码的功能，输入 JS 代码就可以得到经过 Lexing 的 Tokens 和 经过 Parsing 的 AST，可以动手尝试一下。

除此之外， [AST explorer](https://astexplorer.net/) 站点也可以在线将 JS 代码转化为 AST。这个网站是基于 acorn.js 实现的，[acorn.js](https://www.npmjs.com/package/acorn)  是一个 JavaScript Parser，你可以通过`npm`等包管理器下载并使用它。以下是一段使用 acorn.js 将指定代码转化为 AST 的案例。指定解析`console.log(1);`并以JSON格式输出：

```JavaScript
const { Parser } = require('acorn')

const javascriptCode = `
  console.log(1);
`;

const ast = Parser.parse(javascriptCode, { ecmaVersion: 2024 });
console.log(JSON.stringify(ast));
```

## Ignition 解释

Ignition 的主要功能是负责将 AST 转换为字节码（Bytecode）并解释执行。

Bytecode 是一种包含执行程序、由一序列 op 代码/数据对组成的二进制文件，是一种中间码（IR），是机器码的一种抽象。它不面向任何机器，只面向当前虚拟机（这里是 V8 引擎）。

> 我们常说的字节码多是指 Java 字节码，实际上很多动态编译解释的语言都有字节码，比如 Python/JavaScript/Ruby。

早期的 V8 直接将 AST 编译为机器码，然后在机器中执行，因为这样的效率更高。但机器码会占用过多的系统内存，相比之下，Bytecode 占用的内存空间远比机器码少得多，Google 团队遂选择以时间换空间，转换为现在的 AST->Bytecode->机器码。

![20240221083929](https://img.ma5hr00m.top/blog/20240221083929.png)

Node.js 提供了很多关于 V8 引擎的选项，比如`--print-bytecode`用于获取源码对应的字节码。

先编写这样一段 JS 代码并保存为 main.js 文件：

```JavaScript
function ma5hr00m() {
  console.log(1);
}

ma5hr00m();
```

然后使用`node --print-bytecode main.js`即可得到代码的 Bytecode，会输出非常非常多的内容，可以查找到`ma5hr00m()`函数对应的 Bytecode：

```JavaScript
[generated bytecode for function: ma5hr00m (0x3ae97a693191 )]                                                                     
Bytecode length: 19                                                                                                                                            
Parameter count 1                                                                                                                                              
Register count 3                                                                                                                                               
Frame size 24                                                                                                                                                  
Bytecode age: 0                                                                                                                                                
   24 S> 0x3ae97a6940ee @    0 : 21 00 00          LdaGlobal [0], [0]                                                                                          
         0x3ae97a6940f1 @    3 : c3                Star1                                                                                                       
   32 E> 0x3ae97a6940f2 @    4 : 2d f9 01 02       GetNamedProperty r1, [1], [2]                                                                               
         0x3ae97a6940f6 @    8 : c4                Star0                                                                                                       
         0x3ae97a6940f7 @    9 : 0d 01             LdaSmi [1]                                                                                                  
         0x3ae97a6940f9 @   11 : c2                Star2                                                                                                       
   32 E> 0x3ae97a6940fa @   12 : 5e fa f9 f8 04    CallProperty1 r0, r1, r2, [4]                                                                               
         0x3ae97a6940ff @   17 : 0e                LdaUndefined                                                                                                
   40 S> 0x3ae97a694100 @   18 : a9                Return                                                                                                      
Constant pool (size = 2)                                                                                                                                       
0x3ae97a694099: [FixedArray] in OldSpace                                                                                                                       
 - map: 0x2a087bbc0211                                                                                                                  
 - length: 2                                                                                                                                                   
           0: 0x2a087bbc5ce9                                                                                                              
           1: 0x398ad9accb91                                                                                                                  
Handler Table (size = 0)                                                                                                                                       
Source Position Table (size = 10)                                                                                                                              
0x3ae97a694109 
```

我们可以简单分析其中 Bytecode 字段对应的指令：

- 从全局加载一个值到寄存器中；
- 将寄存器 1 的值存储到一个位置；
- 从一个对象中获取属性并存储到寄存器 0；
- ……

这看起来很像我们学习过的汇编语言，或者说 Bytecode 就是抽象后的汇编，它仅面向虚拟机 CPU 而不是其他任何机器的 CPU，这就说明 V8 不需要为不同的 CPU 生成不同的代码，只需生成 Bytecode，这样也在某种程度上简化了 V8 的编译流程，提高了其可拓展性。

## TurboFan 编译

TurboFan 负责将 Bytecode 转换为优化后的机器码。

前面说过，Ignition 子模块已经可以完成 AST->Bytecode 并解释执行，那为什么 V8 还需要 TurboFan 来编译 Bytecode 呢？

前面说过，JavaScript 是一门解释型的语言。解释型语言的特点是：

- 运行时逐行被解释器解释并执行；
- 每次运行程序时都需要将源代码翻译成机器代码并执行；

解释型语言的好处就是灵活且启动速度快，在 Web 应用场景下，这种策略是优于编译型语言的。但随着时代进步，Web 应用越来越庞大，解释型语言执行速度慢的缺点也逐渐凸显出来。在 V8 出现之前，所有 JS Engine 都采用着解释执行的方式。

而 V8 率先引入了即时编译（JIT）的设计，这种设计混合了解释执行和编译执行两种策略，极大地提升了 JS 的执行速度。之后其它 JS Engine 也是迅速跟进。

### JIT 即时编译

Just-in-Time 技术是解释执行和编译执行二者之间权衡之后的产物。简单地说，V8 在启动过程中采用解释执行的策略，如果某段代码的超过某个阈值，V8 就会把这段代码编译成执行效率更高的机器码。

不同 Engine 在实现 JIT 的手段上存在区别，但总体思想是一致的，就是在 Engine 内部添加一个监视器。监视器负责监视代码的运行情况，记录代码一共运行了多少次、代码如何运行等。监视器会根据代码重复次数以及运行某段代码占用的执行时长，对代码进行标记，标记共分为`warm`、`hot`和`very hot`三个等级。

举个例子说明：

```JavaScript
function arraySum(arr) {
    let sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
}
```

这段代码刚开始运行时，监视器监视着所有代码的运行情况。

如果同一行代码重复执行几次，监视器会把这段代码标记为`warm`。

被标记为`warm`的代码段会被 JIT 传递给 *基线编译器* 进行编译，并将结果储存。`warm`代码段的每一行都会被编译成一个`stub`，同时给这个`stub`分配一个以“行号 + 变量类型”的索引。此时并没有使用编译的代码替换原本的代码。

如果监视器监视到，某行某个变量使用了同样的变量类型在此多次执行同样的代码，就会将`warm`升级为`hot`，并把已编译的代码 push 给浏览器，浏览器接收后就会用编译后的代码替换原本的代码。

如果`hot`代码段重复次数非常多以至于占用了大部分执行时间，就标记为`very hot`。

被标记为`very hot`的代码段会被 JIT 传递给 *优化编译器* 进行编译，生成一个更快速和高效的代码版本，并且存储。例如上面这段代码，`sum`和`arr[i]`两个数并不保证都是整数（JS 动态类型），每次`+=`执行前都需要先判断一遍数据类型，如果这段代码重复执行了非常多次且每次这两个变量都是 INT 型，那这段代码被丢给优化编译器进行编译时，就会被优化为优先进行 INT 类型的判断，以节约时间。

如果上述经过优化的代码出现问题，某次执行数据判断的结果不是 INT 型，那这段经过优化编译得到的代码就会被直接丢弃，执行过程回到解释器/基线解释器，这个过程被称为 *去优化*。

要注意，JIT 与虚拟机执行策略的选择有关，而和语言本身无关。除了 JS，其他解释型语言也会引入 JIT 技术，以提高执行效率。

## 参阅文章

- [JavaScript 语法解析、AST、V8、JIT](https://cheogo.github.io/learn-javascript/201709/runtime.html)
- [JavaScript深入浅出第4课：V8引擎是如何工作的](https://kiwenlau.com/2019/07/16/how-does-v8-work/)，by 寒雁Talk
- [WebAssembly 系列（二）JavaScript Just-in-time (JIT) 工作原理](https://zhuanlan.zhihu.com/p/25669120)，by 知乎
- [JS中的JIT与基本执行逻辑](https://juejin.cn/post/6863269040300032008)，by 稀土掘金