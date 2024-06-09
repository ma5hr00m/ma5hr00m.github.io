---
title: 掌握 Docker 的使用
date: 2023/05/02
author: ma5hr00m
categories:
- Docker
---

## 是什么
*Docker* 是一个开源的应用容器引擎，它允许用户将他们的应用以及依赖打包到一个轻量级、可移植的容器（*container*）中，然后部署到任何环境中。

docker 由 dotCloud 公司开发维护，主要项目代码开源与 GitHub。基于 Go 开发实现，并遵循 Apache2.0 协议开源。因为 Docker 的火爆，dotCloud 公司于 2013 年改名为 Docker。

## 与传统虚拟机的比较
你既然知道 docker，想必也知道虚拟机。你会发现二者的功能看起来很相似。那为什么我们会在某些场景下使用 docker，而不是传统虚拟机呢？

简单说说二者的区别：

传统的虚拟机技术是虚拟出一套硬件，然后在这套虚拟硬件上运行一个完整的操作系统，再在该操作系统上运行所需应用进程；
而 docker 容器的应用进程则运行于宿主内核，容器没有自己的内核，也没有进行硬件虚拟，这使得容器比传统虚拟机更加轻便。

相比于传统虚拟机技术，docker 主要有以下优点：
- ✨ docker 不需要进行硬件虚拟以及运行完整操作系统等额外开销，对系统资源的利用率更高，允许你在同一台主机运行更多的应用；
- 🚀 docker 运行于宿主内核，无需启动完整的操作系统，可以实现更快的启动；
- 📦 只要安装了 *docker engine*，你的应用镜像可以运行在任何环境中。

## 安装 Docker
> 以 ubuntu22.04 系统为例

安装一些必要的软件包，这些软件包可以让你使用 HTTPS 协议从互联网上下载软件：

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

从 docker 的官方网站下载公钥，并添加到 apt 的信任列表中。这样做可以确保你下载的软件包是原始的，没有被篡改：
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

向你的系统的软件源列表中添加 docker 的官方 Ubuntu 仓库：
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

首先更新系统的软件包列表，然后从 docker 的官方 ubuntu 仓库中安装Docker CE，Docker CLI 和 containerd.io。
```bash
sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io
```

检查 docker 服务的状态，确认是否已经成功安装。
```bash
sudo systemctl status docker
```

同时，你可以使用以下指令设置 docker 每次开机自启动：
```bash
sudo systemctl enable docker
```

使用以下指令关闭 docker 开机自启动：
```bash
sudo systemctl disable docker
```

重启 docker 服务：
```bash
sudo systemctl restart docker
```

默认情况下，只有 root 用户有权利执行 docker 指令，这确保了安全，但有些用户可能认为多此一举。执行以下命令将当前用户添加到 docker 用户组，重新登陆后我们即可使用当前用户身份执行 docker 命令：
```bash
sudo usermod -aG docker $USER
```

都搞定后，执行以下命令运行一个测试容器：

```bash
docker container run hello-world

# 出现以下输出，代表 docker 功能正常。
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

关于如何卸载 docker，其实用的不多，但也可以记录一手。

停止所有正在运行的容器以及所有的 docker 对象：
```bash
docker container stop $(docker container ls -aq)
docker system prune -a --volumes
```

使用 apt 卸载 docker 以及相关依赖：
```bash
sudo apt purge docker-ce && sudo apt autoremove
```

## 安装 Docker Compose
`docker compose` 是一个用于定义和运行多容器 Docker 应用程序的工具。

从官方仓库拉取最新版本并安装：
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

为 docker-compose 添加执行权限：
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

输出版本信息检查是否安装成功：
```bash
docker-compose --version
```

## docker 换源
docker 默认镜像源在国外，出于某些原因，我们拉取镜像可能会非常慢。这太痛苦了。我们可以修改 `/etc/docker/daemon.json` 文件，以修改镜像源：
```bash
sudo vim /etc/docker/daemon.json
```

添加国内源：
```json
{
  "registry-mirrors": ["https://docker.m.daocloud.io/"]
}
```

保存后退出，重启 docker 服务。换源完成。

> 不同源也是存在区别的，使用前一定要注意。参考这篇教程：[Docker Hub 镜像加速器](https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6)

## 安装 Portainer
使用命令行管理少数 docker 容器可能挺方便，可要是容器多起来就会变得繁琐，且命令行中的数据也不够直观。
我们可以使用一些可视化工具提高我们的效率。

`Portainer` 是一款轻量级的 docker 管理工具，我们可以使用它管理我们的docker 镜像容器。
![Portainer运行页面展示](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20230924232212.png)

拉取 portainer 镜像到本地并部署，这样我们就可以在浏览器中访问 portainer 服务，管理本地镜像和容器。

```bash
sudo docker pull portainer/portainer-ce
```

使用以下指令，使用 `portainer/portainer-ce` 镜像创建一个运行在本地 9000 端口的镜像。

```bash
sudo docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v /dockerData/portainer:/data --restart=always --name portainer portainer/portainer
```

创建成功后，访问 [localhost:9000](http://localhost:9000) 的 portainer 服务，按照指引进行一些基本配置，我们就可以方便快捷的管理我们的镜像和容器了。

## 参考
- [Docker - 从入门到实践](https://yeasy.gitbook.io/docker_practice/introduction/why)
- [Docker 常用指令](https://www.runoob.com/docker/docker-command-manual.html)
- [Portainer - github](https://github.com/portainer/portainer)