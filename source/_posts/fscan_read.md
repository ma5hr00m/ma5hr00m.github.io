---
title: fscan v1.8.4 源码阅读
date: 2024/6/19
author: ma5hr00m
categories:
- Source Code Read
---

用官方自己的话来描述，fscan 是“一款内网综合扫描工具，方便一键自动化、全方位漏扫扫描”。简而言之就是扫描器，且是比较经典的一款，目前在Web安全领域广泛应用，与另一款扫描器 gogo 互补。

![image-20240619181748772](https://img.ma5hr00m.top/blog/image-20240619181748772.png)

此次直接分析最新版的 fscan 源码，即 `v1.8.4`，目录结构比 frp 更加简单明了（毕竟扫描器的原理说白了就是各种姿势地发包）：

```shell
fscan:
├─common
├─image
├─Plugins
├─main.go
├─go.mod
├─go.sum
└─WebScan
    ├─info
    ├─lib
    └─pocs
```

## v1.8.4

### 入口文件

根目录下的入口文件 `main.go`，根据其内容我们可以将 fscan 的源码拆解为四部分：

```go
func main() {
	start := time.Now()
	// ★ 声明一个 common.HostInfo 结构体，存储 frp 客户端信息
    var Info common.HostInfo
	// ★ 解析命令行参数，写入 info
    common.Flag(&Info)
	// ★ 进一步处理解析后的参数
    common.Parse(&Info)
    // ★ 传入处理后的参数，选择合适的插件开始扫描
	Plugins.Scan(Info)
	fmt.Printf("[*] 扫描结束,耗时: %s\n", time.Since(start))
}
```

### 配置信息

对应 `/common/config.go`，记 146 行，基本都是在预定义变量，只有两个结构体需要提一下：

```go
// 主机信息
type HostInfo struct {
	Host    string
	Ports   string
	Url     string
	Infostr []string
}

// 跟踪特定主机的漏洞检测情况
type PocInfo struct {
	Target  string
	PocName string
}
```

其他的都比较稀松平常。配置信息中包括常用服务及端口的对应关系，默认 `User-Agent`，输出文件信息，甚至还有一些 Web 应用服务的常用密码。我比较在意的是这种配置信息为什么要硬编码在 go 文件中的，而不是像 frp 那种定义在 `toml` 文件中再编写一个 `config.go` 将其映射为结构体。

## 后话

fscan 其实有不少可以改进的点，比如开头就提到的负责配置信息的 `config.go` 结构。现在能找到的基于 fscan 二开的工具也不少（但多数闭源，毕竟改一个杀软盯一个）。

现在 fscan   的相似的扫描器 gogo 的功能也很强大，而且在设计理念上十分超前，内存管理完善，扫描速度也比 fscan 要快。我下一步会再去琢磨琢磨 gogo 的源码，与 fscan 进行个对比。

其实本来想直接将二者的源码分析合在一篇博客中，但觉得那样有点贪就放弃了。
