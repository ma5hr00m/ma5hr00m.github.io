---
title: 浏览器中的 Event Loop
date: 2024/6/10
author: ma5hr00m
categories:
- JavaScript
---

事件循环是 JavaScript 管理事件执行顺序的流程，具体实现与运行环境有关。本篇文章主要讲述浏览器环境中的事件循环，Node.js 中的事件循环就简单说说分哪几个阶段。

## 同步异步

同步（Synchronous）执行指的是代码按顺序一行接一行地执行。每个操作必须等待前一个操作完成后才能开始。这种模式简单易懂，但它有一个缺点：如果一个操作需要很长时间来完成（例如，从服务器获取数据），它会阻塞后续代码的执行，导致整个程序暂停，直到该操作完成。这对于 Web 应用来说是无法忍受的，总不发出请求后一直等待所有数据全到手之后再渲染页面，这样搞用户的心情想必不会很美丽。

异步（Asynchronous）执行允许代码在等待一个耗时任务（如数据请求）完成时继续执行其他任务。这是通过回调函数、Promises 或 async/await 等机制实现的。异步编程使得 JavaScript 可以同时处理多个操作，提高了程序的效率和用户体验。

## 事件循环

![20240610160305](https://img.ma5hr00m.top/blog/20240610160305.png)

事件循环（Event Loop）是 JavaScript 中处理异步操作的核心机制。它确保即使在单线程环境中，JavaScript 也能够执行非阻塞操作。以下是事件循环的详细流程说明，看完这个就基本清晰异步操作的实现过程了：

1. **执行栈（Execution Stack）：**所有同步任务都在主线程上的执行栈中运行。执行栈是一个按顺序存储函数调用的结构。当一个函数执行完毕，它就会从栈中弹出。
2. **Web API：**当遇到异步任务（如 `setTimeout` 或网络请求）时，浏览器提供的 Web API 会接管这些任务，并在后台运行。
3. **任务队列（Task Queue）：**异步任务完成后，回调函数会被放入任务队列。如果有多个回调，它们会按照它们被添加到队列的顺序排队。
4. **事件循环（Event Loop—）：**事件循环持续检查执行栈是否为空。如果执行栈为空，事件循环会从任务队列中取出第一个回调函数，并将其推入执行栈中执行。
5. **微任务队列（Microtask Queue）：**微任务（如 `Promise` 的回调）会被添加到微任务队列。微任务队列的特点是在当前执行栈清空后，事件循环会在执行下一个宏任务（如 `setTimeout` 的回调）之前，先执行所有微任务。
6. **渲染 (Rendering)**: 在某些情况下，如页面渲染或用户交互，浏览器会在适当的时候执行渲染任务。

这个过程不断重复，形成了一个循环，确保 JavaScript 可以连续处理任务，而不会阻塞主线程。这就是事件循环的工作原理，它使得即使是单线程的 JavaScript 也能够支持复杂的异步操作和高效的用户交互。

## 宏任务微任务

介绍事件循环时有提到宏任务和微任务，解宏任务（Macro Task）和微任务（Micro Task）对于掌握事件循环至关重要。这两种任务决定了代码的执行顺序和时机。

### 本质区别

**宏任务**是由宿主环境（如浏览器或 Node.js）发起的任务。它们通常包括：

- **`setTimeout`**
- **`setInterval`**
- **`I/O`**
- UI渲染
- **`postMessage`**
- **`MessageChannel`**

**而微任务**则是由 JavaScript 引擎发起的任务，它们通常用于处理一些不需要长时间运行或等待的操作，如：

- **`Promise.then`**
- **`MutationObserver`**
- **`process.nextTick`** （Node.js）

宏任务和微任务的执行时机不同。在每次事件循环中，一个宏任务会被执行，然后所有的微任务会被执行。这意味着微任务总是在当前宏任务结束后立即执行，而不是等待下一个宏任务。

这种区分允许 JavaScript 引擎优化异步操作的处理。通过微任务，JavaScript 可以快速响应并处理短暂的异步操作，而宏任务则用于可能需要更多时间来完成的操作。这种机制确保了即使在单线程环境中，JavaScript 也能够有效地处理复杂的异步场景。

### 产生原因

从前文事件循环的实现流程可以看出，宏任务和微任务的概念与其密切相关。事件循环是 JavaScript 早期就存在的机制，但微任务的概念是随着 ES6 规范的引入才明确的，特别是在引入`Promise`之后。`Promise`是在 ES6 中正式成为标准的，它允许 JavaScrip t引擎自身发起异步任务，而不仅仅依赖于宿主环境。

这俩概念的提出是为了解决 JavaScript 在处理异步操作时的效率问题。在早期的 JavaScript 中，所有的异步操作都被视为宏任务，这导致了效率低下和响应性差的问题。通过引入微任务，JavaScript 能够更快地处理那些不需要等待的异步操作，从而提高了程序的整体性能。

### 示范代码

前文说得已经比较清楚了，这里再给个代码示范：

```jsx
console.log('宏任务开始');  

setTimeout(function() {
  console.log('宏任务');
}, 0);

Promise.resolve().then(function() {
  console.log('微任务 1');
}).then(function() {
  console.log('微任务 2');
});

console.log('宏任务结束');
```

以上代码的输出如下，初学者可以思考下输出为什么是这个顺序：

```bash
宏任务开始
宏任务结束
微任务 1
微任务 2
宏任务
```

以下是这段代码运行时发生的事件顺序：

1. 因为`console.log`是同步操作，所以首先会在控制台打印出`'宏任务开始'`；
2. `setTimeout`是一个宏任务。尽管它设置了`0`毫秒的延迟，但它不会立即执行。它会被添加到宏任务队列中，在当前执行上下文清空并且所有微任务都被处理后执行；
3. `Promise.resolve()`创建了一个已解决的promise，这是一个微任务。`.then`方法被链式调用来处理微任务。这些将被添加到微任务队列中，并且会在当前调用栈为空时立即执行，但在下一个宏任务之前；
4. 接下来，因为是下一行同步代码，所以会在控制台打印出`'宏任务结束'`；
5. 在当前宏任务（即整个脚本）执行完毕后，JavaScript引擎会检查是否有微任务在队列中。它找到了promise的`.then`方法中的回调，并按顺序执行它们。这导致控制台依次打印出`'微任务 1'`和`'微任务 2'`；
6. 所有微任务完成后，引擎会检查宏任务队列。现在执行`setTimeout`的回调，控制台打印出`'宏任务'`。

## 定时器不准确

学到东西就要拿来解决问题，定时器不准确就算是一个经典问题。在 JavaScript 中，定时器的不准确性主要是由于事件循环的工作方式造成的。`setTimeout` 和 `setInterval` 这样的定时器函数并不保证回调函数会在指定的时间精确执行。**定时器只是在指定的延迟后将回调函数放入事件队列**，但实际上它何时被执行取决于主线程上当前正在执行的任务。

当你设置一个定时器时，例如 `setTimeout(callback, 2000)`，你告诉 JavaScript 引擎在大约 2 秒后将 `callback` 放入事件队列。但是，如果主线程在执行长时间运行的同步任务，如你的 `syncFunc` 函数，它会阻塞线程，直到该任务完成。在这段时间内，即使定时器的时间已经过去，回调函数也不会执行，因为事件循环必须等待主线程变为空闲才能从事件队列中取出回调函数并执行它。

下面是一个简化的事件循环流程，以帮助理解：

1. **执行同步代码**：主线程首先执行所有同步代码。
2. **设置定时器**：遇到 `setTimeout`，将其回调函数和计时请求交给定时器线程。
3. **计时结束**：定时器线程计时结束后，通知事件触发线程。
4. **排队等待**：事件触发线程将定时器回调放入事件队列。
5. **检查主线程**：如果主线程空闲，事件循环将从事件队列中取出回调函数执行；如果主线程忙，回调函数必须等待。

为了避免定时器不准确，开发者应该尽量避免在主线程上执行长时间的同步任务。如果必须执行这样的任务，可以考虑使用 Web Workers 或者将任务分解为更小的部分，使用 `requestAnimationFrame` 或 `requestIdleCallback` 来安排非紧急任务的执行。

```jsx
// 示例代码
const syncFunc = (startTime) => {
  const time = new Date().getTime();
  while (new Date().getTime() - time < 5000) { /* 长时间同步阻塞 */ }
  const offset = new Date().getTime() - startTime;
  console.log(`同步函数执行完毕，时间偏差：${offset}毫秒`);
};

const asyncFunc = (startTime) => {
  setTimeout(() => {
    const offset = new Date().getTime() - startTime;
    console.log(`异步函数执行完毕，时间偏差：${offset}毫秒`);
  }, 2000);
};

const startTime = new Date().getTime();
asyncFunc(startTime);
syncFunc(startTime);

```

在上述代码中，`syncFunc` 会阻塞主线程5秒钟，即使 `asyncFunc` 的定时器在2秒后到期，它的回调也必须等待 `syncFunc` 完成。这就是为什么定时器的执行时间可能不准确。为了提高定时器的准确性，应当尽量减少同步代码的执行时间，或者使用其他机制来处理长时间运行的任务。

## requestAnimationFrame & requestIdleCallback

`requestAnimationFrame()` 和 `requestIdleCallback()` 是两个与浏览器事件循环和渲染过程紧密相关的 Web API。它们在不同的时间点被调用，以优化性能和响应性。`requestAnimationFrame()` 适合需要与屏幕刷新率同步的任务，如动画，而 `requestIdleCallback()` 适合可以推迟执行的任务，如统计和数据处理。

### **requestAnimationFrame()**

`requestAnimationFrame()` 主要用于动画和页面重绘之前的更新操作，它告诉浏览器你希望执行动画，并请求浏览器在下次重绘之前调用指定的函数来更新动画。函数通常在每次屏幕刷新之前执行，大约是每秒 60 次，但这会根据浏览器和设备的性能而变化。使用 `requestAnimationFrame()` 可以保证动画的流畅性，因为它是在浏览器准备好绘制新帧时执行。

```jsx
// 使用 requestAnimationFrame 请求动画帧
function updateAnimation() {
  // 更新动画的代码
  // ...
  requestAnimationFrame(updateAnimation);
}

// 开始动画
requestAnimationFrame(updateAnimation);
```

我之后准备出一些关于前端动效实现的文章，到时候细说这个 API，现在先给一个尽可能简单的示范。

### **requestIdleCallback()**

`requestIdleCallback()` 用于在主线程空闲时执行低优先级的任务，当事件循环空闲，并且没有其他脚本或渲染任务需要执行时，浏览器会调用通过 `requestIdleCallback()` 注册的回调函数。这个 API 的目的是在不影响性能和响应性的情况下，利用空闲时间执行后台和低优先级的工作，回调函数会接收一个 `IdleDeadline` 对象，提供了一个 `timeRemaining()` 方法，该方法可以告诉你当前帧中剩余多少时间可以用于执行代码。

举一个相对贴近实际的例子，即如何在一个假想的大型电商网站中使用 **`requestIdleCallback()`** 来优化图片懒加载功能：

```jsx
// 假设有一个函数用于懒加载图片
function lazyLoadImages(images) {
  images.forEach(image => {
    if (isInViewport(image)) {
      loadImage(image);
    }
  });
}

// 使用 requestIdleCallback 来调度懒加载任务
function scheduleLazyLoad(images) {
  // 如果浏览器支持 requestIdleCallback，则使用它
  if ('requestIdleCallback' in window) {
    requestIdleCallback(deadline => {
      while (deadline.timeRemaining() > 0 && images.length > 0) {
        lazyLoadImages(images.splice(0, 2)); // 每次处理两个图片
      }

      // 如果还有图片未处理，继续调度
      if (images.length > 0) {
        scheduleLazyLoad(images);
      }
    });
  } else {
    // 如果浏览器不支持 requestIdleCallback，则回退到 setTimeout
    setTimeout(() => lazyLoadImages(images), 0);
  }
}

// 假设页面上有很多图片需要懒加载
const allImages = document.querySelectorAll('.lazy-load-image');
scheduleLazyLoad(Array.from(allImages));
```

在这个示例中，`scheduleLazyLoad` 函数使用 `requestIdleCallback` 来安排图片的懒加载。它会检查浏览器是否支持 `requestIdleCallback`，如果支持，就使用它来在浏览器空闲时加载图片。每次回调函数被调用时，它会处理一小批图片，确保不会占用太多的主线程时间，从而不影响用户的交互体验。

如果浏览器不支持 `requestIdleCallback`，则使用 `setTimeout` 作为回退方案。这样可以确保在所有浏览器中都能实现懒加载功能，同时在支持的浏览器中提供更好的性能。

## Node.js 中的事件循环

虽然用的都是 V8 引擎（暂且这么说），但因为使用场景和任务的不同，Node.js 的事件循环与浏览器中 JavaScript 原生的事件循环存在差异。

从整体上来看，最显著的差异就是 Node.js 的事件循环分阶段，每个阶段都有一个 FIFO 队列，只有当队列的事件执行完或达到该阶段的上限时，才会进入下一个阶段。Node.js 会在每次事件循环之间检查是否在等待任何 I/O 或定时器，如果没有，则程序关闭退出，一次完整的 Node.js 事件循环包括以下几个阶段：

- **timers 阶段**: 执行 `setTimeout()` 和 `setInterval()` 定时器的回调函数。
- **pending callbacks 阶段**: 执行延迟到下一个循环迭代的 I/O 回调。
- **idle, prepare 阶段**: 仅系统内部使用。
- **poll 阶段**: 检索新的 I/O 事件; 执行与 I/O 相关的回调，几乎所有的异步操作都在这个阶段处理。
- **check 阶段**: `setImmediate()` 的回调在这里执行。
- **close callbacks 阶段**: 执行一些关闭的回调函数，如 `socket.on('close', ...)`。

其中的 poll 阶段需要注意，如果 poll 队列执行完没有`setImmediate`但是有定时器到期，就会绕回去执行 timers 阶段。

![20240610160523](https://img.ma5hr00m.top/blog/20240610160523.png)

## 阅读文章

- [請說明瀏覽器中的事件循環 (Event Loop)｜ExplainThis](https://www.explainthis.io/zh-hant/swe/what-is-event-loop)
- [异步和EventLoop · 前端进阶](https://dennisgo.cn/Articles/JavaScript/AsyncAndEventLoop.html)