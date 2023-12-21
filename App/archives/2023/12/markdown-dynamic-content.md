# 为Markdown添加动态内容

前段时间琢磨着换博客主题，就在Hexo Theme里各种乱翻。主题文档里都贴着Demo站点链接，用户肯定会想先看看效果，但有时候点进去Loading半天结果没法访问，尤其是连着碰上好几个这种Demo挂掉的，就会觉得比较烦躁。

所以，阿菇想在自己github博客仓库的`README.md`中添加一个动态链接，用于检测博客是否可访问。就尝试着写了写，发现实现起来挺简单的。

目前效果如下（展示 [Ma5hr00m Blog](https://ma5hr00m.top) 的可访问性）：

[![Ma5hr00m Blog Status Image](http://123.206.118.236/check?service=blog)](https://ma5hr00m.top)

## 思路

我需要的应用场景都是在线渲染Markdown，比如博客中的markdown、GitHub等平台的README.md等。

刚开始想得很简单，直接在文档里通过HTML标签嵌入JavaScript代码，使用fetch请求网址然后返回状态，尝试后发现行不通，GitHub会对`<script>`做处理，markdown里不能执行JavaScript。

> 想想也是，在线markdown编辑器怎么会允许用户执行任意JS代码（捂脸

然后想起来了 [shields.io](https://shields.io)，这种装饰在README.md中应用得很广泛，能为说明文档增光添彩。使用起来也很简单，使用markdown的图片语法然后插入对应的URL即可：

<div align='center'>
  <img src='https://img.shields.io/badge/manjaro-35BF5C?style=for-the-badge&logo=manjaro&logoColor=white'>
</div>

## 实现原理

总的来说，我需要的就是一个后端服务，然后在Markdown中插入请求该服务的URL，后端去检查 https://ma5hr00m.top 能否访问，根据可访问性设置的message并渲染成图片，最后将返回给用户。

:::warning
Markdown读取的链接只能来自公网，没法localhost本地测试。
:::

我使用 express+axios+canvas 进行了简单实现：

```JavaScript
const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const axios = require('axios');

const app = express();
const port = 2000;

const data = {
  example: 'https://example.com',
  blog: 'https://ma5hr00m.top',
};

registerFont('./fonts/Inter-VariableFont_slnt,wght.ttf', { family: 'Inter' });

function drawImage(message, textColor) {
  const canvas = createCanvas(0, 0);
  const ctx = canvas.getContext('2d');
  const fontSize = 18;

  ctx.font = `${fontSize}px Inter`;
  const textMetrics = ctx.measureText(message);
  const textWidth = textMetrics.width;
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  canvas.width = textWidth + 50;
  canvas.height = textHeight + 20;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const dotRadius = 4;
  const dotX = dotRadius + 10;
  const dotY = canvas.height / 2;
  ctx.fillStyle = textColor;
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px Inter`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(message, dotX + dotRadius + 15, dotY);

  return canvas.toBuffer();
}

async function checkService(service) {
  const serviceUrl = data[service];
  if (serviceUrl) {
    try {
      const response = await axios(serviceUrl, { timeout: 5000 });
      if (response.status === 200) {
        return { status: 'OK', textColor: '#0f0', statusCode: response.status };
      } else {
        return { status: 'OFFLINE', textColor: '#f00', statusCode: response.status };
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return { status: 'Connection timeout', textColor: '#ff0', statusCode: error.code };
      } else {
        return { status: 'OUTAGE', textColor: '#ff0', statusCode: error.code };
      }
    }
  } else {
    return { status: 'N/A', textColor: '#ff0', statusCode: 'N/A' };
  }
}

app.get('/check', async (req, res) => {
  const service = req.query.service;

  const { status, textColor, statusCode } = await checkService(service);
  const message = `[${statusCode}] ${status}`;
  const imageBuffer = drawImage(message, textColor);

  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
});

app.get('/test', (req, res) => {
  res.send('Service is active.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

第一次写canvas，感觉实现的很丑陋，但能用。可以检测的网址直接写死在了服务里面，也没有做什么安全防护。

## 后话

之后会修修改改，上面那串代码是想尽快糊出来看看效果。准备去学习canvas的使用，这个状态展示颜值太低了。但是感觉用JavaScript去写图像样式很邪恶……