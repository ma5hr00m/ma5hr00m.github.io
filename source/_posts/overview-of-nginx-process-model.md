---
title: Nginx 进程模型概述
date: 2024/2/20
author: ma5hr00m
categories:
- Nginx
---

Nginx 平时一直有在用，但说实话，对其工作原理一直没有深入了解。那不如从现在开始了解，之后会慢慢更。先说说进程模型。

## 发展

Nginx 的开发始于 2002 年，由 Igor Sysoev 发起，最初是为了解决 C10K 问题，即如何让一个服务器同时处理超过一万个客户端连接。

第一个公开版本发布于 2004 年 10 月。自此，Nginx 此开始了它的快速发展。Nginx 目前是世界上使用最多的 Web 服务器之一，根据 Netcraft 的统计，截至 2024 年 2 月，Nginx 占据了全球 Web 服务器市场的 32.8% 的份额，仅次于 Apache。

## 安装与管理

主流 Linux 发行版的包管理工具都支持下载 nginx，这里以 Manjaro 为例：

```Bash
sudo pacman -S nginx
```

Nginx 可通过`-s`参数响应一些自带的信号，比如：

- `stop`：立即关闭
- `quit`：正常关闭
- `reload`：重新加载配置文件
- `reopen`：重新打开日志文件

例如，当我们在`etc/nginx/conf.d`中修改配置文件添加 Web 服务时，改动内容并不会直接生效，需要我们重启 nginx 服务或者使用`-s reload`指令传递重新加载配置文件的信号。

此外，我们可以通过`systemctl`等指令管理本地的 Nginx 服务，比如最常见的检查 Nginx 状态的指令：

```Bash
systemctl status nginx
```

## Nginx配置文件结构

在正式介绍之前，我想要先从 nginx 配置文件入手，这可能会更加便于理解，毕竟配置文件是我们接触 nginx 最直接的地方。

Linux 下 nginx 配置文件的默认位置是在`/etc/nginx/nginx.conf`，这里先举一个简单的例子：

```Nginx
# 全局块
user  nobody; # 指定运行nginx服务的用户和用户组
worker_processes  1; # 指定工作线程数
error_log  logs/error.log; # 指定错误日志的路径和级别
pid        logs/nginx.pid; # 指定pid文件的路径

# events块
events {
    worker_connections  1024; # 指定每个工作进程可以同时开启的最大连接数
}

# http块
http {
    # http全局块
    include       mime.types; # 引入MIME-Type定义文件
    default_type  application/octet-stream; # 设置默认的MIME-Type
    sendfile        on; # 开启sendfile传输文件的优化
    keepalive_timeout  65; # 设置连接超时时间

    # server块
    server {
        # server全局块
        listen       8000; # 监听8000端口
        server_name  localhost; # 设置虚拟主机的名称

        # location块
        location / {
            root   html; # 设置根目录的路径
            index  index.html index.htm; # 设置默认的首页文件
        }

        # location块
        location /images {
            root   /data; # 设置图片资源的路径
            autoindex on; # 开启目录浏览功能
        }

        # location块
        location ~ \.php$ {
            root           html; # 设置PHP文件的路径
            fastcgi_pass   127.0.0.1:9000; # 设置PHP-FPM的地址和端口
            fastcgi_index  index.php; # 设置默认的PHP文件
            fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name; # 设置PHP脚本的完整路径
            include        fastcgi_params; # 引入fastcgi的配置文件
        }
    }
}
```

- 全局块：从开始到`events`块之间的部分，主要设置一些影响 nginx 服务器整体运行的配置指令，例如`user`，`worker_processes`，`error_log`，`pid`等。
- `events`块：涉及的指令主要影响 nginx 服务器与用户的网络连接，例如`worker_connections`，`accept_mutex`，`multi_accept`，`use`等。
- `http`块：包含`http`全局块和多个`server`块，代理、缓存和日志定义等绝大多数的功能和第三方模块的配置都可以放在这个块中。`http`全局块是不包含在`server`块中的部分，主要设置一些影响`http`协议的配置指令，例如`include`，`default_type`等。`server`块是虚拟主机的配置，每个`server`块可以包含`server`全局块和多个`location`块。`server`全局块是不包含在`location`块中的部分，主要设置一些影响虚拟主机的配置指令，例如`listen`，`server_name`等。`location`块是 URL 匹配的配置，每个`location`块可以包含一些针对特定请求的处理规则，例如`root`，`index`，`proxy_pass`等。

