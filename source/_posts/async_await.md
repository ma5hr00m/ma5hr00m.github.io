---
title: 流畅地使用 async/await
date: 2024/6/11
author: ma5hr00m
categories:
- JavaScript
---

`async/await` 是 JavaScript 用来处理异步操作的语法。它们建立在 Promise 的基础上，提供了一种简洁直观的方式来编写和管理异步代码，现在也已经成为了 JavaScript 实际上的最佳异步编程方案。

## Generator

`async` 实质上就是早期的 `generator` 函数的语法糖。

JavaScript 中的生成器（Generator）函数是 ES6 引入（与 Promise 一起）的一种特殊类型的函数。生成器这个概念最初来自于其他编程语言，如 Python，把这东西引入到 JavaScript 中，主要是为了简化异步编程和迭代操作。

### 语法

`generator` 函数的本质是一种可以暂停执行和恢复执行的函数，它返回一个遵循迭代器协议的生成器对象（即 `Iterator` 对象）。这个对象通过 `next()` 方法进行迭代，每次调用 `next()` 都会执行到下一个 `yield` 表达式，并返回一个包含 `value` 和 `done` 属性的对象，其中 `value` 表示返回的值，`done` 表示是否完成所有迭代。

`yield` ****表达式是暂停、恢复执行的关键。在生成器函数体内，使用 `yield` 表达式来暂停函数的执行，并返回一个值到生成器外部。当外部代码再次调用生成器的 `next()` 方法时，生成器函数会从上次暂停的地方继续执行。

语法也比较简单，可以看看以下示范：

```jsx
function* numberGen3erator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator(); // 调用生成器函数创建生成器对象
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
```

看到这语法结构，你可能会感到熟悉，稍后再说。

### co

既然介绍 `generator` 和 `async` 的关系，那就要说到 `co`。

`co` 库是一个用于 Node.js 和浏览器的 JavaScript 库，由 TJ Holowaychuk 开发。它基于 `generator` 来控制异步流程，允许开发者以一种看起来几乎像同步代码的方式来编写非阻塞的异步代码。`co` 库的核心功能是自动执行生成器函数，处理 `yield` 关键字后面跟随的任何 `Promise` 对象，并在 `Promise` 解决后继续执行生成器函数。

- **`co`** 库可以将生成器函数转换为返回 **`Promise`** 对象的函数。
- 它支持 **`yield`** 关键字后面跟随的 **`Promise`** 对象、Thunk 函数、数组（并行执行）、对象（并行执行）、生成器和生成器函数（委托）。
- **`co`** 库的使用前提是生成器函数的 **`yield`** 命令后面只能是 Thunk 函数或 **`Promise`** 对象。

```jsx
const co = require('co');

co(function* () {
  var result = yield Promise.resolve(true);
  return result;
}).then(function (value) {
  console.log(value); // true
});
```

在这个示例中，`co` 函数接受一个 `generator` 作为参数，并返回一个 `Promise` 对象。生成器函数内部通过 `yield` 暂停执行，等待 `Promise` 解决，然后 `co` 库会自动恢复执行。

### 对比

有了前面的铺垫，这里做个对比：

```jsx
// async/await
async function fetchData() {
  const data = await fetch('some-url');
  console.log(data);
}

// generator + co
function fetchData() {
  return co(function* () {
    const data = yield fetch('some-url');
    console.log(data);
  });
}
```

一目了然，在语法结构层面，你只需要去除 `co`，然后将 `*` 替换为 `async`，`yield` 替换为 `await` 即可。既然 `async` 是对 `generator` 的封装，那肯定做了一些优化，主要体现在以下四点：

1. 内置执行器，无需使用额外的 `co` 库，也不需要手动指定 `.next()`；
2.  语义性好，代码更简洁；
3. 适用性广泛，`await`命令后面，可以是 Promise 对象和原始类型的值，没有了 `yield` 的限制；
4. 返回值为 Promise，可以使用 `.then` 等语法，更方便。

