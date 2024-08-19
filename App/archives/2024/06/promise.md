# Promise 使用一览

Promise 规范最早由 CommonJS 社区提出，后来成为 ES2015（ES6） 语言规范，到现在可以说已经成了异步编程的首选方案。

[使用 Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

[Promise](https://www.liaoxuefeng.com/wiki/1022910821149312/1023024413276544)

### 状态

- `Penfing`  等待
- `Fulfilled` 成功
- `rejected` 失败

### 构造函数 Promise(excutor)

`Promise` 构造函数是 JavaScript 中用于处理异步操作的一个重要工具。

- **构造函数 `Promise(executor)`**：
    - `Promise` 构造函数接受一个名为 `executor` 的回调函数作为参数。当你创建一个 `Promise` 实例时，这个 `executor` 函数会被立即执行。
    - `executor` 函数接收两个参数：`resolve` 和 `reject`。这两个参数也是函数，你可以在 `executor` 函数内部调用它们来改变 `Promise` 的状态。
- **状态变更**：
    - 当 `resolve` 被调用时，它会将 `Promise` 的状态从 “pending”（等待）变更为 “fulfilled”（已完成）。
    - 当 `reject` 被调用时，它会将 `Promise` 的状态从 “pending”（等待）变更为 “rejected”（已失败）。
    - 如果 `executor` 函数中抛出了一个错误，那么 `Promise` 会自动变更为 “rejected” 状态，并且错误对象会被作为 `reject` 函数的参数传递出去。
- **返回新的 `Promise`**：
    - 在 `executor` 函数中，你可以通过 `resolve` 返回一个值，或者通过 `reject` 返回一个错误。
    - 如果你在 `resolve` 中传递了另一个 `Promise`（比如 `Promise.reject("err")`），那么当前 `Promise` 的状态将会跟随传递进来的 `Promise` 的状态。

这是一个简单的例子来说明这个概念：

```jsx
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const data = fetchData(); // 假设这是一个获取数据的函数
    if (data) {
      resolve(data); // 如果数据获取成功，使用resolve改变Promise状态为fulfilled
    } else {
      reject('数据获取失败'); // 如果数据获取失败，使用reject改变Promise状态为rejected
    }
  }, 1000);
});

promise.then(data => {
  console.log(data); // 如果Promise状态为fulfilled，这里将输出获取到的数据
}).catch(error => {
  console.error(error); // 如果Promise状态为rejected，这里将输出错误信息
});

```

在这个例子中，`promise` 是一个新创建的 `Promise` 对象。我们传递了一个 `executor` 函数给 `Promise` 构造函数，这个函数内部执行了一个异步操作（`setTimeout`）。当异步操作完成后，我们根据结果调用 `resolve` 或 `reject` 来改变 `Promise` 的状态。然后我们可以使用 `.then()` 和 `.catch()` 方法来处理 `Promise` 成功或失败的结果。

## 实例方法

### then(onFulfilled, onRejected)

![20240609140952](https://img.ma5hr00m.top/blog/20240609140952.png)

`then(onFulfilled, onRejected)` 方法是 `Promise` 对象的一个非常重要的特性，它允许你为 `Promise` 注册 `onFulfilled` 和 `onRejected` 回调函数。

- **作用**：
    - 为 `Promise` 注册 `onFulfilled` 和 `onRejected` 回调函数，这些函数分别在 `Promise` 成功（fulfilled）或失败（rejected）时被调用。
    - 返回一个新的 `Promise` 对象，使得可以实现链式调用。这意味着你可以在一个 `then` 调用后继续添加更多的 `then` 或 `catch` 方法。
- **特性**：
    - `then` 方法会自动返回一个新的 `Promise` 对象。这个新的 `Promise` 对象的状态（fulfilled 或 rejected）将由 `onFulfilled` 或 `onRejected` 回调函数的返回值决定。
    - 如果 `onFulfilled` 或 `onRejected` 回调函数返回一个值，那么新的 `Promise` 将以这个值为结果被解决（resolve）。
    - 如果回调函数返回另一个 `Promise`，那么新的 `Promise` 将“跟随”这个 `Promise` 的状态，即如果返回的 `Promise` 被解决，新的 `Promise` 也会被解决；如果返回的 `Promise` 被拒绝，新的 `Promise` 也会被拒绝。

这种机制允许你创建复杂的异步代码序列，其中一个操作的完成可以链接到下一个操作，而不需要嵌套回调函数。这样做可以提高代码的可读性和可维护性。

例如，你可以这样使用 `then` 方法：

```jsx
doSomething()
  .then(function(result) {
    return doSomethingElse(result);
  })
  .then(function(newResult) {
    return doThirdThing(newResult);
  })
  .then(function(finalResult) {
    console.log('最终结果: ' + finalResult);
  })
  .catch(failureCallback);

```

在这个例子中，每个 `then` 都返回一个新的 `Promise`，并且每个 `Promise` 的解决值都是上一个回调函数的返回值。如果在任何一个步骤中出现错误，`catch` 方法将捕获这个错误，你可以在这里处理错误。这就是 `Promise` 链式调用的强大之处。

### catch(onRejected)

`catch(onRejected)` 方法是 `Promise` 对象的一个方法，它用于处理 `Promise` 被拒绝（即执行了 `reject` 函数）的情况。

- **作用**：
    - `catch(onRejected)` 方法为 `Promise` 添加一个 `onRejected` 回调函数，这个函数在 `Promise` 被拒绝时执行。
- **特性**：
    - `catch` 方法会返回一个新的 `Promise` 对象。
    - 这个新的 `Promise` 将以 `catch` 方法中回调函数的返回值来解决（resolve）。

```jsx
const promise = new Promise((resolve, reject) => {
  // 这里的 Promise 被明确地拒绝了
  reject(100);
});

promise
  .catch((reason) => {
    // 这里处理 Promise 被拒绝的情况
    console.log(reason); // 输出：100
    return 200; // 'catch' 函数的返回值将作为新 Promise 的解决结果
  })
  .then((res) => {
    // 这里处理上一个 'catch' 返回的新 Promise 的解决结果
    console.log(res); // 输出：200
  });
```

在以上代码示例中，`promise` 是一个被明确拒绝（`reject(100)`）的 `Promise` 对象。当 `promise` 被拒绝时，`.catch` 方法中的回调函数被调用，并打印出拒绝的原因（在这个例子中是数字 `100`）。然后，`catch` 方法中的回调函数返回了一个值 `200`，这个值将作为新 `Promise` 的解决结果。

接下来，`.then` 方法被用来处理这个新 `Promise` 的解决结果。因为 `catch` 方法返回的新 `Promise` 被解决（resolve）了，所以 `.then` 方法中的回调函数会被执行，并打印出 `200`。

通过这种方式，`catch` 不仅允许我们处理错误，还可以恢复代码执行流程，允许后续的 `then` 方法继续正常工作。这是 `Promise` 链式调用中错误处理的一个重要部分。

### finally(finallyCallback)

`finally(finallyCallback)` 方法是 `Promise` 对象的一个方法，它允许你添加一个不依赖于 `Promise` 最终状态的回调函数。这个 `finallyCallback` 无论 `Promise` 成功（resolved）还是失败（rejected），都会被执行。

- **作用**：
    - `finally(finallyCallback)` 方法给 `Promise` 添加一个事件处理回调函数，这个函数在 `Promise` 完成后总会执行。
- **特性**：
    - `finally` 方法不接收任何参数，这意味着你不能从 `finallyCallback` 内部获取到 `Promise` 的执行结果。
    - `finally` 方法会返回一个新的 `Promise`。这个新的 `Promise` 通常与原始 `Promise` 有相同的状态和值，除非 `finallyCallback` 中抛出了异常或返回了一个被拒绝的 `Promise`。

```jsx
const promise = new Promise((resolve, reject) => {
  // 这里的 Promise 被解决了
  resolve(100);
});

promise
  .finally(() => {
    // 'finally' 回调函数无论成功或者失败，始终会被执行
    console.log("finally回调函数无论成功或者失败，始终会被执行");
    // 'finally' 回调函数内获取不到promise执行结果，所以这里打印 undefined
    console.log(res); // 输出：undefined
  })
  .then((res) => {
    // 'finally' 回调函数返回一个新的promise，实现链式调用
    // 这里的 'res' 是上一个 'resolve' 的结果
    console.log(res); // 输出：100
  });
```

在以上代码示例中，`promise` 是一个被解决（`resolve(100)`）的 `Promise` 对象。`.finally` 方法添加了一个回调函数，这个函数会在 `Promise` 完成后执行，但它不会接收任何参数，因此 `console.log(res);` 中的 `res` 是 `undefined`。

然后，`.then` 方法处理 `Promise` 的解决结果。由于 `finally` 方法不改变 `Promise` 的状态或值（除非抛出异常或返回被拒绝的 `Promise`），所以 `.then` 方法中的回调函数会接收到 `100` 并打印出来。

`finally` 方法通常用于执行清理操作，例如关闭文件、清除超时等，这些操作不依赖于操作的成功或失败。这使得代码更加简洁，因为你不需要在 `then` 和 `catch` 中重复相同的清理逻辑。

## 静态方法

### Promise.all(promiseArray)

`Promise.all(promiseArray)` 是一个用于处理多个 `Promise` 对象的方法。它接受一个数组作为参数，这个数组可以包含 `Promise` 对象或其他值。

- **作用**：
    - `Promise.all` 接受一个数组作为参数，这个数组中可以包含 `Promise` 对象和其他类型的值。
    - 它将并发执行数组中的所有 `Promise` 对象，并且会等待所有 `Promise` 对象执行完毕。
- **特性**：
    - 执行结果会以数组形式返回，数组中的元素顺序与传入的 `promiseArray` 一一对应。
    - 如果数组中的元素是普通值，`Promise.all` 会直接将这些值放入结果数组中。
    - 如果数组中的元素是 `Promise` 对象，`Promise.all` 会等待这些 `Promise` 对象执行结束，并将结果放入返回的数组中。

```jsx
// 创建两个 Promise 对象
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 2000);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2");
  }, 1000);
});

// 使用 Promise.all 处理包含普通值和 Promise 对象的数组
const promiseAll = Promise.all([1, 2, promise1, 3, 4, promise2, 5]);
promiseAll.then((res) => {
  // 并发执行 Promise，等待所有任务执行完毕后统一返回结果
  console.log(res); // 输出：[1, 2, "p1", 3, 4, "p2", 5]
});

// 如果数组中的任何一个 Promise 执行失败，整个 Promise.all 将执行失败
const promiseAllFail = Promise.all([1, 2, promise1, 3, 4, Promise.reject('失败'), 5]);
promiseAllFail.then((res) => {
  console.log(res);
}).catch(e => {
  // 任何一个任务失败，将导致整个 Promise.all 执行失败
  console.log('fail', e); // 输出：fail 失败
});

```

在代码示例中，`promise1` 和 `promise2` 是两个 `Promise` 对象，它们分别在 2000 毫秒和 1000 毫秒后解决。`promise2` 被拒绝了。在这种情况下，`Promise.all` 返回的 `Promise` 也会被拒绝，并且 `catch` 方法会被调用。这意味着，如果 `promiseArray` 中任何一个 `Promise` 对象被拒绝，`Promise.all` 返回的 `Promise` 也会被拒绝，即使其他 `Promise` 对象已经成功解决。

### Promise.allSettled

`Promise.allSettled` 允许你同时处理多个 promise。这个方法会等待所有传入的 promises 要么完成（fulfilled），要么拒绝（rejected），然后返回一个对象数组，每个对象表示对应的 promise 结果。

- **特性**
    - **返回值**：它返回一个 promise，该 promise 在所有给定的 promises 已经完成或拒绝后解决。
    - **结果对象**：每个结果都是一个对象，包含两个属性：`status` 和 `value` 或 `reason`。如果 promise 成功完成，`status` 为 `'fulfilled'`，并且 `value` 属性会包含 promise 的结果。如果 promise 被拒绝，`status` 为 `'rejected'`，并且 `reason` 属性会包含拒绝的原因。
    - **错误处理**：与 `Promise.all` 不同，`Promise.allSettled` 不会在遇到第一个拒绝的 promise 时立即拒绝。它会等待所有的 promises 都已经完成或拒绝，给你一个完整的结果集。

这里就不给代码示范了，直接把这个方法当作 `.all` 的改版就行。但注意，虽然 `Promise.allSettled` 目前已经是 ECMAScript 2020 标准的一部分，但在一些旧的浏览器版本中可能不被支持。在使用之前，最好检查目标环境是否支持这个特性。如果不支持，就需要使用一个 polyfill 来提供相同的功能。

### **Promise.race**

**`Promise.race`** 用来处理多个 promises。这个方法接受一个 promise 数组作为输入，并且会返回一个新的 promise，这个新的 promise 会以数组中**第一个**完成（无论是解决还是拒绝）的 promise 的结果来解决。

- 特征
    - **并发执行**：传入的所有 promises 会同时开始执行。
    - **快速响应**：只要数组中的任何一个 promise 完成，**`Promise.race`** 就会立即解决。
    - **结果**：返回的 promise 的结果是数组中第一个完成的 promise 的结果。
    - **用途**：常用于实现超时功能，例如，如果一个网络请求在指定时间内没有响应，就会被认为是超时。

```jsx
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 2000);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2");
  }, 1000);
});
const promise3 = new Promise((resolve, reject) => {
  // 假设500毫秒后网络超时
  setTimeout(() => {
    reject("超时了");
  }, 500);
});

const promiseRace = Promise.race([promise1, promise2, promise3]);
promiseRace
  .then((res) => {
    // 这里会打印出 "超时了"，因为 promise3 是最快完成的
    console.log(res);
  })
  .catch((e) => {
    // 如果 promise3 被拒绝，错误会在这里被捕获
    console.log("fail", e);
  });
```

代码示例中，**`promise1`**、**`promise2`** 和 **`promise3`** 分别设置了不同的超时时间。**`Promise.race`** 会返回最快完成的 promise 的结果。在这个例子中，**`promise3`** 由于设置了最短的超时时间（500毫秒），所以它会首先完成，无论是解决还是拒绝，**`Promise.race`** 都会以 **`promise3`** 的结果来解决。

在实际应用中，**`Promise.race`** 可以帮助你确保你的程序在遇到慢网络连接或者其他可能导致延迟的情况时，能够及时响应。

### **Promise.reject**

**`Promise.reject`** 方法在 JavaScript 中用于创建一个状态为拒绝（rejected）的 Promise。这个方法通常用于测试或者当你需要一个已知会失败的 Promise 时。

- 特征
    - 你可以传递任何理由（reason），这个理由会被传递给 **`.catch()`** 方法的回调函数。

```jsx
Promise.reject("rejected")
  .then((res) => {
    // 这个回调不会被调用，因为 Promise 已经被拒绝
    console.log('value', res);
  })
  .catch((reason) => {
    // 这个回调会被调用，打印出 "reason rejected"
    console.log('reason', reason);
  });
```

代码示例中，**`Promise.reject`** 被用来创建一个立即失败的 Promise，并且提供了一个字符串 “rejected” 作为失败的理由。然后，使用 **`.then()`** 方法来设置一个处理成功解决的回调函数，以及使用 **`.catch()`** 方法来设置一个处理拒绝的回调函数。

在实际应用中，**`Promise.reject`** 可以用于快速创建一个失败的 Promise，以便于在函数中进行错误处理或者在测试中模拟失败的异步操作。

### Promise.resolve

`Promise.resolve` 方法在 JavaScript 中用于创建一个状态为解决（fulfilled）的 Promise。这个方法可以接受任何值，并返回一个以该值解决的 Promise。

- **特征**
    - **普通值**：如果传递给 `Promise.resolve` 的是一个普通值，它会返回一个新的 Promise，该 Promise 会立即以该值解决。
    - **Promise 值**：如果传递的值本身是一个 Promise，`Promise.resolve` 将不会创建一个新的 Promise，而是返回那个原始的 Promise。

```jsx
// 创建一个立即解决为100的Promise
Promise.resolve(100).then((res) => {
  // 这个回调会被调用，打印出100
  console.log(res); //100
});

// 创建一个新的Promise，它将会被拒绝
const promise = new Promise((resolve, reject) => {
  reject(200);
});
// 这里的.then()没有提供拒绝处理函数，所以拒绝将不会被处理
promise
  .then((res) => {
    // 这个回调不会被调用，因为Promise已经被拒绝
    console.log(res);
  });

```

代码示例中，`Promise.resolve` 被用来创建一个立即以数字 `100` 解决的 Promise。然后，使用 `.then()` 方法来设置一个处理解决的回调函数。

请注意，第二个例子中的 Promise 被拒绝了，但是没有提供 `.catch()` 方法或拒绝处理函数，所以拒绝不会被捕获或处理。在实际应用中，`Promise.resolve` 可以用于确保有一个解决的 Promise，这在处理同步和异步代码时非常有用。