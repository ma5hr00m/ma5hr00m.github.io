# 通过nvm配置Node.js开发环境
阿菇之前遇到过这个问题，顺利地解决了。这里补一篇博客，说说具体的操作步骤。本教程的测试环境为 `Ubuntu22.04`，理论上适用于大多数 Linux 系统（在正确安装相关工具的前提下）。

## 引入
关于 Node.js，我觉得它官网的描述就是最准确的：

> Node.js® is an open-source, cross-platform JavaScript runtime environment.

在我们使用 Node.js 开发 Web 应用或者搭建靶场的时候，会有指定的版本要求，这需要我们能够迅速准确的切换我们当前的 Node.js 版本。`nvm` 就是一个优秀的 node.js 版本管理工具，允许我们在同一台机器上方便地安装切换各版本的 Node.js🥰。

## 安装nvm
执行以下操作之前，如果你已经通过其他渠道下载了 Node.js，请将其卸载，否则会出现冲突问题。本篇文章不会介绍如何解决冲突造成的问题。

这里只介绍一种最通用的办法——使用 `curl` 拉取官方安装包📦并执行。

首先在你的系统安装 curl，这是一个常用的命令行工具，用于发出网络请求然后获取数据。执行以下命令安装 nvm：
```bash
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | sh
```

稍等片刻，当你看到以下提示时，证明你已经成功安装了 nvm。之后按照提示重启终端或者使用指令更新环境变量即可：
```bash
# bash
=> nvm is already installed in /root/.nvm, trying to update the script
=> nvm source string already in /root/.profile
=> bash_completion source string already in /root/.profile
=> Close and reopen your terminal to start using nvm or run the following to use it now:
export NVM_DIR="$HOME/.nvm"
```

重启终端或执行对应指令后，我们使用 `nvm -v` 检验是否成功更新环境变量，如果看到控制台中输出了版本信息，则表示环境变量更新成功，也表明你的 nvm 能够正常使用啦！
```bash
nvm --version
# 0.35.3
```

### 可能遇到的问题
当你使用 curl 拉取 nvm 安装时，可能会遇到以下报错信息：
```bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

如果遇到了，请在 `/etc/hosts` 文件的末尾中添加下面的 dns 解析：
```
199.232.68.133 raw.githubusercontent.com
199.232.68.133 user-images.githubusercontent.com
199.232.68.133 avatars2.githubusercontent.com
199.232.68.133 avatars1.githubusercontent.com
```

然后重新执行上面的指令，拉取安装包并进行安装。

## 安装Node.js
使用 nvm 安装对应版本的 Node.js 很方便。首先，使用以下指令查看可用的 node 版本：
```bash
nvm ls-remote
```

你可以从输出中看到从 `v0.1.14` 到 `v20,5.1` 之间几乎所有的版本。找到你需要的版本，通过以下指令进行安装，这里拿 `v20.0.0` 做示范，安装其他版本的 node 同理：
```bash
nvm install v20.0.0
```

稍等片刻后，看到 `Checksums matched!` 即代表已经安装成功。这时一般会将你目前的 node 版本自动切换为刚下载的版本。

你可以使用以下指令查看当前使用 node 版本：
```bash
node -v 
# v20.0.0
```

到这里就已经基本结束啦🥰！下面会再给出一些常用的 nvm 指令，基本能满足日常学习所需：
```bash
# 安装指定版本的 node
nvm install <version>

# 使用指定版本的 node
nvm use <version>

# 列出已安装的所有版本的 node
nvm ls

# 列出所有可用（可安装）的 node
nvm ls-remote

# 列出当前使用的 node 版本
nvm current
```

## 测试
以下步骤适用于在本地搭建 Node,js 开发环境的初学者，如果你是在云服务器或者 docker 容器中安装的 nvm，我相信你没有必要看这部分内容😋

编写一个原生的 Node.js web 应用做测试。

先使用 vim 在当前目录创建一个 `app.js`，然后将以下内容复制粘贴进去，保存退出：
```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello, Node.js!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

使用以下指令运行上面这个 web 应用，然后在浏览器中访问 [http://127.0.0.1:3000](http://127.0.0.1:3000) 即可看到页面中的 `hello, Node.js!` 字符串。

然后，开始你的 Node.js 学习之旅吧！

## 后记
想再说说 DNS 污染。

简单地说，DNS 污染就是域名服务器返回了错误的 IP 地址，导致无法请求到目标资源。导致 DNS 污染的操作有很多，可能是服务器本身的缺陷、开发者的错误设置，也有可能是他人造成的恶意攻击，不晓得本篇中 [nvm 安装程序](https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh) 的 DNS 污染是出于什么原因。