从方便理解的角度，每个`server`块就对应一个应用，而`location`可以理解为应用对应的路由。一般情况下，我们想要在自己的服务器中新增某个 Web 应用配置，就在`http`块中添加`server`块即可。

你可以尝试在 nginx 默认端口为 80 的`server`块中添加下面这个`location`块：

```Nginx
location / {
    default_type text/plain
    return 200 "pong"
}
```

退出保存，使用`nginx -s reload`重新加载配置文件，使用`curl`或在浏览器中请求`http://ocalhost/ping`，即可得到返回的`pong`响应数据。

```Bash
curl http://localhost/ping # pong
```

## 工作模式概述

在正式开始 Nginx 进程模型的介绍之前，还需要了解下 nginx 的基本工作模式是怎样的。

Nginx 服务启动后，会创建一个 master 主进程，该主进程在进行一部分初始化工作后，会产生一个或多个工作进程 worker；收到来自客户端的请求后，nginx 可能涉及与后端服务器的通信，它可以将收到的 http 请求代理转发到目标服务器，由专门的后端服务器处理数据。

同时，为了提高对请求的响应效率，降低服务器受到的网络压力，nginx 采用了缓存机制，将历史应答数据缓存到本地，保障了客户端对缓存文件的快速访问。

## 进程模型

Nginx 采用了 master-worker 进程模型。相比于 apache 采用的传统多进模型，nginx 的进程模型有一些显著的优势：

- Master-worker 异步非阻塞的特点允许 nginx 在高并发下保持低资源低消耗高性能，同时也提高了服务的稳定性，单个 workder 进程出现异常不影响其他 worker 和 master 的运行；
- 实现了热部署，即在不重启 nginx 服务的前提下重新加载配置文件；
- ……

