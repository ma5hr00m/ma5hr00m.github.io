# JavaScript 作用域与提升

补档，本来想把【闭包】也一并放在本文中，但发现会有些臃肿，于是本文就只写作用域与提升。

本文编写的 JavaScript 代码示范均使用 node v18.19.1，遵循 ES6 标准。

## Scope 作用域

什么是作用域呢？我的理解是：“变量的作用域就是该变量可访问的范围，函数对象同理”，作用域的作用是避免不同层级中的变量发生冲突。

JS 中主要分为两种作用域：全局作用域（global scope）和局部作用域（local scope）。

在 JS 中，局部作用域类似于“私人房间”，其中的变量只能在特定的区域内访问。当我们在局部作用域中声明变量时，它只能在该代码块、函数或条件语句中访问。局部作用域中的变量会受到外部代码干扰，例如：

```JavaScript
function myFunction() {
  var localVariable = "我在局部作用域中";
  console.log(localVariable);
}

myFunction();
console.log(localVariable);
```

在这段代码中，`localVariable`在局部作用域中声明，这意味着它只能在`myFunction`代码块内访问，尝试在作用域之外使用该变量会抛出`ReferenceError: localVariable is not defined`的报错。

而全局作用域中中声明的变量可以在代码的任何地方访问。它可以类比为一个“公共广场”，所有人都可以看到和访问其中的内容。在全局作用域中声明的变量通常是在任何函数或代码块之外定义的。例如：

```JavaScript
var globalVariable = "我在全局作用域中";

function myFunction() {
  console.log(globalVariable);
}

myFunction();
console.log(globalVariable);
```

在这个例子中，`globalVariable`在全局作用域中声明，`myFunction`中也可以直接访问它。因为`myFunction`函数中并没有对`globalVariable`显示地做出声明，也没有把其当作一个参数，同时满足这两个条件，我们就可以把`globalVariable`叫做自由变量（free variable）。

还是在这个例子中，`myFunction`中使用了`globalVariable`，但当前作用域中并没有声明该变量，此时它就会向上一级作用域（这里是全局作用域）寻找该变量，如果在上一级没有找到，就向再上一级寻找，直到找到所需变量，或者抛出`is not defined`报错。这种

```
xxx-scope -> ... -> global scope
```

的查询方式，会形成一条作用域链（scope chain）。

> 和 prototype chain 有些相似之处～

### Block Scope 块级作用域

ES6 之前，JS 中只有全局/局部作用域，这会导致一些潜在的问题，如循环变量泄露：

```JavaScript
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Outputs: 3, 3, 3
  }, 100);
}
```

在上面的代码中，使用`var`在`for`循环中声明的变量`i`被提升到函数作用域，其值在循环的所有迭代中共享。这经常导致意外行为，特别是在处理像`setTimeout`这样的异步操作时。这对开发者来说很不方便，也不利于编写完善的代码。

为了解决此类问题，ES6 中新增了`let&const`关键字以及块级作用域（block scope）。

有了新的语法之后，我们就可以对上面的例子做出改进：

```JavaScript
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log(j); // Outputs: 0, 1, 2
  }, 100);
}
```

我们使用`let`，变量`j`的作用域就被限制在`for`循环的块内，确保每次迭代都为`j`创建一个新的词法环境。这可以防止与变量提升和异步操作等问题。

因此，在实际开发过程中，我们一般推荐只使用`let&const`，不使用`var`，这可以最大程度避免我们代码出现 bug。

### Static/Lexical Scope 静态作用域

运行以下代码，会得到什么结果呢？

```JavaScript
var x = 'global';
function foo() {
    console.log(x);
}
function bar() {
    var x = 'local';
    foo();
}
bar();
```

答案是`global`，这倒不难理解，按照前面说的，`foo()`函数被调用，发现函数作用域中没有`x`变量，就沿着作用域链向上寻找，在全局作用域中找到后就输出`global`。但在有些语言中会得到不同的输出结果。

