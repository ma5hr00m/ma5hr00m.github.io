# 你知道 Clash 吗？

[什么是 Clash? | Clash 知识库](https://clash.wiki/)

有一说一，大家肯定都知道 Clash，但很多人对这东西的印象就是一个翻墙工具，导入订阅链接点几下就行，并不理解 Clash 究竟做了什么。

Clash 是一个运行在网络层和应用层的、基于规则的代理工具，它所能做的不仅仅是帮你转发流量到互联网访问其它应用（当然这算是主要功能）。Clash 在本质上是对用户本机的流量进行管理，实现智能路由和访问控制，如果你会写 Clash 配置文件的话，就可以轻松实现访问外网应用时自动走代理，而在访问指定国内应用时不走代理直接访问。

其工作原理和工作流程说来也简单，用一句话就能解释清楚：接收本机流量后根据规则进行转发，下文会对这一过程进行介绍。

看完这篇文章，你应该可以对 Clash 的本质以及其工作原理有一个相对清晰的认识，可以轻松看懂那些“订阅链接”背后是什么，并且可以独立编写 Clash 配置文件。

## 工作流程

我们可以把 Clash 的工作过程简单分为三步，

1. **Inbound 入站：**当你在设备上启动 Clash 时，它会创建一个或多个本地监听端口，这些端口用于接收来自设备上的应用程序的网络请求；
2. **基于规则的路由：**Clash 配置文件中的 **`rules`** 部分定义了如何处理不同类型的网络请求。例如上文说的只转发部分流量；
3. **Outbound 出站：**Clash 根据配置文件中的规则，将入站的网络请求转发到不同的出站连接，可以连接到某个网络接口、某个代理服务器，也可以是某个策略组。

![20240613024509](https://img.ma5hr00m.top/blog/20240613024509.png)

## 四种代理模式

在 Clash 操作页面，可以看到四种代理模式，一般情况下选择“规则”就好，足够用户使用。这里对这四种都做一下介绍：

1. **规则（Rule）**：这是 Clash 配置中最重要的部分之一。规则用于定义哪些流量应该被代理，哪些应该直连。用户可以根据域名、IP、地理位置等条件来设置规则。
2. **直连（Direct）**：直连选项通常用于设置哪些流量不需要通过代理服务器直接访问。这通常用于访问本地网络资源或者信任的网站。
3. **全局（Global）**：全局模式下，所有的网络流量都会通过代理服务器。这个模式适用于需要代理所有流量的情况。
4. **脚本（Script）**：脚本功能允许用户编写或使用现有的 JavaScript 脚本来自定义复杂的流量处理逻辑，比如修改请求头、响应内容等，从而实现更灵活的分流规则。

## 配置文件

[https://clash.skk.moe/](https://clash.skk.moe/)

前面说的入站、入站和规则都需要在配置文件中指定。Clash 的主配置文件名为 `config.yaml`，默认情况下会在 `$HOME/.config/clash` 目录读取配置文件。如果该目录不存在，Clash 会在该位置生成一个最小的配置文件。

如果需要指定其他位置的配置文件，需要在命令行中使用 `-f` 参数：

```bash
clash -f /etc/clash/config.yaml
```

一份完整的 Clash 配置文件包括多个部分，下面一一介绍。

### General 配置

在 Clash 配置文件中，General 配置包含了一些必需的字段以及可选的配置项，通常位于配置文件开头部分。其中 `port`，`socks-port` 和 `allow-lan` 是必需的字段，用于指定 Clash 的端口、SOCKS5 代理端口以及是否允许局域网连接。如果需要启用透明代理，还需要指定 `redir-port` 字段，用于指定透明代理的端口。

还有个特殊的 `mixed` 字段，用于指定混合配置端口，这个端口同时支持 HTTP(S) 和 SOCKS5 协议。

除了这些必需字段外，还有一些可选的配置项，下面简单罗列几个：

- `dns`：用于配置DNS相关设置。
- `external-controller`：用于指定 RESTful API 的地址和端口。
- `secret`：可选项，用于设置 RESTful API 的密钥。
- `cfw-bypass`：可选项，用于配置规则以绕过代理。

在编写 General 配置时可以参考以下内容，各个字段的作用都以注释的形式标注：

```yaml
port: 7890 # HTTP端口
socks-port: 7891 # SOCKS5端口
redir-port: 7892 # Linux和macOS的重定向端口
mixed: 7893 # 混合端口
allow-lan: false

# 仅在设置allow-lan为true时适用
# "*": 绑定所有IP地址
# 192.168.122.11: 绑定单个IPv4地址
# "[aaaa::a8aa:ff:fe09:57d8]": 绑定单个IPv6地址
bind-address: "*"

# Rule / Global/ Direct（默认为Rule）
mode: Rule

# 将日志级别设置为stdout（默认为info）
# info / warning / error / debug / silent
log-level: info

external-controller: 127.0.0.1:9090 # Clash的RESTful API

# 您可以将静态Web资源（如clash-dashboard）放入一个目录，并且Clash将在`${API}/ui`中提供服务
# 输入是相对于配置目录的相对路径或绝对路径
external-ui: "path/to/local/clash-dashboard"

secret: "" # RESTful API的密钥（可选）

experimental: # 实验性功能
  ignore-resolve-fail: true # 忽略DNS解析失败，默认值为true

# 本地SOCKS5/HTTP(S)服务器的身份验证
authentication:
  - "user1:pass1"
  - "user2:pass2"

# 实验性主机，支持通配符（例如*.clash.dev 甚至*.foo.*.example.com）
# 静态域比通配符域具有更高的优先级（foo.example.com > *.example.com）
hosts:
  '*.clash.dev': 127.0.0.1
  'alpha.clash.dev': '::1'

dns:
  enable: true # 设置为true以启用DNS（默认为false）
  ipv6: false # 默认为false
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip # 或redir-host
  fake-ip-range: 198.18.0.1/16 # 如果不知道是什么，请勿更改
  nameserver:
    - 114.114.114.114
    - tcp://1.1.1.1
  fallback: # 与nameserver并发请求，当GEOIP国家不是CN时使用fallback
    - tls://dns.rubyfish.cn:853 # DNS over TLS
    - https://1.1.1.1/dns-query # DNS over HTTPS
  fallback-filter:
    geoip: true # 默认
    ipcidr: # 这些子网中的IP将被视为污染
      - 240.0.0.0/4
```

### Proxy 配置

Proxy 配置以及 Proxy Group 配置就是 Clash 控制流量出站的主要配置。

Proxy 配置用于指定 Clash 连接代理服务器的相关信息。这包括代理服务器的地址、端口、类型等信息。通过正确配置这一部分，Clash 可以根据你的需求将流量转发到不同的代理服务器。例如，你可以设置多个代理节点，并为它们指定不同的类型，如 **`ss`**、**`vmess`**、**`socks5`**、**`http`** 和 **`snell`**。

配置 Proxy 部分时可以参考以下内容：

```yaml
proxy:
  # shadowsocks
  - name: "ss1"
    type: ss
    server: server
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"
    # udp: true

  - name: "ss2"
    type: ss
    server: server
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"
    plugin: v2ray-plugin
    plugin-opts:
      mode: websocket
      # tls: true
      # skip-cert-verify: true
      # host: bing.com
      # path: "/"
      # mux: true
      # headers:
      #   custom: value

  # vmess
  - name: "vmess"
    type: vmess
    server: server
    port: 443
    uuid: uuid
    alterid: 32
    cipher: auto
    # udp: true
    # tls: true
    # skip-cert-verify: true
    # network: ws
    # ws-path: /path
    # ws-headers:
    #   host: v2ray.com

  # socks5
  - name: "socks"
    type: socks5
    server: server
    port: 443
    # username: username
    # password: password
    # tls: true
    # skip-cert-verify: true
    # udp: true

  # http
  - name: "http"
    type: http
    server: server
    port: 443
    # username: username
    # password: password
    # tls: true
    # skip-cert-verify: true

  # snell
  - name: "snell"
    type: snell
    server: server
    port: 44046
    psk: yourpsk
    # obfs-opts:
    #   mode: http
    #   host: bing.com
```

### Proxy Group 配置

proxy group 配置部分的作用是定义策略组，这些策略组可以在规则中使用来决定网络请求通过哪个代理节点。策略组允许你根据不同的场景和需求，组合和管理多个代理节点。例如，你可以创建一个策略组来自动选择延迟最低的节点，或者创建一个策略组来手动选择特定的节点。

配置 Proxy Group 部分时可以参考以下内容：

```yaml
proxy-group:
  # url-test 通过测试访问 URL 的速度来选择使用哪个代理。
  - name: "auto"
    type: url-test
    proxies:
      - ss1
      - ss2
      - vmess1
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

  # fallback 通过优先级选择可用的策略。可用性通过访问 URL 来测试，就像自动 url-test 组一样。
  - name: "fallback-auto"
    type: fallback
    proxies:
      - ss1
      - ss2
      - vmess1
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

  # load-balance: 相同 eTLD 的请求将在同一个代理上拨号。
  - name: "load-balance"
    type: load-balance
    proxies:
      - ss1
      - ss2
      - vmess1
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

  # select 用于选择代理或代理组
  # 您可以使用 RESTful API 切换代理，推荐在 GUI 中使用。
  - name: Proxy
    type: select
    proxies:
      - ss1
      - ss2
      - vmess1
      - auto
```

### Rule 配置

Rule 配置部分的作用是定义网络请求的匹配规则，以决定哪些请求应该被代理、直连或拒绝。这些规则基于请求的不同属性，如域名、IP 地址、端口号或地理位置来匹配流量。

配置 Rule 部分时可以参考以下内容：

```yaml
rule:
  - domain-suffix,google.com,[策略组的名称]
  - domain-keyword,google,[策略组的名称]
  - domain,google.com,[策略组的名称]
  - domain-suffix,ad.com,REJECT
  - ip-cidr,127.0.0.0/8,DIRECT
  # rename source-ip-cidr and would remove after prerelease
  - src-ip-cidr,192.168.1.201/32,DIRECT
  - geoip,CN,DIRECT
  - dst-port,80,DIRECT
  - src-port,7777,DIRECT
  # final would remove after prerelease
  # you also can use `final,Proxy` or `final,,Proxy` now
  - match,[策略组的名称]
```

后面会详细介绍每一种可用的规则，后面再细看。

## Inbound 入站协议

- SOCKS5
- HTTP(S)
- Redirect TCP
- TProxy TCP
- TProxy UDP
- Linux TUN 设备（仅 Premium 版本）

[一口气搞明白有点奇怪的 Socks 5 协议以及 HTTP 代理](https://www.txthinking.com/talks/articles/socks5-and-http-proxy.article)

入站协议中主要就是对 SOCKS5 和 HTTP 做区分，三种透明代理后面单独说。

SOCKS5 代理提供全面的网络协议支持，支持认证、更安全，同时支持 UDP 协议，以及提供了较好的性能和兼容性。HTTP 代理则仅能代理 HTTP 和 HTTPS 协议的流量，通常用于网页浏览，它可以高效地缓存数据，降低带宽消耗，但不适用于所有网络协议。

一般浏览网页的话配个 HTTP 代理就行，其他情况直接 SOCKS5。

## Outbound 出站 Proxy

Clash 出站种类较多，且各自使用场景不同。前面讲过了配置文件的写法，可以把 Clash 出站分为 Proxy 和 Proxy Group 两种，这里也分开介绍。

### Shadowsocks/ShadowsocksR

[Shadowsocks/SS教程 - tlanyan](https://itlanyan.com/on-fuck-gfw-again/)

**Shadowsocks** 是一个基于 SOCKS5 协议的加密代理，它使用各种加密方法来保护数据流。Clash 支持的 Shadowsocks 加密方法包括：

| 系列 | 加密方法 |
| --- | --- |
| AEAD | aes-128-gcm, aes-192-gcm, aes-256-gcm, chacha20-ietf-poly1305, xchacha20-ietf-poly1305 |
| 流式 | aes-128-cfb, aes-192-cfb, aes-256-cfb, rc4-md5, chacha20-ietf, xchacha20 |
| 块式 | aes-128-ctr, aes-192-ctr, aes-256-ctr |

此外，Clash 还支持 Shadowsocks 的插件，如 obfs 和 v2ray-plugin，这些插件可以提供额外的混淆功能，进一步增强隐私保护。

**ShadowsocksR** 是 Shadowsocks 的一个扩展版本，它增加了更多的混淆和协议选项，以提高抗审查能力。Clash 支持的 ShadowsocksR 加密方法和混淆方法包括：

| 系列 | 加密方法 |
| --- | --- |
| 流式 | aes-128-cfb, aes-192-cfb, aes-256-cfb, rc4-md5, chacha20-ietf, xchacha20 |

一般情况下，我们现在各种平台的订阅基本都是默认的 ss 协议。

补充个小趣闻，ssr 协议在其发展过程中引起了一些争议。最初，ssr 项目因为违反 GPL 许可证而受到批评。原开发者对此表示不满，因为这违反了开源项目的基本原则。后来，ssr 项目改为采用与 ss 相同的 GPL、Apache 许可证、MIT 许可证等多重自由软件许可协议，缓解了部分争议。

### Vmess

**VMess** 是一个无状态的加密通信协议，且所有数据都通过 TCP 传输。

每当 VMess 客户端发起请求时，服务器会判断是否来自合法客户端。如果验证通过，请求就会被转发。之后，获得的响应会被发送回客户端。VMess 使用非对称格式，客户端的请求和服务器的响应格式不同。

Clash 支持以下 Vmess 的加密方法:

- auto：自动选择，默认值。
- aes-128-gcm：推荐在 PC 上使用。它是一种高效的加密算法，通常用于需要高吞吐量的应用。
- chacha20-poly1305：推荐在移动设备上使用。它适用于那些没有硬件AES 加速的设备，因为它在软件实现中更快。
- none

### SOCKS5

### HTTP

### Snell

Clash 也集成了对 Snell 的支持。

**Snell** 是一种精简的加密代理协议，由 Surge 团队开发，也是一种较为经典的反审查协议。它的设计初衷是为了提供极致的性能和简单的配置过程，同时支持 UDP over TCP中继。此外，Snell 是单一二进制文件，零依赖（除了glibc），这也使得 Snell 易于部署和维护。
该协议的使用场景主要集中在需要绕过网络审查、保护隐私和数据加密的环境中。由于其高性能和简单配置的特点，Snell适用于个人用户和小型企业，尤其是在网络审查较为严格的地区。

小提示，Snell@v4 没有提供向下兼容，需要客户端服务端均进行升级。

想知道更多相关知识去看这个 gitbook：https://manual.nssurge.com/others/snell.html

### Trojan

Clash 内置了对流行协议 Trojan 的支持。

**Trojan** 是近几年才兴起的网络工具，特点同样是确保数据传输的安全性和隐私性。但与传统的 ss/ssr 不同的是，ss/ssr 保证数据传输安全的手段是加密混淆，而 Trojan 的思路是将流量伪装成最常见的 HTTPS 流量。

[trojan教程 - tlanyan](https://itlanyan.com/trojan-tutorial/)

## Outbound 出站 Proxy Groups

Proxy Groups 策略组用于根据不同策略分发规则传递过来的请求，其可以直接被规则引用，也可以被其他策略组引用，而最上级策略组被规则引用。

### Relay 中继

```yaml
Relay:
  - name: "US-JP Relay"
    type: relay
    proxies:
      - "US-Proxy"
      - "JP-Proxy"
```

适用于当用户需要将流量通过特定的国家或地区进行中继时。比如用户想要访问仅限日本的内容，但同时想要通过美国的代理增加匿名性。

### URL-Test 延迟测试

```yaml
Url-Test:
  - name: "Fastest-Proxy"
    type: url-test
    proxies:
      - "Proxy-A"
      - "Proxy-B"
    url: "http://www.gstatic.com/generate_204"
    interval: 600
```

自动选择延迟最低的代理服务器。比如用户在进行在线游戏或视频会议时，需要确保连接是最快的。

### Fallback 可用性测试

```yaml
Fallback:
  - name: "Available-Proxy"
    type: fallback
    proxies:
      - "Proxy-A"
      - "Proxy-B"
    url: "http://www.gstatic.com/generate_204"
    interval: 600
```

确保总是有一个可用的代理服务器。比如用户在进行重要的网络操作，如在线交易，需要确保不会因为代理服务器的问题而中断。

### Load-Balance 负载均衡

```yaml
Load-Balance:
  - name: "Balance-Group"
    type: load-balance
    proxies:
      - "Proxy-A"
      - "Proxy-B"
    sticky-session: true
```

当用户想要在多个代理服务器之间分配负载时。比如用户在下载大文件或进行多线程下载时，可以平均分配流量以优化速度。

### Select 手动选择

```yaml
Select:
  - name: "Manual-Select"
    type: select
    proxies:
      - "Proxy-A"
      - "Proxy-B"
    interface-name: "en0"
```

最常用，平常在 Clash 里点点点切换代理服务器的时候基本都是在用 Select 策略组。

适用于用户想要完全控制选择哪个代理服务器。比如用户根据不同的网络活动（如流媒体、游戏或工作）手动切换代理服务器。

### DIRECT 直连出站

```yaml
Direct:
  - name: "Direct-Connection"
    type: direct
    interface-name: "en0"
```

## Outbound 出站 Proxy Providers

前面介绍了 Clash 出站时的 Proxy 和 Proxy Groups，单独的机场订阅链接这两个就够用了。一般情况下是配置文件中配置一串 Proxy，然后 Proxy Groups 中配置一个 Select 策略供用户自行选择，额外再配置几个 url-test 用于实现自动选择和流量监测。

但如果我们有多个机场链接，现在想编写一个统一的配置文件，流畅地在多个订阅之间切换代理服务器，应该怎么做？刚开始的想法可能是 cv 硬编码进去，但这种实现方案比较臃肿。幸好，Clash Premium Core 已经支持了 **Proxy Providers**，实现提供在线规则集，可以通过托管链接获取节点信息，避免了硬编码。

一个可供参考的使用示范如下：

```yaml
# config.yaml
proxy-providers:
  test:
    type: file
    path: /test.yaml
    health-check:
      enable: true
      interval: 36000
      url: http://www.gstatic.com/generate_204
```

```yaml
# test.yaml
proxies:
  - name: "ss1"
    type: ss
    server: server
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"

  - name: "ss2"
    type: ss
    server: server
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"
    plugin: obfs
    plugin-opts:
      mode: tls
```

[Clash proxy-provider 搭配 subconverter 使用小记 - 方寸间](https://www.10101.io/2020/02/12/use-clash-proxy-provider-with-subconverter)

## Rules 规则

规则是 Clash 的精华部分，也是一份配置文档中最为冗长的部分。打开你现在使用的订阅链接配置文件，几千行的配置信息中，可能只有前几十行是出入站配置，剩下的所有都是 rules 规则。

一条规则的基本格式如下：

```yaml
# 类型,参数,策略(,no-resolve)
TYPE,ARGUMENT,POLICY(,no-resolve)
```

其中 `no-resolve` 选项是可选的, 它用于跳过规则的 DNS 解析。当你想要使用 `GEOIP`、`IP-CIDR`、`IP-CIDR6`、`SCRIPT` 规则，但又不想立即将域名解析为 IP 地址时，这个选项就很有用了。
Clash 可用的规则类型其实不多，感觉自己也讲不出什么新点，但不写在着文章里感觉又不完整，索性 cv 了[这份文档](https://clash.wiki/configuration/rules.html#%E8%A7%84%E5%88%99%E7%B1%BB%E5%9E%8B)，就稍微改了下格式，推荐去原文档看。

### DOMAIN 域名

```yaml
DOMAIN,www.google.com,policy
```

将 `www.google.com` 路由到 `policy`。

### DOMAIN-SUFFIX 域名后缀

```yaml
DOMAIN-SUFFIX,youtube.com,policy
```

将任何以 `youtube.com` 结尾的域名路由到 `policy`。在这种情况下，`www.youtube.com` 和 `foo.bar.youtube.com` 都将路由到 `policy`。

### DOMAIN-KEYWORD 域名关键字

```yaml
DOMAIN-KEYWORD,google,policy
```

将任何包含 `google` 关键字的域名路由到 `policy`。在这种情况下，`www.google.com` 或 `googleapis.com` 都将路由到 `policy`。

### GEOIP IP地理位置 (国家代码)

GEOIP 规则用于根据数据包的目标 IP 地址的**国家代码**路由数据包，Clash 使用 [**MaxMind GeoLite2**](https://dev.maxmind.com/geoip/geoip2/geolite2/) 数据库来实现这一功能。使用这种规则时，Clash 将域名解析为 IP 地址，然后查找 IP 地址的国家代码。

```yaml
GEOIP,CN,policy
```

将任何目标 IP 地址为中国的数据包路由到 `policy`。

### IP-CIDR IPv4地址段

IP-CIDR 规则用于根据数据包的**目标 IPv4 地址**路由数据包。使用这种规则时, Clash 将域名解析为 IPv4 地址。

```yaml
IP-CIDR,127.0.0.0/8,DIRECT
```

将任何目标 IP 地址为 `127.0.0.0/8` 的数据包路由到 `DIRECT`。

### IP-CIDR6 IPv6地址段

IP-CIDR6 规则用于根据数据包的**目标 IPv6 地址**路由数据包。使用这种规则时, Clash 将域名解析为 IPv6 地址。

```yaml
IP-CIDR6,2620:0:2d0:200::7/32,policy
```

将任何目标 IP 地址为 `2620:0:2d0:200::7/32` 的数据包路由到 `policy`。

### SRC-IP-CIDR 源IP段地址

SRC-IP-CIDR 规则用于根据数据包的**源 IPv4 地址**路由数据包。

```yaml
SRC-IP-CIDR,192.168.1.201/32,DIRECT
```

将任何源 IP 地址为 `192.168.1.201/32` 的数据包路由到 `DIRECT`。

### SRC-PORT 源端口

SRC-PORT 规则用于根据数据包的**源端口**路由数据包。

```yaml
SRC-PORT,80,policy
```

将任何源端口为 `80` 的数据包路由到 `policy`。

### DST-PORT 目标端口

DST-PORT 规则用于根据数据包的**目标端口**路由数据包。

```yaml
DST-PORT,80,policy
```

将任何目标端口为 `80` 的数据包路由到 `policy`。

### PROCESS-NAME 源进程名

PROCESS-NAME 规则用于根据发送数据包的进程名称路由数据包。目前仅支持 macOS、Linux、FreeBSD 和 Windows。

```yaml
PROCESS-NAME,nc,DIRECT
```

将任何来自进程 `nc` 的数据包路由到 `DIRECT`。

### PROCESS-PATH 源进程路径

PROCESS-PATH 规则用于根据发送数据包的进程路径路由数据包。目前仅支持 macOS、Linux、FreeBSD 和 Windows。

```yaml
PROCESS-PATH,/usr/local/bin/nc,DIRECT
```

将任何来自路径为 `/usr/local/bin/nc` 的进程的数据包路由到 `DIRECT`。

### IPSET IP集

IPSET 规则用于根据 IP 集匹配并路由数据包. 根据 [**IPSET 的官方网站**](https://ipset.netfilter.org/) 的介绍:

> IP 集是 Linux 内核中的一个框架, 可以通过 ipset 程序进行管理。根据类型，IP 集可以存储 IP 地址、网络、 (TCP/UDP) 端口号、MAC 地址、接口名称或它们以某种方式的组合，以确保在集合中匹配条目时具有闪电般的速度。
> 

因此, 此功能仅在 Linux 上工作, 并且需要安装 `ipset`。使用此规则时, Clash 将解析域名以获取 IP 地址, 然后查找 IP 地址是否在 IP 集中. 如果要跳过 DNS 解析, 请使用 **`no-resolve`** 选项.

```yaml
IPSET,chnroute,policy
```

将任何目标 IP 地址在 IP 集 `chnroute` 中的数据包路由到 `policy`.

### RULE-SET 规则集

此功能仅在 [**Premium 版本**](https://clash.wiki/premium/introduction.html) 中可用。

RULE-SET 规则用于根据 [**Rule Providers 规则集**](https://clash.wiki/premium/rule-providers.html) 的结果路由数据包。当 Clash 使用此规则时，它会从指定的 Rule Providers 规则集中加载规则，然后将数据包与规则进行匹配。 如果数据包与任何规则匹配，则将数据包路由到指定的策略, 否则跳过此规则。

使用 RULE-SET 时，当规则集的类型为 IPCIDR ，Clash 将解析域名以获取 IP 地址。

```yaml
RULE-SET,my-rule-provider,DIRECT
```

从 `my-rule-provider` 加载所有规则。

### SCRIPT 脚本

此功能仅在 [**Premium 版本**](https://clash.wiki/premium/introduction.html) 中可用。

SCRIPT 规则用于根据脚本的结果路由数据包。当 Clash 使用此规则时，它会执行指定的脚本，然后将数据包路由到脚本的输出。使用 SCRIPT 时，Clash 将解析域名以获取 IP 地址。

```yaml
SCRIPT,script-path,DIRECT
```

将数据包路由到脚本 `script-path` 的输出.

### MATCH 全匹配

MATCH 规则用于路由剩余的数据包。该规则是**必需**的，通常用作最后一条规则。

```yaml
MATCH,policy
```

将剩余的数据包路由到 `policy`。

## 透明代理

### tproxy

参考：[tproxy（透明代理）](https://www.zhaohuabing.com/learning-linux/docs/tproxy/)

tproxy 即 transparent（透明） proxy。这里的 transparent（透明）有两层含义：

1. 代理对于 client 是透明的，client 端无需进行任何配置。即无需修改请求地址，也无需采用代理协议和代理服务器进行协商。与之相对比的是 socks 代理或者 http 代理，需要在 client 端设置代理的地址，在发起请求时也需要通过代理协议告知代理服务器其需要访问的真实地址。
2. 代理对于 server 是透明的，server 端看到的是 client 端的地址，而不是 proxy 的地址

这么说可能不够直观，通过下面这张图看会比较好，后者为透明代理，可以清晰地看到 client 发出请求的目的 IP 就是目标服务器的 IP：

![20240613024955](https://img.ma5hr00m.top/blog/20240613024955.png)

从上面的描述能看出来，因为透明代理是在网络层面实现的，实现了全局代理的效果，所以无需在每个应用程序中配置，简化了操作，也在一定程度上增强了代理的隐蔽性。

但由于客户端请求数据包的目的地址不是代理服务器，因此需要通过路由和 iptables 规则（Clash 实现，无需用户手动操作）将客户端的请求发送给代理服务器处理。

### redirect

redirect 是另一种实现透明代理的方式。redirect 透明代理主要用于 TCP 流量，是通过修改数据包的目的端口来实现的。这种方法不需要像 tproxy 那样在网络层面进行操作，而是在传输层上实现的。

以下是 Clash 基于 redirect 实现透明代理的过程：

1. 当客户端发起一个 TCP 连接时，iptables 规会捕获到这个连接请求；
2. 根据设置的规则，iptables 会将这个连接的目的端口重定向到 Clash 监听的端口上；
3. Clash 接收到这个连接后，根据内部的规则处理，然后将流量转发到真正的目标服务器。

使用 redirect 的优点是配置相对简单，特别是在不支持 tproxy 的系统上。它可以直接在 iptables 中设置，无需对操作系统的网络栈进行复杂的配置。这使得 redirect 成为一个在简单场景下快速部署透明代理的好选择。