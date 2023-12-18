# 构建Docker镜像时遇到的问题
HGAME-MINI2023 里的一道题目，我没法直接构建附件里给出的镜像，遇到了一点小问题。最后顺利解决了，这里略做记录。
本篇文章未涉及解题思路，给出的代码都为附件中所提供。

## 背景
题目名称 `unzip? or not`，给出了 `Dockerfile` 和 `docker-compose.yml` 文件。
为了方便测试 payload，我想直接在本地起一个服务，但在执行 `sudo docker-compose up -d` 时遇到了两个报错。

先看看源文件：
```yml
# docker-compose.yml
version: '2'
services:
  app:
    build: .
    ports:
      - "8080:8080"
```

```Dockerfile
# Dockerfile
FROM golang:1.16 as builder
COPY src /src
WORKDIR /src
RUN go build -o app
FROM ubuntu:devel
RUN apt-get update \
    && apt-get install -y unzip \
    && apt-get clean
COPY --from=builder /src/app /app/app
WORKDIR /app
CMD ./app
EXPOSE 8080
```

## ubuntu:devel 软件仓库失效
看看报错情况：

![报错信息](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231014141024.png)

当我们在 ubuntu:devel 中执行 `apt-gte update` 指令时报错，提示无法找到当前 `ubuntu` 版本的软件仓库。

> ubuntu:devel 代表了 Ubuntu 的开发版 Docker 镜像。

我起初的想法是检查网络环境以及尝试换源，试了试发现都不行。

然后找到 *stackExchange* 上的一个 [帖子](https://serverfault.com/questions/1106694/unable-to-run-apt-update-on-ubuntu-21-10)，很相似的问题。解决办法也比较简单，手动替换镜像中的软件仓库链接即可，多添两句指令的事儿。将 `Dockerfile` 修改为：
```Dockerfile
# Dockerfile
FROM golang:1.16 as builder
COPY src /src
WORKDIR /src
RUN go build -o app
FROM ubuntu:devel
RUN sed -i -r 's/([a-z]{2}.)?archive.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list \
    && sed -i -r 's/security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list \
    && apt update \
    && apt install -y unzip \
    && apt clean
COPY --from=builder /src/app /app/app
WORKDIR /app
CMD ./app
EXPOSE 8080
```

事后，我进入到构建好的容器中，使用 `cat /etc/os-release` 检查了当前 `ubuntu:devel` 指向的 ubuntu 版本，发现是 `ubuntu:21.10`。

而根据 ubuntu 官网的一篇 [通知](https://fridge.ubuntu.com/2022/07/19/ubuntu-21-10-impish-indri-end-of-life-reached-on-july-14-2022/)，
`Ubuntu 21.10` 于 2022 年 7 月 14 日停止支持，软件仓库也不再更新，并在段时间内归档到 `old-releases.ubuntu.com` 中。

这也就是我们直接使用 `apt update` 指令时会报错的原因。

## go get timeout
同样是先看看报错：

![报错信息](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231014143720.png)

这个问题就比较简单了，处于某些原因我们无法直接访问 `golang.org`，所以 `go get` 指令无法正常执行。

在 `Dockerfile` 中设置代理即可。在文件中添加下面的指令：

```Dockerfile
ENV GOPROXY=https://goproxy.cn
```

之后就没有阻碍啦，使用 `sudo docker-compose up -d` 即可在本地部署一个题目服务。

---

以上就是我遇到的两个问题，`go get` 代理问题其实很早就碰到过，这里也一并顺手记录下来。

最后能正常使用的完整版 Dockerfile 如下：

```Dockerfile
FROM golang:1.16 as builder
ENV GOPROXY=https://goproxy.cn
COPY src /src
WORKDIR /src
RUN go build -o app
FROM ubuntu:devel
RUN sed -i -r 's/([a-z]{2}.)?archive.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list \
    && sed -i -r 's/security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list \
    && apt update \
    && apt install -y unzip \
    && apt clean
COPY --from=builder /src/app /app/app
WORKDIR /app
CMD ./app
EXPOSE 8080
```

以上。