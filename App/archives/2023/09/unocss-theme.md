# 基于UnoCSS实现响应式设计&颜色主题
UnoCSS 是一个 🔥火热的原子级 CSS 引擎。具体介绍不多说，本篇文章主题是实践，概念性的知识请去其官方网站了解：[UnoCSS 中文文档](https://alfred-skyblue.github.io/unocss-docs-cn/)。

此外，本篇文章撸出来的小页面在线展示链接如下，对最终效果感兴趣的话可以看看：[Online Demo](http://example.ma5hr00m.top/)。

## 准备
使用 React&UnoCSS 的组合。先撸个简单的 Demo 页面，用于展示本篇的主题：
​
![Demo页面](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230926170511.png)

实际上就是一个简单的信息卡片，卡片底部是一个用于切换颜色主题的复选框。

## 响应式设计
### 历史
在 Web 发展的洪荒年代，大家搭建的网页多是使用固定布局，如果用户使用的屏幕尺寸与设计者考虑的屏幕尺寸不同，就会出现多余的滚动条或者多余的页面空白，严重降低了用户体验😵‍💫。

如果你想感受一下早期的 Web 前端页面，可以看看这个[👉历史悠久的网站](https://nic.eu.org/)，并尝试分别使用不同设备访问它（或者使用 DevTools 自带的工具）。

> 这个网站本身也比较有趣，以后我可能会讲讲它。

随着科技的发展，人们使用的屏幕尺寸越来越多，逐渐出现了响应式网页设计的概念（*responsive web design，RWD*）。*RWD* 是一种让网页能够根据不同的设备和屏幕尺寸自动适应的设计方法。它可以让网页在手机、电脑等设不同备上保持良好的布局。你现在能看到的大多数网站都使用了响应式设计，最常见的就是顶部导航栏的标签：

> 在此页面打开 Devtools，改变页面尺寸，看看会发生什么！
​
### 相关概念
在正式开始之前，有一些常见概念需要你了解🧐：
- *视口 viewport*  
  视口是浏览器窗口中显示网页内容的区域。不同的设备有不同的视口大小，你可以使用meta标签来设置视口的宽度和缩放比例。
- *媒体查询 media query*  
  媒体查询是一种CSS技术，可以让你根据不同的媒体类型和特征（如屏幕宽度、高度、分辨率等）来应用不同的样式规则。
- *流式布局 fluid layout*    
  流式布局是一种使用百分比或相对单位（如em、rem、vw、vh等）来定义网页元素宽度和高度的布局方法。它可以让网页元素随着视口大小的变化而自动调整。
- *断点 breakpoint*  
  断点是指在不同的视口大小下，网页布局发生变化的临界点。你可以使用媒体查询来定义不同的断点，并在每个断点下应用不同的样式规则。
- *弹性盒子 flexbox*  
  弹性盒子是一种CSS布局模块，可以让你轻松地对齐和分配网页元素。它可以让你在水平或垂直方向上创建弹性的网格系统，并根据视口大小自动调整元素的大小和顺序。
- *网格 grid*  
  网格是另一种CSS布局模块，可以让你创建复杂的二维网格系统，并在每个网格单元中放置网页元素。它可以让你定义不同的行和列，并根据视口大小自动调整它们的大小和位置。

## 颜色主题
这个无需多言，很多网站都已经配置了亮色主题和暗色主题，用户可以自行选择。

## 实战
### 响应式设计
`UnoCSS` 基本兼容了 `Tailwind CSS` 的语法，我们可以使用类似的方法使用断点，编写在不同尺寸下的组件样式。

首先，我们可以在配置文件中手动设置不同层级的断点。当然，你也可以使用默认值，我这里稍微做了些修改，添加了 `xxs`、`xxl` 断点：
```javascript
// uno.config.js
export default defineConfig({
    ... ...
    theme: {
        breakpoints: {
            xxs: '0px',
            xs: '320px',
            sm: '480px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            xxl: '1600px',
        },
    },
    ... ...
})
```

按照如上代码进行配置后，我们可以在 React 的 `.jsx` 文件中通过 `md:` 语法设置不同断点下的样式：
```jsx
<div className={`shadow card-base text-base flex flex-col p-10 md:w-fit md:h-fit xxs:box-border xxs:items-center xxs:justify-center xxs:w-full xxs:h-full`}>
    <h2 className="text-lg font-bold m-0">
        Responsive Design & Theme
    </h2>
    <p className="mb-4 text-center">
        Change window size or click the following button.
    </p>
    <div className='h-30px w-full flex items-center justify-center'>
        <SwitchButton
              height='50px'
              width='60px'
              layout='translate-x-[-50%]'
              isChecked={isChecked}
              SwitchFunction={handleSwitch}
        />
    </div>
</div>
```

正如本篇文章开头展示的图片，这段代码实现了一个简单的信息卡片。当页面宽度不小于 `768px` 时，卡片为固定尺寸，可以显示背景背景；当页面宽度小于 `768px` 时，这个卡片会占满全屏，遮挡住页面背景。

![对比展示](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230926171533.png)

### 主题切换
在展示页面中，我只做了亮暗色主题。

如果你想要在 UnoCSS 中使用亮暗色主题，需要在配置文件中进行设置。我使用的方法参考了该框架作者 `Anthony Fu` 的一条推文。

![展示](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230926171653.png)

该条推文至今已有一年时间，或许已经出现了更加优秀的主题切换方案。
​
首先，我们需要在配置文件中进行配置，设置 `shortcuts` 并设置了亮暗色主题的不同颜色。
```javascript
export default defineConfig({
    ... ...
    shortcuts:{
        'switch-animation': 'transition duration-300',
        'bg-base': 'bg-[#f0f0f0] dark:bg-[#20202a] switch-animation',
        'card-base': 'bg-[#ffffff] dark:bg-[#10101a] switch-animation',
        'text-base': 'text-[#20202a] dark:text-[#f0f0f0] switch-animation',
        'switch-label-base': 'bg-gray-200 dark:bg-gray-800 switch-animation',
        'switch-span-base': 'bg-white dark:bg-gray-300 switch-animation',
    },
    ... ...
})
```

然后，我们编写一个 `SwitchButton.jsx` 组件，用于切换主题状态。为了使这个状态能够应用到主页面，我们将这个 `theme` 状态提升到其父组件中，并将其值绑定到相对底层的 div 元素中，以控制颜色主题。具体代码实现如下：
```jsx
// SwitchButton/index.jsx
import PropTypes from 'prop-types';
​
function SwitchButton({ height, width, layout, theme, SwitchFunction }) {
    const handleSwitch = (event) => {
        SwitchFunction(event.target.checked);
    };
​
    return (
        <div className={`relative h-[${height}] w-[${width}] flex items-center justify-center ${layout}`}>
            <input
                type="checkbox"
                id="dark-light"
                className="absolute z-1 w-12 h-5"
                onChange={handleSwitch}
            />
            <label 
                htmlFor="dark-light"
                className='absolute z-2 block w-11 h-6 switch-label-base rounded-full shadow-inner cursor-pointer switch-animation hover:cursor-pointer'
            >
                <span
                    className={`absolute top-1 left-1.5 w-4 h-4 switch-span-base rounded-full shadow-md switch-animation ${theme=='dark' ? 'translate-x-[100%]' : ''}`}
                >   
                </span>
            </label>
        </div>
    );
}
​
SwitchButton.propTypes = {
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    SwitchFunction: PropTypes.func.isRequired,
};
​
export default SwitchButton;
```

<br/>

```jsx
// App.jsx
import { useState } from 'react';
import SwitchButton from './SwitchButton/index';
​
function App() {
  const [theme, setTheme] = useState('dark');
​
  const handleSwitch = () => {
    setTheme((prevChecked) => (prevChecked === 'dark' ? 'light' : 'dark'));
  };
​
  return (
    <div className={`w-100vw h-100vh flex flex-col ${theme}`}>
      <main className="w-100vw flex-1 flex justify-center items-center bg-base">
        <div className={` shadow card-base text-base flex flex-col p-10  md:w-fit md:h-fit xxs:box-border xxs:items-center xxs:justify-center xxs:w-full xxs:h-full`}>
          <h2 className="text-lg font-bold m-0">
            Responsive Design & Theme
          </h2>
          <p className="mb-4 text-center">
            Change window size or click the following button.
          </p>
          <div className='h-30px w-full flex items-center justify-center'>
            <SwitchButton
              height='50px'
              width='60px'
              layout='translate-x-[-50%]'
              theme={theme}
              SwitchFunction={handleSwitch}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
​
export default App;
```

至此，我们的颜色主题切换效果也已经实现了，具体效果请移步 `demo` 网站查看：[demo](http://example.ma5hr00m.top/)

## 后续
写这个 demo 的时候其实还不会用状态管理库，所以选择了状态提升，现在看起来很捞。

跨组件传参的话，建议直接使用状态管理库，比如 `jotai`.