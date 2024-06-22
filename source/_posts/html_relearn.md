---
title: HTML 不常用标签及 <head> 优化
date: 2023/10/22
author: ma5hr00m
categories:
- HTML
---

阿菇最近倾向于用原生三件套做 Web 开发，想尽可能少地依赖三方库。

或许没什么必要，因为封装好的东西用起来确实爽快。但造轮子确实也有造轮子的快乐。不可辩解的是，阿菇对前端项目中乱糟糟的配置文件以及 `node_modules` 感到厌烦，即使在开发过程中用了 `File Nesting Updater` 这样简化目录结构的插件。

掌握一定 Web 开发基础后再回过头来学习，能发现之前没注意到的有趣知识，可以再做记录。

以下内容有很多代码片段，光说没意思，自己 copy 后修修改改看看效果！
可以在这个在线平台实验：[HTML/CSS/JS 在线工具](https://c.runoob.com/front-end/61/)

## HTML 元素
Web 前端开发者经常使用语义化元素：既能提高 HTML 的可读性，也能减少写 CSS 命名的烦恼，还有利于 SEO 优化，好处多多。

当然也可以 `<div>` 一把嗦，方便的很（类比后端编写 API 时 `POST` 一把嗦）。
很多老网站都是这么做的，比如我们做网站备案时用的 [互联网网站安全管理服务平台](https://www.beian.gov.cn/)，清一色的 `<div>` 标签。

除了常用的 `<header>`、`<main>` 等规划网页布局的元素，`<em>`、`<br>` 等用于规划文本布局的元素，还有一些有趣的语义化标签。
我觉得以后能用上，也打算去用，这里就做个记录。

### `<abbr>`
文本缩写元素，同时提供了一个 `title` 属性值，可以实现鼠标 hover 时显示具体内容：
```html
<p>
  <abbr title="HyperText Markup Language">HTML</abbr> is fun!
</p>
```

### `<address>`
提供个人或组织的联系方式，仅表达了额外的语义信息。
```html
<address>
  <a href="mailto:jim@rock.com">jim@rock.com</a><br />
  <a href="tel:+13115552368">(311) 555-2368</a>
</address>
```

### `<bdi>`
双向文本隔离元素，`dir` 属性不继承父元素，即被该元素包裹的内容方向不受父元素的影响，比如：
```html
<p dir="rtl">
  This arabic word <bdi>ARABIC_PLACEHOLDER</bdi> is automatically displayed
  right-to-left.
</p>
```

### `<bdo>`
双向文本替代元素，可以改写文本的方向，而不需要编写 CSS 样式。

自带的 `dir` 属性有两个可选值：
- `ltr` - 左到右
- `rtl` - 右到左
```html
<p>
  <bdo dir="rtl">This text will go right to left.</bdo>
</p>
```

### `<caption>`
HTML 表格标题元素，常作为 `<table>` 的第一个子元素出现。

仅支持全局属性，要改变样式需要用 CSS 的 `caption-side` 或者 `text-align`。
```html
<table>
  <caption>
    表格名称和值
  </caption>
  <tbody>
    <tr>
      <th scope="col">名称</th>
      <th scope="col">HEX</th>
      <th scope="col">HSLa</th>
      <th scope="col">RGBa</th>
    </tr>
    <tr>
      <th scope="row">Teal</th>
      <td><code>#51F6F6</code></td>
      <td><code>hsla(180, 90%, 64%, 1)</code></td>
      <td><code>rgba(81, 246, 246, 1)</code></td>
    </tr>
    <tr>
      <th scope="row">Goldenrod</th>
      <td><code>#F6BC57</code></td>
      <td><code>hsla(38, 90%, 65%, 1)</code></td>
      <td><code>rgba(246, 188, 87, 1)</code></td>
    </tr>
  </tbody>
</table>
```

### `<cite>`
HTML 引用元素，表示一个作品的引用，且必须包含作品的标题。

与之类似的有 `<blackquote>` 和 `<q>` 元素的 `cite` 属性，值一般为引用链接。
```html
<figure>
  <blockquote>
    <p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
  </blockquote>
  <figcaption>
    First sentence in <cite><a href="http://www.george-orwell.org/1984/0.html">Nineteen Eighty-Four</a></cite> by George
    Orwell (Part 1, Chapter 1).
  </figcaption>
</figure>
```

### `<data>`
将一个指定内容和机器可读的翻译联系在一起。但是，如果内容是与时间或者日期相关的，则一定要使用 `<time>`。

`value` 属性为标签内容所对应的数据。
```html
<ul>
  <li><data value="398">迷你番茄酱</data></li>
  <li><data value="399">巨无霸番茄酱</data></li>
  <li><data value="400">超级巨无霸番茄酱</data></li>
</ul>
```

### `<datalist>`
类似输入框，但使用 `<option>` 提供了一些默认可选项。
```html
<datalist id="ice-cream-flavors">
  <option value="Chocolate"></option>
  <option value="Coconut"></option>
  <option value="Mint"></option>
  <option value="Strawberry"></option>
  <option value="Vanilla"></option>
</datalist>
```

### `<dfn>`
HTML 定义元素，一般结合前文的 `<addr>` 使用。
```html
<dfn>
  <abbr title="World-Wide Web">WWW</abbr>
</dfn>
```

### `<dialog>`
对话框元素，一般用于实现一个独立的交互式组件。
```html
<!-- Simple modal dialog containing a form -->
<dialog id="favDialog">
  <form method="dialog">
    <p>
      <label
        >Favorite animal:
        <select>
          <option value="default">Choose…</option>
          <option>Brine shrimp</option>
          <option>Red panda</option>
          <option>Spider monkey</option>
        </select>
      </label>
    </p>
    <div>
      <button value="cancel">Cancel</button>
      <button id="confirmBtn" value="default">Confirm</button>
    </div>
  </form>
</dialog>
<p>
  <button id="updateDetails">Update details</button>
</p>
<output></output>
```

对应的 `JavaScript` 代码：
```javascript
const updateButton = document.getElementById("updateDetails");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("select");
const confirmBtn = favDialog.querySelector("#confirmBtn");

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof favDialog.showModal !== "function") {
  favDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButton.addEventListener("click", () => {
  if (typeof favDialog.showModal === "function") {
    favDialog.showModal();
  } else {
    outputBox.value =
      "Sorry, the <dialog> API is not supported by this browser.";
  }
});
// "Favorite animal" input sets the value of the submit button
selectEl.addEventListener("change", (e) => {
  confirmBtn.value = selectEl.value;
});
// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
favDialog.addEventListener("close", () => {
  outputBox.value = `${
    favDialog.returnValue
  } button clicked - ${new Date().toString()}`;
});
```

使用该元素时应当注意搭配 `autofocus` 属性，为用户在弹出的对话框中自动选择一个合适的焦点。
```html
<input name="q" autofocus />
```

### `<details> and <summary>`
详细信息展开元素，很有用，二者搭配使用，灵活性远超下拉列表元素。
```html
<!-- 默认展开 <details open> -->
<!-- <summary> 设置 list-style: none; 可以隐藏黑三角标志 -->
<details>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>
```

但没有内置的方法和属性可以添加状态转换时的动画效果。

### `<fieldset> and <legend>`
用于对表单中的控制元素进行分组（也包括 label 元素）。
```html
<form>
  <fieldset>
    <legend>Choose your favorite monster</legend>

    <input type="radio" id="kraken" name="monster" value="K" />
    <label for="kraken">Kraken</label><br />

    <input type="radio" id="sasquatch" name="monster" value="S" />
    <label for="sasquatch">Sasquatch</label><br />

    <input type="radio" id="mothman" name="monster" value="M" />
    <label for="mothman">Mothman</label>
  </fieldset>
</form>
```

死去的 tkinter 记忆开始攻击阿菇……

可以设置 `disabled` 属性，这会使得其子组件无法使用，提交表单时也不会携带对应数据。

### `<hgroup>`
代表文档标题和与标题相关联的内容，它将一个 `<h1>`–`<h6>` 元素与一个或多个 `<p>` 元素组合在一起。实现主标题副标题会很方便。
```html
<hgroup>
  <h1>Frankenstein</h1>
  <p>Or: The Modern Prometheus</p>
</hgroup>
```

### `<kbd>`
HTML 键盘输入元素用于表示用户输入，它将产生一个行内元素，以浏览器的默认 `monospace` 字体显示。
```html
<p>Save the document by pressing <kbd>Ctrl</kbd> + <kbd>S</kbd></p>
```

### `<meter>`
用来显示已知范围的标量值或者分数值。
```html
<label for="fuel">Fuel level:</label>
<meter id="fuel" min="0" max="100" low="33" high="66" optimum="80" value="50">at 50/100</meter>
```

自带了很多属性：[here](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meter#%E5%B1%9E%E6%80%A7)

### `<noscript>`
如果页面上的脚本类型不受支持或者当前在浏览器中关闭了脚本，则在该元素中定义脚本未被执行时的替代内容。`XSS` 有时候会利用这个元素。
```html
<noscript>
  <!-- anchor linking to external file -->
  <a href="http://www.mozilla.com/">External Link</a>
</noscript>
<p>Rocks!</p>
```

### `<picture> and <source>`
通过包含零或多个 `<source>` 元素和一个 `<img>` 元素来为不同的显示/设备场景提供图像版本。浏览器会选择最匹配的子 `<source>` 元素，如果没有匹配的，就选择 `<img>` 元素的 `src` 属性中的 URL。然后，所选图像呈现在 `<img>` 元素占据的空间中。
```html
<!--Change the browser window width to see the image change.-->

<picture>
  <source srcset="/media/cc0-images/surfer-240-200.jpg" media="(orientation: portrait)" />
  <img src="/media/cc0-images/painted-hand-298-332.jpg" alt="" />
</picture>
```

自带了一些属性：[here](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture#%E5%B1%9E%E6%80%A7)

### `<progress>`
进度指示元素，用来做进度条。
```html
<label for="file">File progress:</label>
<progress id="file" max="100" value="70">70%</progress>
```

## HTML属性
### `accesskey`
为当前元素提供一个快捷键，属性值为一个可打印字符。

但这个属性问题比较多：与系统快捷键冲突、指意不明、意外激活……能不用还是别用，但还是要知道一下。
```html
<p>
  If you need to relax, press the <strong><u>S</u></strong>tress reliever!
</p>
<button accesskey="s">Stress reliever</button>
```

### `autocomplete`
允许 web 开发人员指定用户代理是否有权限在填写表单字段值时提供自动帮助，并指导浏览器填写该字段的预期信息类型。

可选的属性值比较多，参考：[autocomplete](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/autocomplete).
我常用的是 `off`, 即禁止用户代理提供历史可选值（因为我觉得这很影响页面美观性）。
```html
<label for="firstName">First Name:</label>
<input name="firstName" id="firstName" type="text" autocomplete="given-name" />

<label for="lastName">Last Name:</label>
<input name="lastName" id="lastName" type="text" autocomplete="family-name" />

<label for="email">Email:</label>
<input name="email" id="email" type="email" autocomplete="off" />
```

### `autofocus`
上文中提到过，可以在页面加载时使当前元素自动获得用户焦点。

### `contenteditable`
枚举属性，表示元素是否可被用户编辑，属性值为 `true` 或者 `false`。
```html
<blockquote contenteditable="true">
  <p>Edit this content to add your own quote</p>
</blockquote>
```

### `inert`
一个有趣的布尔属性，可以使本身及其所有子元素的用户交互事件被浏览器忽略，包括鼠标、键盘、焦点等事件。可以适当精简代码，增强可读性。
```html
<p inert>
  <a href="https://example.com">Click</a>
</p>
```

### `spellcheck`
枚举属性，表示元素是否会对用户输入的值做拼写检查，属性值为 `true` 或 `false`.

### `translate`
枚举属性。规定制定元素是否需要翻译，属性值为 `yes` 或 `no`.
```html
<footer>
  <small>© 2020 <span translate="no">BrandName</span></small>
</footer>
```

## `<head>`元素顺序
编写 HTML 的 `<head>` 元素时，元素建议遵循以下顺序，可以提高网页性能：
1. preconnect
2. script-async
3. css-contains-@ import
4. sync-js
5. sync-css
6. preload
7. script-defer
8. prefetch / prerender
9. seo-relative

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <!-- preconnect -->
    <link rel="preconnect" href="https://cdn.example.com">
    <!-- script-async -->
    <script async src="https://cdn.example.com/js/analytics.js"></script>
    <!-- css-contains-@ import -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    </style>
    <!-- sync-js -->
    <script src="js/main.js"></script>
    <!-- sync-css -->
    <link rel="stylesheet" href="css/styles.css">
    <!-- preload -->
    <link rel="preload" href="img/background.jpg" as="image">
    <!-- script-defer -->
    <script defer src="js/interactive.js"></script>
    <!-- prefetch / prerender -->
    <link rel="prefetch" href="about.html">
    <link rel="prerender" href="contact.html">
    <!-- seo-relative -->
    <link rel="canonical" href="/index.html">
    <!-- Other SEO related tags -->
    <meta charset="UTF-8">
    <title>我的网站</title>
    <meta name="description" content="这是我的网站的描述。">
  </head>
  <body>
      <!-- 页面内容 -->
  </body>
</html>
```

我们可以使用 `capo.js` 工具，对 `<head>` 中的元素进行标注，快速识别和优化性能问题。GitHub 仓库地址：[capo.js](https://github.com/rviscomi/capo.js).

同时，官方还提供了对应的浏览器插件：[Capo: get your ﹤𝚑𝚎𝚊𝚍﹥ in order](https://chrome.google.com/webstore/detail/capo-get-your-%EF%B9%A4%F0%9D%9A%91%F0%9D%9A%8E%F0%9D%9A%8A%F0%9D%9A%8D%EF%B9%A5/ohabpnaccigjhkkebjofhpmebofgpbeb?utm_source=ext_sidebar&hl=zh-CN),
这个插件可以直观地展示当前 Web 页面 `<head>` 中各元素加载用时的真实顺序以及排序后的顺序。

![插件使用演示](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231006101948.png)

## 叨叨叨
HTML 译为 *超文本标记语言*，与 Markdown 更相似而非 Golang 等编程语言。它的作用是定义网页内容的含义和结构。相比 CSS 和 JavaScript，我对 HTML 的重视程度一直不够，现在看来可以改变一下思想，HTML 其实才是一个网页的基石。

## 参考
- [HTML - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [新浪微博 - Barret李靖](https://weibo.com/1812166904/NbGRFCRtU)