> `async` 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 `await` 命令就是内部 `then` 命令的语法糖。
> 

## 使用

### async 语法

使用 `async` 关键字可以声明一个异步函数（async function），这种函数会返回一个 `Promise` 对象。如果函数体内有返回值，那么这个值会被 `Promise.resolve()` 包装。如果函数抛出错误，则会被 `Promise.reject()` 包装。

```jsx
async function f() {
  return "Hello, World!";
}

f().then(alert); // "Hello, World!"
```

### await 语法

`await` 关键字用于等待一个 `Promise` 完成（fulfilled）或拒绝（rejected）。它只能在异步函数内部使用。当 `await` 表达式暂停执行异步函数时，它会等待 `Promise` 解决，然后恢复异步函数的执行并返回解决的值。

```jsx
async function f3() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("完成!"), 1000)
  });

  let result = await promise; // 等待直到 promise 解决 (*)

  alert(result); // "完成!"
}
```

### 错误处理

`async` 异步编程错误处理的姿势比较多，比较推荐的是老老实实使用 `try...catch...`，虽然这可能造成有些情况下难以找到具体错误代码（比如 `await` 被嵌套在其他操作中）。

另一种方案是在 `await` 之后使用 `catch()` 块捕获错误，也可以，但会造成代码风格上的冲突。

此外，还有一种有趣的 Golang 代码风格的错误处理方式。我们可以通过创建一个包装函数来模拟这种行为，这个函数接受一个 **`Promise`** 并返回一个包含两个值的数组：一个错误和一个结果，这样我们就可以使用数组解构来同时获取错误和结果，而不需要使用 **`try...catch...`** 块。这种方法使得错误处理更加显式。

下面是一个实现这种错误处理的示范：

```jsx
// 'to' 函数用于转换 Promise，以便它返回一个包含错误和结果的数组
function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(err => [err]);
}

// 异步函数使用 'to' 函数和 'await' 来处理 fetch 请求
async function fetchUrl(url) {
  const [err, response] = await to(fetch(url));
  if (err) {
    console.error('Fetch error:', err);
    return;
  }
  const [parseErr, data] = await to(response.json());
  if (parseErr) {
    console.error('JSON parsing error:', parseErr);
    return;
  }
  console.log('Fetched data:', data);
}
```

### 示范

模拟用户登录流程，流程看注释：

```jsx
// 假设我们有一个用于请求用户数据的函数
function getUser(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'Alice') {
        resolve({ id: 1, username: 'Alice', verified: true });
      } else {
        reject(new Error('用户不存在'));
      }
    }, 1000);
  });
}

// 假设我们有另一个函数用于验证用户
function verifyUser(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.verified) {
        resolve('用户验证成功');
      } else {
        reject(new Error('用户验证失败'));
      }
    }, 1000);
  });
}

// 使用 async/await 和 .then().catch() 结合处理登录流程
async function loginUser(username) {
  try {
    // 使用 await 等待 getUser 函数解决
    const user = await getUser(username);
    // 使用 await 等待 verifyUser 函数解决
    const verificationStatus = await verifyUser(user);
    console.log(verificationStatus);
  } catch (error) {
    // 处理任何在 getUser 或 verifyUser 中抛出的错误
    console.error(error.message);
  }
}

// 调用 loginUser 函数，并使用 .then().catch() 处理最终结果
loginUser('Alice')
  .then(() => {
    console.log('登录流程完成');
  })
  .catch((error) => {
    console.error('登录流程中发生错误:', error.message);
  })
```

实际处理异步操作就套用这个 combo。此外还有一些使用时的注意点，这里也做补充：

1. 多个 `await` 之间如果不存在继发关系，用 `Promise.all()` 统一处理，避免额外耗时；
2. `async` 函数保留运行栈。

最后一条特性需要个小例子来解释：