![20240229225629](https://img.ma5hr00m.top/blog/20240229225629.png)

### master 进程

master 模块负责接收外部信号，在根据信号的不同管理 worker 模块以实现对应的功能。master 模块本身不会处理网络请求，它只是作为一个调度者，作为用户与 worker 之间的桥梁而存在。

在 nginx 服务初始化时，master 会读取并解析配置文件，出现错误就报告并推出。我们可以使用`-t`参数主动检查配置文件是否存在错误，以确保不会重启 nginx 失败：

```Bash
sudo nginx -t
```

在运行过程中，master 进程也会监控 worker 进程运行状态、如果 worker 模块出现异常，master 就会`fork()`一个新的 worker 进程，保证整个 nginx 服务正常运行。

那现在，我们会想知道 master 进程具体是如何管理 worker 进程的呢 🤔️

### master 管理 worker

master 进程通过信号量机制（Semaphore Mechanism）和定时器机制（Timer Mechanism）来监控并管理 worker 进程。

信号量机制（semaphore mechanism）是一种用于实现进程间同步和互斥的方法，它使用一个整数变量来表示系统中某种资源的数量或状态，进程可以通过原子操作（atomic operation）来增加或减少信号量的值，从而实现对资源的请求和释放。

nginx 的 master 模块和 worker 模块之间通过信号（signal）来实现同步和通信，信号是一种用于进程间交互的软件中断，它可以用来传递一些简单的信息或命令。nginx 使用了一些预定义的信号，比如`SIGCHLD`、`SIGALRM`、`SIGTERM`、`SIGQUIT`、`SIGHUP`、`SIGUSR1`等，每个信号都有特定的含义和作用。

- 当 worker 模块退出或者崩溃时，它会向 master 模块发送`SIGCHLD`信号，通知 master 模块有子进程已经终止。master 模块在收到`SIGCHLD`信号后，会调用`waitpid()`函数来回收子进程的资源，并检查子进程的退出码，如果是非正常退出，就会重新`fork()`一个新的 worker 模块，保证服务的可用性。
- 当 master 模块需要重启或者升级时，它会向 worker 模块发送`SIGTERM`或者`SIGQUIT`信号，要求 worker 模块正常关闭或者立即终止。worker 模块在收到这些信号后，会停止接受新的请求，并处理完已经接受的请求，然后退出。master 模块在收到所有 worker 模块的`SIGCHLD`信号后，会重新加载配置文件，并启动新的 worker 模块。
- 当 master 模块需要重新加载配置文件或者重新打开日志文件时，它会向 worker 模块发送`SIGHUP`或者`SIGUSR1`信号，要求 worker 模块重新读取配置文件或者重新打开日志文件。worker 模块在收到这些信号后，会先关闭旧的配置文件或者日志文件，然后打开新的配置文件或者日志文件，并继续处理请求。

而定时器机制（timer mechanism）是一种用于实现进程间通信和调度的方法，它使用一个计数器来表示系统中某种事件的发生时间或间隔，进程可以通过设置或取消定时器来触发或取消某种动作，从而实现对事件的响应和控制。

nginx 则使用了`SIGALRM`信号来实现定时器的功能。

- 当 master 模块启动时，它会设置一个定时器，每隔一定的时间（默认是 5 秒），就会向 worker 模块发送 `SIGALRM`信号，要求 worker 模块向 master 模块报告自己的状态，比如是否存活、是否忙碌、是否有异常等。master 模块在收到 worker 模块的回应后，会更新 worker 模块的状态，并根据 worker 模块的状态来调整定时器的间隔，如果 worker 模块频繁退出或者出错，就会缩短定时器的间隔，反之则会延长定时器的间隔。
- 当 master 模块收到`SIGALRM`信号时，它会检查 worker 模块是否存活，如果发现有 worker 模块已经死亡，就会重新`fork()`一个新的 worker 模块，保证服务的可用性。master 模块还会检查 worker 模块是否忙碌，如果发现有 worker 模块长时间没有处理请求，就会认为 worker 模块已经卡死，然后向 worker 模块发送`SIGKILL`信号，强制终止 worker 模块，并重新`fork()`一个新的 worker 模块，保证服务的可用性。

### worker 进程 

worker 接受 master 的调度，负责处理客户端的连接和请求。客户端的请求完全由 worker 处理，而且请求与 worker 是一一对应的关系。同时，worker 进程之间都是平等关系。

这句话可以引出来一个问题：worker 之间是平等的关系，每条请求只由单个 worker处理，但接收请求时会存在多个 worker，那 master 是怎么决定让哪个 worker 去处理当前请求的呢？

### worker 工作流程

在开始之前，有必要先介绍 nginx 的 accepy_mutex 机制，该机制有效的避免了惊群效应（thundering herd problem）和锁队列（lock convoy）问题，而这些问题会导致 nginx 的性能下降和资源浪费。

accept_mutex 是一个互斥锁（mutex），它可以保证在同一时刻，只有一个 worker 可以接受新连接，其他 worker 则会等待或者处理已有的连接。

accept_mutex 机制的开启和关闭可以通过配置文件中的`accept_mutex`指令来控制，它的默认值是`off`。同时，还会有一个`accept_mutex_delay`时间参数，它指定了在另一个 worker 正在接受新连接的情况下，worker 尝试重新开始接受新连接的最长时间，它的默认值是`500ms`。这个参数可以避免工作进程频繁地抢夺 accept_mutex，从而减少系统开销。

好，到这里就差不多。现在介绍 worker 工作流程。

在 nginx 服务器启动时，会先创建一个 master 进程，master 会先建立好需要`listen`的 socket（listenfd）之后，再根据配置文件中`worker_process`指令创建指定数量的 worker 进程，用于处理请求。然后，master 会创建 accept_mutex，并把它传递给 worker。

每个 worker 都会初始化事件模块（event module）和连接模块（connection module），事件模块负责监听和处理事件，连接模块负责管理连接。worker 会根据配置文件中的`use`指令，选择最合适的事件通知机制,再根据配置文件中的`worker_connections`指令，创建一个连接池（connection pool），并分配一定数量的连接（connection）给事件模块，每个连接都有一个读事件（read event）和一个写事件（write event）。

当有新连接到来时，事件模块会通知 worker，然后所有 worker 会来抢唯一的 accept_mutex，抢到 mutex 的 worker 进程就会注册 listenfd 读事件，在读事件里调用 accept 接受该连接。当 worker 接受完新连接后，它会释放 accept_mutex，并处理新连接的请求。

那没抢到 mutex 的 worker 会做什么呢？它们会等待`accept_mutex_delay`的时间，如果在这段时间内没有其他 worker 获得 mutex，它们就会再次尝试获取 mutex，并重复上述过程；如果在这段时间内有其他 worker 获得 mutex，那么等待的 worker 就会放弃，转而继续处理已有的连接或者进入休眠状态。

抢到 mutex 的 worker 会进入事件循环（event loop），不断地检查事件队列中是否有就绪的事件，如果有，就调用相应的事件处理函数。对于读事件，事件处理函数会读取客户端发送的数据，并根据数据的类型，调用相应的模块来处理请求，例如，如果是 HTTP 请求，就调用 HTTP 模块（HTTP module）；如果是邮件请求，就调用邮件模块（mail module）……对于写事件，事件处理函数会发送数据给客户端，并根据数据的状态，决定是否关闭连接或者继续处理请求。

处理完一个连接或者请求时，worker 会把连接放回连接池中，等待下一次使用，或者释放连接，以便其他工作进程使用。

## 补充

### Netcraft

Netcraft 是一家英国的网络安全公司，成立于 1995 年。该公司主要提供互联网基础架构，网络安全，以及网站评测等服务。 其中，Netcraft 的网站评测功能可以帮助用户评估网站的安全性，包括网站托管地址，服务器软件，以及脚本语言等信息。

Netcraft 每月都会对全球的网站进行抽样调查，收集网站的响应头、域名、IP 地址、证书等数据，然后根据这些数据分析出网站使用的服务器软件，操作系统，网络服务商等信息。

Netcraft 的调查报告已经成为人们了解全球网站数量以及各种服务器市场份额等情况的主要依据。访问 [Netcraft](https://www.netcraft.com/) 的官网就可以查看最新的调查结果，或者使用它的搜索功能，查询任意网站的相关信息。

### 异步非阻塞

前文中有提到 master-worker 是一种异步非阻塞的进程模型。我认为可以在这里做一个更详细的描述，就是该进程模型为什么是“异步非阻塞”的：

- **异步**：在 nginx 的 master-worker 模式中，master 进程负责管理 worker 进程，而 worker 进程则处理实际的客户端请求。这种架构下，master 进程和 worker 进程之间采用异步通信方式，master 进程不会阻塞在等待 worker 进程的响应上，从而提高了整体的并发处理能力；
- **非阻塞**：nginx 中的 worker 进程使用非阻塞 I/O 操作来处理客户端请求。这意味着当一个请求需要进行 I/O 操作时（比如读取文件或从网络接收数据），worker 进程不会一直等待数据准备就绪，而是会继续处理其他请求。一旦数据准备就绪，worker 进程会立即处理它，而不会阻塞在这个操作上；
- **事件驱动**：nginx 使用事件驱动的方式来处理 I/O 操作。它利用操作系统提供的事件通知机制（如 epoll 或 kqueue）来实现非阻塞 I/O。当一个事件发生时（比如一个连接建立或数据可读），nginx 将相应的事件添加到事件队列中，并通过事件驱动的方式处理这些事件，而不是通过阻塞式的等待。

nginx 的 master-worker 模式通过异步、非阻塞和事件驱动的设计，实现了高性能和高并发处理能力。这种模式使得 nginx 能够高效地处理大量并发请求，而不会因为阻塞在 I/O 操作上而导致性能下降。而 apache 传统的多进程模型（Prefork）无法实现异步非阻塞，所以会把这点作为 nginx 相比 apache 的一个优势。

## 后话

只是一个概述，很多内容等着补充 😪️

## 参考文档

- [Nginx 中文文档](https://docshome.gitbook.io/nginx-docs/)
- [Nginx 完全手册](https://www.freecodecamp.org/chinese/news/the-nginx-handbook/)，by freeCodeCamp
- [Nginx 工作模式和进程模型](https://learnku.com/articles/38414)，by 已下线
