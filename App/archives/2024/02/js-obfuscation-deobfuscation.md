# JavaScript 混淆与反混淆

## Obfuscation 混淆

JavaScript 混淆（Obfuscation）是指通过一系列技术手段，使 JS 代码变得难以理解和分析，增加代码的复杂性和混淆度，阻碍逆向工程和代码盗用。实际上就是一种保护 JS 代码的手段。

那为什么我们需要保护 JS 代码呢 🤔️

JS 最早被设计出来就是为了在客户端运行，直接以源码的形式传递给客户端，如果不做处理则完全公开透明，任何人都可以读、分析、复制、盗用，甚至篡改源码与数据，这是网站开发者不愿意看到的。

### 起源

早期的 JS 代码承担功能少，逻辑简单且体积小，不需要保护。但随着技术的发展，JS 承担的功能越来越多， 文件体积增大。为了优化用户体验，开发者们想了很多办法去减小 JS 文件体积，以加快 HTTP 传输速度。JS 压缩（Minification）技术应运而生。

常见的 JS 压缩手段很多，比如：

- 删除 JS 代码中的空格、换行与注释；
- 替换 JS 代码中的局部变量名；
- 合并 JS 文件；
- ……

压缩工具开发的初衷是减小 JS 文件体积，但 JS 代码经过压缩替换后，其可读性也大大降低，间接起到了保护代码的作用。但是后来主流浏览器的开发者工具都提供了格式化代码的功能，压缩技术所能提供的安全保护收效甚微。于是专门保护 JS 代码的技术：JS 加密和 JS 混淆。

> 本文不会介绍 JS 加密技术，只需要知道这两种技术相辅相成，不预先进行混淆的 JS 加密没有意义。

### 常见混淆手段

- 变量名/函数名的替换，通过将有意义的变量名和函数名替换为随机生成的名称。

    ```JavaScript
    /*
    function calculateArea(radius) {
      return Math.PI * radius * radius;
    }
    console.log(calculateArea(5));
    */
    function _0x2d8f05(_0x4b083b) {
      return Math.PI * _0x4b083b * _0x4b083b;
    }
    console.log(_0x2d8f05(5));
    ```

- 字符串混淆，将代码中的字符串替换为编码或加密的形式，可以防止字符串被轻易读取。

    ```JavaScript
    // console.log("Hello, world!");
    console.log("\x48\x65\x6c\x6c\x6f\x2c\x20\x77\x6f\x72\x6c\x64\x21");
    ```

- 控制流混淆，改变代码的执行顺序或结构。例如，可以使用条件语句和循环语句来替换简单的赋值操作。

    ```JavaScript
    /*
    let a = 1;
    let b = 2;
    let c = a + b;
    console.log(c);
    */
    let a = 1;
    let b = 2;
    let c;
    if (a === 1) {
      if (b === 2) {
        c = a + b;
      }
    }
    console.log(c);
    ```

- 死代码插入，即在源码插入一些不会被执行的代码。

    ```JavaScript
    /*
    let a = 1;
    let b = 2;
    let c = a + b;
    console.log(c);
    */
    let a = 1;
    let b = 2;
    if (false) {
      console.log(a - b);
    }
    let c = a + b;
    console.log(c);
    ```

- 代码转换，将代码转换为等价的，但更难理解的形式。

    ```JavaScript
    /*
    let a = 1;
    let b = 2;
    let c = a + b;
    console.log(c);
    */
    let a = 1;
    let b = 2;
    let c = a - (-b);
    console.log(c);
    ```

### 常见反调试手段

实现防止他人调试、动态分析自己的代码，我们可以预先在代码中做处理，防止用户调试代码。

- 无限 debugger。比如写个定时器死循环禁止调试。

    ```JavaScript
    var c = new RegExp("1");
    c.toString = function () {
        alert("检测到调试")
        setInterval(function() {
            debugger
        }, 1000);
    }
    console.log(c);
    ```

- 内存耗尽。更隐蔽的反调试手段，代码运行造成的内存占用会越来越大，很快会使浏览器崩溃。

    ```JavaScript
    var startTime = new Date();
    debugger;
    var endTime = new Date();
    var isDev = endTime - startTime > 100;
    var stack = [];
    
    if (isDev) {
        while (true) {
            stack.push(this);
            console.log(stack.length, this);
        }
    }
    ```