```jsx
// b() 执行时 a() 同步执行，若 b() or c() 报错，错误堆栈可能不包括 a()
const a = () => {
  b().then(() => c());
};

// b() 执行时 a() 暂停执行，上下文保留，b() or c() 报错，错误堆栈一定包括 a()
const a = async () => {
  await b();
  c();
};
```

### 实例：顺序完成异步加载

`async` 内部的多个 `await` 使继发执行的，如果这些异步操作没有相互依赖，这种特性会降低运行效率，所以我们可以使用以下代码并发发出请求，然后顺序获得结果：

> 代码案例来自阅读文档1
> 

```jsx
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

## 顶层 await

除了在 `async` 代码块中，我们也可以在模块的顶层代码中使用 **`await`** 关键字。

当模块需要在执行任何其他代码之前完成某些异步操作，如数据加载、资源配置等，或者当一个模块依赖于另一个异步解析的模块时，可以使用顶层 **`await`** 确保所有依赖都已正确加载。

```jsx
// config.js
export async function loadConfig() {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('配置加载失败');
  }
  return response.json();
}
```

```jsx
// main.js
import { loadConfig } from './config.js';

let config;

try {
	// 使用顶层 await 确保配置在继续之前被加载
  config = await loadConfig();
} catch (error) {
  console.error('无法加载配置:', error);
}

applyConfig(config);
```

这种写法有个显而易见的好处——我们不需要在主程序中再额外包裹一层 `async`，而且虽然操作是异步的，但顶层 **`await`** 使得代码的读写更像是同步操作，易于理解和维护。

同时，这种写法也确保了服务的可靠性。如果开发者单纯写一个脚本，然后在主模块中同步加载这个脚本，则很难控制异步操作的结果，因为主模块没法控制异步操作是否完成，以下面的代码为例，usage.js 无法确保自己获得了一个合理的 output 还是一个 `undefined`。

> 代码案例来自阅读文档1
> 

```jsx
// awaiting.js
let output;
async function main() {
  const dynamic = await import(someMission);
  const data = await fetch(url);
  output = someProcess(dynamic.default, data);
}
main();
export { output };
```

```jsx
// usage.js
import { output } from "./awaiting.js";

function outputPlusValue(value) { return output + value }

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100)), 1000);
```

旧版的解决方法是让 awaiting.js 返回一个 Promise 对象，通过这个 Promise 对象判断异步操作是否结束。

> 代码案例来自阅读文档1
> 

```jsx
// awaiting.js
let output;
export default (async function main() {
  const dynamic = await import(someMission);
  const data = await fetch(url);
  output = someProcess(dynamic.default, data);
})();
export { output };
```

```jsx
// usage.js
import promise, { output } from "./awaiting.js";

function outputPlusValue(value) { return output + value }

promise.then(() => {
  console.log(outputPlusValue(100));
  setTimeout(() => console.log(outputPlusValue(100)), 1000);
});
```

这种写法虽然保证了数据的可靠性，但使代码变得臃肿，开发者必需时刻记得在调用这个子模块时要使用 Promise 加载，并且所有依赖这个子模块的模块都需要使用 Promise 加载，一层层地套回去了。而顶层 await 就直接解决了这个问题。

## 小坑

### 混用 `await` 和 `.then()`

这是一种不被推荐的做法。

如果你在一个 **`async`** 函数中使用 **`await`**，然后在同一个 **`await`** 调用后面紧接着使用 **`.then()`**，这可能会让人困惑，因为它混合了两种不同的风格，使代码的意图不够清晰。

```jsx
async function fetchData() {
  const data = await fetch('some-api-url')
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
  return data;
}

```

业务逻辑明确的话，代码不会给你一拳，但其他开发者会给你一拳。

## 阅读文档

1. https://es6.ruanyifeng.com/#docs/async
2. https://www.cnblogs.com/porter/p/13343524.html