以 Perl 语言为例，实现同样功能的代码，会得到不同的输出：

> 你可以使用该 [站点](https://www.jyshare.com/compile/) 在线运行以上代码并观察输出结果。

```Perl
our $x = 'global';
sub foo {
    print "$x\n";
}
sub bar {
    local $x = 'local';
    foo();
}
bar(); # output: local
```

原因是这两种语言对作用域的定义不同。从本质上来讲，作用域就是一套规则，这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称查找变量。

常见作用域有静态作用域（static scope）和动态作用域（dynamic scope），前者在词法分析阶段就已经决定，后者则是在代码执行过程中进行动态的划分，比如函数的作用域是在函数被调用时才决定。

JS 采用的是静态作用域规则，我们在编写代码就已经决定了其作用域层级。静态作用域也叫做词法作用域（Lexical Scope），这个名称更加直白。

> 如果你对什么是“词法分析”抱有疑问，可以参考我之前的文章：[JavaScript 执行原理](https://ma5hr00m.top/archives/2024/02/how-js-run.html)。

## Hoisting 提升

讲完作用域，我们可以来说说提升（hoisting）了。

hoisting 是指将变量、函数或类的声明移动到它们所在的作用域的顶部，这允许开发者在代码中使用变量或函数时无需关心它们的声明位置。这里“移动”并不准确，但暂且按照这样理解也无妨。

这是一个最简单的例子，我们在声明`ping()`之前调用了它，但这不会导致报错：

```JavaScript
ping();
function ping() {
    console.log('pong');
}
```

不抛出报错的原因就是 JS 引擎在运行时将`ping()`的声明“移动”到了函数调用之前，也就是提升了这个函数声明。

为什么需要 hoisting 呢？在 Twitter 某位用户的询问中，Brendan Eich 回答了这个问题：

> Function declaration hoisting is for mutual recursion & generally to avoid painful bottom-up ML-like order.

在我们编写 JS 时，有时会遇到需要编写两个函数相互调用的情况，如果没有提升，处理这种情况就会变得繁琐。Brendan 不希望在 JS 中看到类似 ML 的自下而上的编程顺序。

### 提升规则

> 如果你只想知道 Hoisting 规则，而对其原理不感兴趣，只需看完本小节。

这是变量提升的简单演示，运行代码会输出`undefined`而非`ReferenceError: a is not defined`：

```JavaScript
console.log(a) // output: undefined
var a = 1;
```

JS 引擎会提升变量声明操作，而不会提升变量赋值操作。以上代码等效于：

```JavaScript
var a;
console.log(a) // output: undefined
a = 1;
```

再来看这段代码，运行代码输出`2`而非`1`：

```JavaScript
function test(v){
    console.log(v);
    var v = 1;
}
test(2); // output: 2
```

函数作用域中的变量也会提升，但因为我们调用`test()`时传入了参数`v`，所以在函数内代码运行之前会有一个隐性的函数声明+赋值操作，`var v = 1;`的声明操作也会提升，但因为`v=2`的赋值操作更先执行，所以会输出`2`。以上代码等效于：

```JavaScript
function test(v){
    var v;
    var v;
    v = 2;
    console.log(v);
    v = 1;
}
test(2); // output: 2
```

最后来看这段代码，运行代码输出`[Function: a]`而非`undefined`：

```JavaScript
console.log(a); // output: [Function: a]
var a;
function a(){};
```

调换2、3行的声明顺序会得到相同结果。道理很简单，函数声明提升优先级 > 变量声明提升，无需过多解释。

对以上三个示例做总结，可以得到以下 JS 中关于提升的三条规则：

- 变量、函数声明操作都会提升；
- 赋值操作不提升；
- 函数声明操作优先级 > 变量声明优先级。

### Execution Context 执行上下文

在介绍 hoisting 实现原理之前，有必要先了解 JS 的执行上下文。

ES6 的执行上下文是指运行 JS 代码时的代码环境和相关信息。执行上下文包括三个部分：

- 词法环境（lexical environment）
- 变量环境（variable environment）
- this 绑定（this binding）

词法环境是一个存储标识符（变量，函数，类等）和它们的值的结构。词法环境有两个组成部分：环境记录（environment record）和外部环境引用（outer environment reference）。环境记录是一个存储当前作用域内的标识符和它们的值的对象；外部环境引用则是一个指向包含作用域的词法环境的指针。

变量环境是一个与词法环境类似的结构，但是它只存储`var`声明的变量。在 ES6 之前，变量环境和词法环境是相同的，但是在 ES6 中引入了`let&const`关键字，变量环境和词法环境也有可能不同。

`this`绑定是一个确定当前执行上下文中的`this`值的过程。`this`值取决于函数的调用方式，例如普通函数调用，方法调用，构造函数调用，箭头函数调用等。

> `this`比较麻烦，本文中不细说。

词法环境和变量环境本质上都是一种词法作用域，都是用来存储和查找标识符（变量，函数等）的值的结构。它们的区别在于，词法环境可以随着代码的执行而改变，而变量环境则保持不变。

![20240226195039](https://img.ma5hr00m.top/blog/20240226195039.png)

我们可以把词法环境理解为一个栈，每当进入一个新的作用域，就会创建一个新的词法环境，并将其压入栈顶。这个新的词法环境包含了当前作用域内的标识符和它们的值，以及一个指向外部词法环境的引用。当退出当前作用域时，就会将栈顶的词法环境弹出，恢复到上一个词法环境。这样，词法环境就能实现词法作用域的规则，即内部作用域可以访问外部作用域的标识符，但反之不行。

变量环境则是一个特殊的词法环境，它只包含了用`var`声明的变量和函数声明。变量环境在执行上下文创建时就确定了，不会随着代码的执行而改变。这意味着，用`var`声明的变量和函数声明会被提升到它们所在的执行上下文的顶部，而不受块级作用域的限制。这也是为什么在 ES6 之前，JS 只有函数作用域，而没有块级作用域的原因。

ES6 引入了`let`和`const`关键字，它们创建的标识符只存在于词法环境中，而不在变量环境中。这样，就可以实现块级作用域，以及暂时性死区（TDZ）的特性。

下面是一个例子，说明了词法环境和变量环境的区别：

```JavaScript
// 全局代码
var a = 1; // 在全局执行上下文的变量环境和词法环境中
let b = 2; // 只在全局执行上下文的词法环境中

function foo() {
  // 进入foo函数的执行上下文
  var c = 3; // 在foo函数的执行上下文的变量环境和词法环境中
  let d = 4; // 只在foo函数的执行上下文的词法环境中
  console.log(a, b, c, d); // 1, 2, 3, 4
  if (true) {
    // 进入块级作用域
    var e = 5; // 在foo函数的执行上下文的变量环境和词法环境中
    let f = 6; // 只在块级作用域的词法环境中
    console.log(a, b, c, d, e, f); // 1, 2, 3, 4, 5, 6
  }
  // 退出块级作用域
  console.log(a, b, c, d, e); // 1, 2, 3, 4, 5
  console.log(f); // ReferenceError: f is not defined
}

// 退出foo函数的执行上下文
foo();
console.log(a, b); // 1, 2
console.log(c, d, e, f); // ReferenceError: c is not defined
```

到这里应该就能理解词法环境和变量环境是什么了，如果还是感觉疑惑，不清楚这俩环境到底是什么，可以看看 [Variable Environment vs lexical environment](https://stackoverflow.com/questions/23948198/variable-environment-vs-lexical-environment) 这篇问答，里面解释得更详细一些。

### 工作原理

经过前面这么多铺垫，我感觉 Hoisting 的实现原理已经比较明晰。其实解释执行上下文的时候就已经算是在解释 Hositing 工作原理了。

我们可以把 JS 执行划分为以下几个步骤，但重点放在提升操作上：

1. 创建全局执行上下文，并将其压入执行栈。
2. 对全局代码进行扫描，将`var`声明的变量添加到全局执行上下文的变量环境中，并赋值为`undefined`。将函数声明添加到全局执行上下文的词法环境中，并赋值为函数对象。对于`let`和`const`声明的变量，不会被提升，而是在全局执行上下文的词法环境中创建一个未初始化的绑定，直到它们被赋值为止。这就是暂时性死区（TDZ）的概念，即在变量被赋值之前，不能被访问或使用。
3. 开始执行全局代码，按照顺序逐行执行。如果遇到函数调用，就创建一个函数执行上下文，并将其压入执行栈。
4. 对函数代码进行扫描，将`var`声明的变量添加到函数执行上下文的变量环境中，并赋值为`undefined`。将函数声明添加到函数执行上下文的词法环境中，并赋值为函数对象。对于`let`和`const`声明的变量，同样不会被提升，而是在函数执行上下文的词法环境中创建一个未初始化的绑定，直到它们被赋值为止。
5. 开始执行函数代码，按照顺序逐行执行。如果遇到函数调用，就重复步骤3和4。如果遇到`return`语句，就返回函数的结果，并将函数执行上下文从执行栈中弹出。
6. 当全局代码执行完毕，就将全局执行上下文从执行栈中弹出，程序结束。

流程如此，具体到代码中，把自己想象成 JS 引擎，按照上面的执行流程分析即可。如果感兴趣，可以试着分析以下代码，对应的输出也已经给在每行代码后面了：

```JavaScript
console.log(a); // undefined
console.log(b); // ReferenceError: Cannot access 'b' before initialization
console.log(c()); // 3
console.log(d()); // TypeError: d is not a function
var a = 1;
let b = 2;
function c() {
  return 3;
}
var d = function() {
  return 4;
};
```

## 补充

文中有些概念并不明晰，但直接解释又会影响连贯性，于是摘出来放在这里。

### ML-like Order

ML 是一种通用的函数式编程语言，具有可扩展的类型系统。它支持多态类型推断，这几乎消除了指定变量类型的负担，并极大地促进了代码的重用。ML 虽然没有得到广泛的使用，但它对其他语言产生了很大的影响，比如 Haskell、Rust、Scala 等。

下面是一个用 Standard ML 编写的阶乘函数的例子：

```
fun factorial n =
    if n = 0 then 1 else n * factorial (n-1)
```

这个函数必须在调用它的地方之前定义，否则会报错。

ML-like Order 是指 ML 语言中的函数定义顺序，它是自下而上的，也就是说，一个函数必须在它被调用之前定义。这样的顺序有时会导致一些不便，比如前面讲到的函数相互递归的情景，ML 就需要使用特殊的 fun 和 and 关键字，这种函数则会被称为互递归函数。比如判断一个自然数是奇数还是偶数：

```
fun isOdd n = if n = 0 then false else isEven (n-1)
and isEven n = if n = 0 then true else isOdd (n-1)
```

为了避免这种情况，一些其他的语言（比如 JS）采用了函数声明提升（FDs hoisting）的机制，允许在任何地方定义函数，而不用考虑顺序。

## 参阅文章

- [解读ECMAScript[1\]——执行环境、作用域及闭包](https://www.cnblogs.com/leoo2sk/archive/2010/12/19/ecmascript-scope.html)，by Eric Zhang
- [详解JavaScript作用域和作用域链](https://juejin.cn/post/7030765196574457892#heading-8)，by Rockky
- [所有的函式都是閉包：談 JS 中的作用域與 Closure](https://blog.huli.tw/2018/12/08/javascript-closure/)，by Huli
- [我知道你懂 hoisting，可是你了解到多深](https://blog.huli.tw/2018/11/10/javascript-hoisting-and-tdz/)，by Huli
- [ECMAScript® 2015 Language Specification](https://262.ecma-international.org/6.0/)