- 检测函数、对象属性修改。攻击者在调试的时，经常会把防护的函数删除，或者把检测数据对象进行篡改。可以检测函数内容，在原型上设置禁止修改。

    ```JavaScript
    function eval() {
        [native code]
    }
    
    window.eval = function(str) {
        console.log("[native code]");
    };
    
    window.eval = function(str) {
    };
    
    window.eval.toString = function() {
        return `function eval() {[native code]}`
    };
    
    function hijacked(fun) {
        return "prototype" in fun || fun.toString().replace(/\n|\s/g, "") != "function" + fun.name + "() {[nativecode]}";
    }
    ```

### 前端开发中的混淆

在 Web 前端开发中，开发者会对代码进行压缩和混淆，对代码进行优化，并提高安全性。已经有很多成熟的工具可以使用，比如 [UglifyJS](https://github.com/mishoo/UglifyJS) 和 [JavaScript Obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)。

混淆通常在项目的构建过程中进行。例如，我们使用 Vite 作为模块打包工具，就可以在 vite 的配置文件中添加UglifyJS 插件。这样，在每次构建项目时，UglifyJS就会自动对你的代码进行混淆。

先安装插件。

```Bash
npm install vite-plugin-uglify --save-dev
```

然后在配置文件中添加该插件。

```JavaScript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginUglify from 'vite-plugin-uglify'

export default defineConfig({
  plugins: [
    vue(),
    VitePluginUglify()
  ]
})
```

在这个配置文件中，`VitePluginUglify`被添加到了`plugins`数组中，所以在构建过程中，Vite 会自动使用`vite-plugin-uglify`对代码进行混淆。

### 在线混淆工具

有些站点提供了在线混淆的功能，比如 [Free JavaScript Obfuscator](https://javascriptobfuscator.dev/)，提供 JS 代码即可得到混淆后的结果。这个站点的混淆基于上面提到的 [JavaScript Obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) 实现。

```JavaScript
function fibonacci(n) {
  let fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
}

// the first 10 numbers in the Fibonacci sequence
console.log(fibonacci(10));
```

以上代码的作用是计算斐波那契数列的前 10 个值并打印出来，经过混淆可得以下内容，可读性肉眼可见的降低：

```JavaScript
const _0x323128=_0x5512;(function(_0x589643,_0x5459af){const _0x1b79b8=_0x5512,_0x3e96ed=_0x589643();while(!![]){try{const _0x1fb1b3=-parseInt(_0x1b79b8(0x1f1))/0x1*(-parseInt(_0x1b79b8(0x1ea))/0x2)+-parseInt(_0x1b79b8(0x1ec))/0x3*(parseInt(_0x1b79b8(0x1f3))/0x4)+-parseInt(_0x1b79b8(0x1ed))/0x5*(parseInt(_0x1b79b8(0x1f2))/0x6)+-parseInt(_0x1b79b8(0x1e8))/0x7+parseInt(_0x1b79b8(0x1e9))/0x8*(-parseInt(_0x1b79b8(0x1f4))/0x9)+parseInt(_0x1b79b8(0x1f0))/0xa+-parseInt(_0x1b79b8(0x1ef))/0xb*(-parseInt(_0x1b79b8(0x1ee))/0xc);if(_0x1fb1b3===_0x5459af)break;else _0x3e96ed['push'](_0x3e96ed['shift']());}catch(_0x56184c){_0x3e96ed['push'](_0x3e96ed['shift']());}}}(_0x138e,0xdf35a));function _0x138e(){const _0x3a0863=['354072hRaVAZ','9mNckCh','1622341lDdscp','2787864kenYBK','546362IExhCV','log','3fofuVm','1946005vlrFyq','516IsqKpc','725241tPbpzZ','316200mzqtLe','1mgkmrs','24Zwposp'];_0x138e=function(){return _0x3a0863;};return _0x138e();}function fibonacci(_0x1b3125){let _0x9e88df=[0x0,0x1];for(let _0x406b50=0x2;_0x406b50<=_0x1b3125;_0x406b50++){_0x9e88df[_0x406b50]=_0x9e88df[_0x406b50-0x1]+_0x9e88df[_0x406b50-0x2];}return _0x9e88df;}function _0x5512(_0x2d5465,_0x1d0a2f){const _0x138ec4=_0x138e();return _0x5512=function(_0x5512ef,_0x5e1f2e){_0x5512ef=_0x5512ef-0x1e8;let _0x4be64a=_0x138ec4[_0x5512ef];return _0x4be64a;},_0x5512(_0x2d5465,_0x1d0a2f);}console[_0x323128(0x1eb)](fibonacci(0xa));
```

## Deobfuscator 反混淆

JS 反混淆（Deobfuscator ）是指对经过混淆处理的代码进行还原和解析，以恢复其可读性。Deobfuscator 可以通过对代码进行静态分析和动态分析等方式来实现。需要注意的是，Obfuscation 只能降低可读性，不能完全避免逆向攻击，而 Deobfuscator 也并不能完全还原混淆过的代码。

只要耐心分析，多数混淆过的 JS 已然能还原出来。

### 在线反混淆工具

反混淆要有些趁手的工具。最常用的是浏览器自带的开发者工具，其次是一些转换混淆过的代码的工具。以下网站提供在线反混淆 JS 代码的功能：

- [javascript-deobfuscator](https://seosniffer.com/javascript-deobfuscator)
- [Raz1ner JavaScript Deobfuscator](https://dev-coco.github.io/Online-Tools/JavaScript-Deobfuscator.html)
- [synchrony deobuscator](https://deobfuscate.relative.im/)
- [js-beauty](https://beautifier.io/)

以我们经过混淆的代码为例，丢进上述第一个网站，可以得到以下反混淆过的代码：

```JavaScript
function fibonacci(jayandre) {
  let ramonita = [0, 1];
  for (let ancel = 2; ancel <= jayandre; ancel++) {
    ramonita[ancel] = ramonita[ancel - 1] + ramonita[ancel - 2];
  }
  return ramonita;
}
console.log(fibonacci(10));
```

原本的逻辑已经较为清晰的展现了。当然也有一些库能用来反混淆本地 JS 文件，这里不多做介绍，感觉在线工具就够用了。

### 开发者工具

上面的反混淆站点只是辅助，真反混淆还得靠浏览器自带的开发者工具。接下来以chrome浏览器为例讲讲怎么用。

在反混淆过程中，我们主要使用源代码（Source）和网络（Network）这两个模块。Network 用于查找我们进行用户操作时调用了哪些 API，在调用 API 前后运行了哪些 JS 文件；Source 提供了网站整体的 JS 代码及静态资源，我们的反混淆分析工作主要就在这里进行。

在 Source 模块中，默认`ctrl+shift+p`可以开启开发者工具的命令行，我们可以找到两个“搜索”工具，分别对应“全局搜索”和“在当前文件中搜索”，很适合查找指定字段。

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDhjMjE4MzAwOWIxMWU0YzU2NTU3YzJhMjM0OWU1NTVfVXBtVE5qczMzV2JpMUpLdFZOaU44ZDE2M1ZzMTZVVUtfVG9rZW46VEFZTWJQajVDbzFNNlJ4NnVxRGNuRlFSblViXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

开发者工具提供了替换（Override）功能，开启本地替换选项，上传自己的目录，然后选中浏览器中指定 JS 文件，做出修改后`ctrl+s`保存，即可将源文件保存到我们自己的目录中，之后对文件做出的修改可以直接替换对应的原文件，这样就能方便的修改浏览器端 JS 文件。

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmUxNWEzMjNjM2VlZmMwM2QxZDNmMDYwYTNmYTBjNDBfbWJndWxtMVAwNWt1TVN1N3hpRExNVGVURExBVGR0NUNfVG9rZW46T1FEbGJmMFRSb1RYbGp4OFlTNGM0V1ZTbldiXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

剩下的就是动调了，后面会举例子解释。

### 静/动态调试

先做个区分，逆网页的 JS 代码更多得是在开发者工具中做动调的。

- 静态调试：静态调试是通过分析代码的结构和逻辑来理解其功能。这种方法不需要运行代码，只需要对代码进行分析和理解。例如，可以通过反汇编工具将二进制的可执行文件翻译成汇编代码，通过对代码的分析来破解软件。
- 动态调试：动态调试则是在代码运行时进行的。通过设置断点，单步执行，观察变量的值变化等方式，来理解代码的运行过程和逻辑。动态调试可以有效应对多数混淆措施，从中还原出运行逻辑，是逆向分析的关键手段。前面说的反调试便是阻拦动态调试。

## 实战

### 百度翻译接口

未登录状态下翻译字符串，观察 Network 可以找到`/v2transapi` POST 请求报文，其 payload 中表单的 `query`字段即为我们输入待翻译的字符串。

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=NjgzNGVlNDFiODJhNWY2MWVjZmVkOWYwMDVmZWE2MGVfamVBM1NRSTBhbTRHT1d3M1N2MllkNTg4a0d6WHl6bU9fVG9rZW46TFdmU2J5QnNyb2U0OVR4RWViRWNySzNKbk1lXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

刷新页面多次翻译，发现只有`sign`字段的值在随`query`一直变化，`transtype`的值会根据触发翻译的方式在`realtime`和`enter`之间切换，其它字段值保持不变。我们接下来的任务就是分析`sign`字段的值是怎么来的。

为了搞清楚`sign`是如何生成的，我们需要在 Sources 模块中全局搜索`sign`字段。但因为`sign`本身是一个常见的字段，我们很容易定位到其他与表单无关的地方。这里有一个小技巧，为了获得参数相关代码，我们可以搜索`sign:`或者`sign=`，以尽量避免定位到无关代码。

在 Sources 模块中全局搜索`sign:`，定位到很多文件，根据文件名和文件内容，可以判断最有可能在 index.36217dc5.js 文件中，而该文件中出现了 6 处`sign:`相关代码，依次打断点并执行翻译操作，发现只会在 25800 行处的`sign: b(e);`处停下：

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=OTFmZDYzNjk4MDQ5MjdlYTA3NzBhODRiMmI0MTdhMGJfRWJ1ZDdsTGRHNnlKTXBvdHV4THdaREZ2U0xNejBUV3pfVG9rZW46WDVMbWJPMkRnb015M294VnRYWmNPUUw5bkZmXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

单步步进，可以发现参数 t 值即为传入的字符串：

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=YjZmZGI4NDQ2YTc1OGUwZDY0MzdhN2VhYTJlMDk1MmVfUndGdUFkSHRueURSa2xFZXlTMWphOHE1WG1MRk40QXhfVG9rZW46WUx4YmI1OHZZb242OXF4bVY4ZmM1QVRjbjhkXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

把这段函数抽离出来，写到一个 main.js 文件中，调用该函数并运行：

```JavaScript
b = function(t) {
  var o, i = t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  if (null === i) {
    var a = t.length;
    a > 30 && (t = "".concat(t.substr(0, 10)).concat(t.substr(Math.floor(a / 2) - 5, 10)).concat(t.substr(-10, 10)))
  } else {
    for (var s = t.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), c = 0, u = s.length, l = []; c < u; c++)
      "" !== s[c] && l.push.apply(l, function(t) {
        if (Array.isArray(t))
          return e(t)
      }(o = s[c].split("")) || function(t) {
        if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
          return Array.from(t)
      }(o) || function(t, n) {
        if (t) {
          if ("string" == typeof t)
            return e(t, n);
          var r = Object.prototype.toString.call(t).slice(8, -1);
          return "Object" === r && t.constructor && (r = t.constructor.name),
          "Map" === r || "Set" === r ? Array.from(t) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? e(t, n) : void 0
        }
      }(o) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
      }()),
      c !== u - 1 && l.push(i[c]);
    var p = l.length;
    p > 30 && (t = l.slice(0, 10).join("") + l.slice(Math.floor(p / 2) - 5, Math.floor(p / 2) + 5).join("") + l.slice(-10).join(""))
  }
  for (var d = "".concat(String.fromCharCode(103)).concat(String.fromCharCode(116)).concat(String.fromCharCode(107)), h = (null !== r ? r : (r = window[d] || "") || "").split("."), f = Number(h[0]) || 0, m = Number(h[1]) || 0, g = [], y = 0, v = 0; v < t.length; v++) {
    var _ = t.charCodeAt(v);
    _ < 128 ? g[y++] = _ : (_ < 2048 ? g[y++] = _ >> 6 | 192 : (55296 == (64512 & _) && v + 1 < t.length && 56320 == (64512 & t.charCodeAt(v + 1)) ? (_ = 65536 + ((1023 & _) << 10) + (1023 & t.charCodeAt(++v)),
    g[y++] = _ >> 18 | 240,
    g[y++] = _ >> 12 & 63 | 128) : g[y++] = _ >> 12 | 224,
    g[y++] = _ >> 6 & 63 | 128),
    g[y++] = 63 & _ | 128)
  }
  for (var b = f, w = "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(97)) + "".concat(String.fromCharCode(94)).concat(String.fromCharCode(43)).concat(String.fromCharCode(54)), k = "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(51)) + "".concat(String.fromCharCode(94)).concat(String.fromCharCode(43)).concat(String.fromCharCode(98)) + "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(102)), x = 0; x < g.length; x++)
    b = n(b += g[x], w);
  return b = n(b, k),
  (b ^= m) < 0 && (b = 2147483648 + (2147483647 & b)),
  "".concat((b %= 1e6).toString(), ".").concat(b ^ f)
}

const query = "abandon";
console.log(b(query))
```

运行时报错，提示`r`未定义。在继续动调去找`r`是什么。步进调试到这一步时，发现`r`被赋值为`window[d]`，即 "320305.131321201"，在此之前其值一直为null。

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDM1NWYwZTFiOTIzNTUxOGFkZGM4YjZmN2NkYzUxMzhfdGZFU1Y4Vkh1Z2lKWVRvdFpWeUdLTGNSaDRQNHJRT3NfVG9rZW46VzlmOGJYRTA2b2RBWlR4SHlOWmNNclZZbk9jXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

我们可以发现`d`的值为`gtk`。我们本地是通过 Node.js 运行 JS 脚本，没有`window[]`这种 Web API，所以直接将`320305.131321201`硬编码进去。在此运行脚本，又会提示缺少`n`函数：

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=NWNmODM2MGNhMTA3MDIyNjA2MGM3NWRmODJlNzhiODFfNUlyTlF5NTVMTmxpcUozYmU1Zm1QaUkwVVZOWkUzUXVfVG9rZW46VUhxNWJWVjB4b0FjMWZ4Sjl2bmN2dzVmbm4wXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

我们在面板中找到`n`函数，光标悬浮于上方可直接跳转到函数声明的地方：

![img](https://xru013bpln.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTQ3YzljZGIyZThiMTYzNDdjMzU4M2VhNDM4MDk5ZWNfY0tNZjlQQnRRSkh6TXg5c2R5a2NSbWNlcFlTQWVUajdfVG9rZW46RkNFUmJsSng5b2JtWWZ4SGZBdmNyaWd5bmhiXzE3MDg1MTQwNDQ6MTcwODUxNzY0NF9WNA)

找到`n`函数后将其添加到 JS 脚本中，再次运行，即可得到结果`103339.356506`，这与我们在 Network 模块中查看到的`sign`值相同。

最终脚本如下，输入`query`的值即可得到请求`/v2transapi`所需的 payload：

```JavaScript
/**
 * function to generate sign
 */
n = function (t, e) {
  for (var n = 0; n < e.length - 2; n += 3) {
      var r = e.charAt(n + 2);
      r = "a" <= r ? r.charCodeAt(0) - 87 : Number(r),
      r = "+" === e.charAt(n + 1) ? t >>> r : t << r,
      t = "+" === e.charAt(n) ? t + r & 4294967295 : t ^ r
  }
  return t
}

b = function(t) {
  var o, i = t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  if (null === i) {
    var a = t.length;
    a > 30 && (t = "".concat(t.substr(0, 10)).concat(t.substr(Math.floor(a / 2) - 5, 10)).concat(t.substr(-10, 10)))
  } else {
    for (var s = t.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), c = 0, u = s.length, l = []; c < u; c++)
      "" !== s[c] && l.push.apply(l, function(t) {
        if (Array.isArray(t))
          return e(t)
      }(o = s[c].split("")) || function(t) {
        if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
          return Array.from(t)
      }(o) || function(t, n) {
        if (t) {
          if ("string" == typeof t)
            return e(t, n);
          var r = Object.prototype.toString.call(t).slice(8, -1);
          return "Object" === r && t.constructor && (r = t.constructor.name),
          "Map" === r || "Set" === r ? Array.from(t) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? e(t, n) : void 0
        }
      }(o) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
      }()),
      c !== u - 1 && l.push(i[c]);
    var p = l.length;
    p > 30 && (t = l.slice(0, 10).join("") + l.slice(Math.floor(p / 2) - 5, Math.floor(p / 2) + 5).join("") + l.slice(-10).join(""))
  }
  for (var d = "".concat(String.fromCharCode(103)).concat(String.fromCharCode(116)).concat(String.fromCharCode(107)), h = (r = "320305.131321201").split("."), f = Number(h[0]) || 0, m = Number(h[1]) || 0, g = [], y = 0, v = 0; v < t.length; v++) {
    var _ = t.charCodeAt(v);
    _ < 128 ? g[y++] = _ : (_ < 2048 ? g[y++] = _ >> 6 | 192 : (55296 == (64512 & _) && v + 1 < t.length && 56320 == (64512 & t.charCodeAt(v + 1)) ? (_ = 65536 + ((1023 & _) << 10) + (1023 & t.charCodeAt(++v)),
    g[y++] = _ >> 18 | 240,
    g[y++] = _ >> 12 & 63 | 128) : g[y++] = _ >> 12 | 224,
    g[y++] = _ >> 6 & 63 | 128),
    g[y++] = 63 & _ | 128)
  }
  for (var b = f, w = "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(97)) + "".concat(String.fromCharCode(94)).concat(String.fromCharCode(43)).concat(String.fromCharCode(54)), k = "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(51)) + "".concat(String.fromCharCode(94)).concat(String.fromCharCode(43)).concat(String.fromCharCode(98)) + "".concat(String.fromCharCode(43)).concat(String.fromCharCode(45)).concat(String.fromCharCode(102)), x = 0; x < g.length; x++)
    b = n(b += g[x], w);
  return b = n(b, k),
  (b ^= m) < 0 && (b = 2147483648 + (2147483647 & b)),
  "".concat((b %= 1e6).toString(), ".").concat(b ^ f)
}

/**
 * test
 */
const query = "abandon";
console.log(`from=en&to=zh&query=${query}&simple_means_flag=3&sign=${b(query)}&token=14025658070b41f40739347cef0ec62a&domain=common&ts=1708512893507`)
```

### 掘金登录接口

登录时抓包，可以得到对`/passport/web/user/login`接口的请求报文：

```
# GET 查询字符串参数
aid: 2608
account_sdk_source: web
sdk_version: 2.2.6
verifyFp: verify_lsom0d3u_s6mZvQBP_pamX_41TO_81V1_VRng2UjxFI79
fp: verify_lsom0d3u_s6mZvQBP_pamX_41TO_81V1_VRng2UjxFI79
sign: d9116c9cae3fcdf848f1288e1850eb2a489a4e23ece930692912a8bc155d89ec
qs: 6466666a706b715a76616e5a766a7077666029646c612963752976616e5a736077766c6a6b297360776c637c4375

# POST 表单参数
mix_mode: 1
account: 34363d3336373d3d343c3c
password: 343736343736343736
fixed_mix_mode: 1
```

流程其实大差不差，就是搜参数、打断点、慢慢动调，基本都能找出来。掘金登录只需要 POST 表单参数正确即可，GET 参数不对也能过。以上参数中，会动态变化的只有`sign`、`account`和`password`，其中 GET 参数`sign`即使删掉也能过登录验证。

具体过程不再贴图展示，这里直接提供获取 POST 表单参数的脚本，感兴趣的可以尝试去逆一下`sign`是如何生成的，难度比逆`account`和`password`要高一些：

```JavaScript
/**
 * raw data
 */
const account = '00000000000'
const password = '1q2w3e'

/**
 * handle account and password
 */
var T = function(e) {
  var t, n = [];
  if (void 0 === e)
    return "";
  t = function(e) {
    for (var t, n = e.toString(), r = [], a = 0; a < n.length; a++)
      0 <= (t = n.charCodeAt(a)) && t <= 127 ? r.push(t) : 128 <= t && t <= 2047 ? (r.push(192 | 31 & t >> 6),
      r.push(128 | 63 & t)) : (2048 <= t && t <= 55295 || 57344 <= t && t <= 65535) && (r.push(224 | 15 & t >> 12),
      r.push(128 | 63 & t >> 6),
      r.push(128 | 63 & t));
    for (var i = 0; i < r.length; i++)
      r[i] &= 255;
    return r
  }(e);
  for (var r = 0, a = t.length; r < a; ++r)
    n.push((5 ^ t[r]).toString(16));
  return n.join("")
}

/**
 * obtain the post form
 */
const postForm = `mix_mode=1&account=${T(account)}&password=${T(password)}&fixed_mix_mode=1`
console.log(postForm)
```

### HGAME2024 2048*16

BaiMeow 师傅的题，HGAME2024 Week1 结束后不方便提供复现环境。题目考察了禁用 F12、反调试、JS 反混淆，比较全面。这里提一嘴。

## 参阅文章

- [Javascript加密混淆](https://lizh.gitbook.io/knowledge/research/javascript-jia-mi-hun-xiao#hun-xiao-cha-jian)，by 前端知识库
- [js混淆与反混淆](https://ek1ng.com/jsobuscation.html)，by ek1ng