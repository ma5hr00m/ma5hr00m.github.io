---
title: JavaScript 原型链详解
date: 2024/2/14
author: ma5hr00m
categories:
- JavaScript
---

继续补档，发现这块内容其实蛮多的。后面估计还会有两篇（怎么还有两篇啊喂！），分别是 [JavaScript执行原理·补](#) 和 [JavaScript部分特性](#)，这周不知道能不能搞定。

先看 JS 原型链吧。

## JS 继承机制设计

1994年，网景公司（Netscape）发布了 Navigator v0.9，轰动一时。但当时的网页不具备交互功能，数据的交互全部依赖服务器端，这浪费了时间与服务器资源。

网景公司需要一种网页脚本语言实现用户与浏览器的互动，工程师 [Brendan Eich](https://brendaneich.com/) 负责该语言的开发。他认为这种语言不必复杂，只需进行一些简单操作即可，比如填写表单。

可能是受当时面向对象编程（object-oriented programming）的影响，Brendan  设计的 JS 里面所有的数据类型都是对象（object）。他需要为 JS 设计一种机制把这些对象连接起来，即“继承”机制。

> 继承允许子类继承父类的属性和方法，并且可以在子类中添加新的属性和方法，实现代码的重用和扩展性。

出于设计的初衷，即“开发一种简单的网页脚本语言”，Brendan 没有选择给 JS 引入类（class）的概念，而是创造了基于原型链的继承机制。

在 Java 等面向对象的语言中，一般是通过调用 class 的构造函数（construct）创建实例，如：

```Java
class Dog {
    public String name;
    
    public Dog(String name) {
        this.name = name;
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Rover");
        System.out.println(dog.name); // Rover
    }
}
```

Brendam 为 JS 做了简化设计，直接对构造函数使用`new`创建实例：

```JavaScript
function Dog(name) {
    this.name = name;
}

var dog = new Dog("Rover");
console.log(dog.name) // Rover
```

这种设计避免了在 JS 中引入 class，但这引出一个问题：JS 的实例该如何共享属性和方法？基于构造函数创建的实例都是独立的副本。

先看看 Java 是如何基于 class 实现属性和方法共享的：

```Java
class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}

class Cat extends Animal {
    public void meow() {
        System.out.println("Cat is meowing");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        Cat myCat = new Cat();
        
        myDog.eat(); // Animal is eating
        myDog.bark(); // Dog is barking
        myCat.eat(); // Animal is eating
        myCat.meow(); // Cat is meowing
    }
}
```

在这个例子中，`Dog`和`Cat`子类继承了`Animal`父类的`eat()`方法，并分别添加了`bark()`和`meow()`方法，这种基于类实现的继承很顺畅也便于理解。

JS 中没有 class，但这种需求切实存在。Brendan 通过为构造函数添加`prototype`属性解决这个问题。

```JavaScript
function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function() {
    console.log(this.name)
}

var dogA = new Dog("Rover");
var dogB = new Dog("Fido");
dogA.bark(); // Rover
dogB.bark(); // Fido
```

我们给构造函数`Dog`的`prototype`添加了`bark()`方法，这样做的话，基于`Dog`创建的实例都可以使用`bark()`方法，数据共享同理。

那这是如何实现的呢，或者说，`prototype`是什么，为什么可以在多个实例之间共享属性及方法？这就是我们接下来要说的内容。

在这里先丢一张图，接下来的内容可以搭配这张图一起看，相信这会对初学者理解 JS 原型链很有帮助：

![img](https://wiki.wgpsec.org/images/js-prototype-chain-pollution/3.png)

## prototype 原型

在 JS 中，每个函数都有一个`prototype`属性，每个对象都有一个`__proto__`属性。

函数的`prototype` 属性本质上是一个对象，它包含了通过这个函数作为构造函数（即使用 `new` 关键字）创建的所有实例所共享的属性和方法。

而`__proto__`是所有对象都有的一个属性，它指向了创建这个对象的构造函数的`prototype`。也就是说，如果我们有`var dog = new Dog()`，那么`dog.__proto__`就是`Dog.prototype`。

> “引用”是指一个变量或者对象指向内存中的一个位置，这个位置存储了某个值。这里也可以说`dog.__proto__`是`Dog.prototype`的一个引用。

那么 JS 是如何通过`prototype`实现继承的呢？

当我们试图访问一个对象的属性时，如果该对象本身没有这个属性，JS 就会去它的`__proto__`（也就是它的构造函数的`prototype`）中寻找。因为`prototype`本身也是一个对象，如果 JS 在`prototype`中也没有找到被访问的属性，那么它就会去`prototype`的`__proto__`中寻找，以此类推，直到找到这个属性或者到达原型链的末端`null`。

通过这种方式，JS 就实现了它所需要的继承机制。这种通过对象的`__proto__`属性逐步向上查询的机制，就是我们所说的 JS 原型链。

再拿这个例子做一次讲解：

```JavaScript
function Dog(name) {
  this.name = name;
}

Dog.prototype = {
  "species": "dog",
} 
  
var dog = new Dog('Rover');

console.log(dog.name); // Rover
console.log(dog.species); // dog
console.log(dog.age); // undefined
console.log(dog.__proto__.__proto__.__proto__); // null

console.log(dog.__proto__ === Dog.prototype) // true
console.log(Dog.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__) // null
```

调用`dog.name`时，JS 查找到`dog`实例有`name`属性，就返回`Rover`；

调用`dog.species`时，JS 发现当前实例中没有该属性，就去`dog.__proto__`中查询，找到`species`属性并返回`dog`；

调用`dog.age`时，JS 发现当前实例和当前实例的`__proto__`属性中都没有该属性，就再向上去寻找，也就到`Dog.prototype.__proto__`（即`Object.prototype`）中去寻找，已然没有找到，就继续向上找，但`Object.prototype.__proto__`是整条原型链的起点——`null`，JS 查找不到`age`属性，就会返回一个`undefined`；

如果我们再向上查询一层，即尝试访问`dog.__proto__.__proto__.__proto__.__proto__`，会直接抛出报错，JS 定义`null`没有原型，yejiu1无法访问到它的`prototype`属性。

## constructor 构造函数

在 JS 中，每个函数对象还有一个特殊的属性叫做`constructor`。这个属性指向创建该对象的构造函数。当我们创建一个函数时，JS 会自动为该函数创建一个`prototype`对象，并且这个`prototype`对象包含一个指向该函数本身的`constructor`属性。

当我们使用构造函数创建实例对象时，这些实例对象会继承构造函数的`prototype`对象，从而形成原型链。因此，通过`constructor`属性，实例对象就可以访问到创建它们的构造函数。

直接把`constructor`当作反向`prototype`理解即可。以刚才的代码举例：

```JavaScript
console.log(Dog.prototype.constructor === Dog); // true
```

## 前端开发中的原型链

### class 语法糖

现在的 Web 前端开发中几乎不直接使用原型链了，JS 已经在 ES6（ECMAScript 2015）中引入了类（Class）的概念，因为这能使得面向对象编程更加直观。

个人感觉这表示着 JS 与 Brendan Eich 当年所设想的“简单的客户端脚本语言”越走越偏了，但这也说明 JS 一直在蓬勃发展，活跃的社区生态让 JS 把它的触手伸向了互联网的角角落落，越来越多的开发者将 JS 变得愈来愈完善。

但请注意，JS 的 class 在底层上仍然是基于原型链的，只是一种语法糖。

```JavaScript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

let animal = new Animal('Simba');
animal.speak(); // Outputs: "Simba makes a noise."
```

以上代码是一个使用了 class 的 JS 示范，其基于原型链的版本如下：

```JavaScript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(this.name + ' makes a noise.');
}

let animal = new Animal('Simba');
animal.speak(); // Outputs: "Simba makes a noise."
```

这两个例子在功能上是相同的，但是它们的写法有所不同。class 语法提供了一种更清晰的方式来创建对象和处理继承。在 class 语法中，你可以直接在类定义内部声明方法，而在原型链中，你需要在原型对象上添加方法。

### 性能影响

我们前面说过，JS 在原型链中查找当前对象不存在的属性时，需要一级级的向上查找。如果我们要查找的属性在较深层的对象中，就会拖慢我们程序的运行速度；如果目标属性不存在中，JS 就会遍历整个原型链，这无疑会对程序的性能造成负面影响。

此外，在遍历对象的属性时，原型链中的每个可枚举属性都将被枚举。如果我们想要检查一个对象是否具有某个属性，并且这个属性是直接定义在该对象上的，而不是定义在它的原型链上的，那么我们需要使用`hasOwnProperty`方法或`Object.hasOwn`方法。

`hasOwnProperty`可以用来检查一个对象是否具有特定的自身属性（也就是该属性不是从原型链上继承来的）。这个方法是定义在`Object.prototype`上的，所以除非一个对象的原型链被设置为`null`（或者在原型链深层被覆盖），否则所有的对象都会继承这个方法。

该方法的使用方法如下：

```JavaScript
let obj = {
    prop: 'value'
};
console.log(obj.hasOwnProperty('prop')); // 输出：true

let objWithNoProto = Object.create(null);
console.log(objWithNoProto.hasOwnProperty); // 输出：undefined
```

此外，除非是为了与新的 JS 特性兼容，否则永远不应扩展原生原型。如果要使用 JS 原型链操作，也要对用户的输入进行严格校验，因为 JS 原型链有着独特的安全问题。

## JS 原型链污染

> JS 原型链污染推荐 phithon 大佬的 [深入理解 JavaScript Prototype 污染攻击](https://www.leavesongs.com/PENETRATION/javascript-prototype-pollution-attack.html#0x03)，以下`merge`示范代码就来自这篇文章。

出于设计上的因素，JS 原型链操作容易产生独特的安全问题——JS 原型链污染。

原理很简单，就是 JS 基于原型链实现的继承机制。如果我们能控制某个对象的原型，那我们就可以控制所有基于该原型创建的对象。以下是一个简单的示范案例：

```JavaScript
// 创建一个空对象 userA
let userA = {};

// 给 userA 添加一个属性 isAdmin
userA.isAdmin = false;
console.log(userA.isAdmin); // false

// 现在我们想让所有用户都有这个属性，我们可以使用原型
userA.__proto__.isAdmin = true;
console.log(userA.isAdmin); // false

// 现在我们创建一个新用户 userB
let userB = {};
// userB 会继承 userA 的 isAdmin 属性
console.log(userB.isAdmin); // true
```

在 CTF 中，往往都是去找一些能够控制对象键名的操作，比如`merge`、`clone`等，这其中`merge`又是最常见的可操纵键名操作。最普通的`merge`函数如下：

```JavaScript
function merge(target, source) {
  for (let key in source) {
      if (key in source && key in target) {
          merge(target[key], source[key])
      } else {
          target[key] = source[key]
      }
  }
}
```

此时，我们运行以下代码，以 JSON 格式创建`o2`，在与`o1`合并的过程中，经过赋值操作`target[key] = source[key]`，实现了一个基本的原型链污染，被污染的对象是`Object.prototype`：

```JavaScript
let o1 = {};
let o2 = JSON.parse('{"a": 1, "__proto__": {"b": 2}}');

merge(o1, o2); // 1 2
console.log(o1.a, o1.b);

o3 = {};
console.log(o3.b); // 2
console.log(Object.prototype); // [Object: null prototype] { b: 2 }
```

还有一个值得思考的问题，如果我们创建`o2`使用的语句是：`let o2 = {a: 1, "__proto__": {b: 2}}`，则不会实现原型链污染，可以思考一下原因。

## 后话

读到这里，应该就能大致理解什么是 JS 原型链了，也对开发和安全中的 JS 原型链有了一个基本的认识。

但还有一个疑问没有解决：JS 原型链的本质是什么，它是一种机制，还是一种数据结构？

原型链（Prototype Chain）从本质上来讲是一种机制，而不是某种特殊的数据结构。只是从习惯上来讲，我们会把从实例对象到 Object 这中间的 `__proto__` 调用称为“原型链”，上面说过的`dog.__proto__.__proto__.__proto__`就是例子——因为这确实很形象。

## 参阅文章

- [Javascript继承机制的设计思想](https://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)，by 阮一峰的网络日志
- [該來理解 JavaScript 的原型鍊了](https://blog.huli.tw/2017/08/27/the-javascripts-prototype-chain/)，by Huli's Blog
- [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)，by MDN Web Docs
- [深入理解 JavaScript Prototype 污染攻击](https://www.leavesongs.com/PENETRATION/javascript-prototype-pollution-attack.html#0x03)，by phithon