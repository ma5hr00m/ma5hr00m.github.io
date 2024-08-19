# 网络通信中的心跳机制

:::info

一般来说，没有真正动手做过网络通信应用的开发者，很难想象即时通讯应用中的心跳机制的作用。但不可否认，作为即时通讯应用，心跳机制是其网络通信技术底层中非常重要的一环，有没有心跳机制、心跳机制的算法实现好坏，都将直接影响即时通讯应用在应用层的表现——比如：实时性、断网自愈能力、弱网体验等等。

> 来自[一文读懂即时通讯应用中的网络心跳包机制：作用、原理、实现思路等](https://zhuanlan.zhihu.com/p/77182846)

:::

## 实际情景

我们在终端中使用 ssh 连接云服务器进行操作时，经常会碰到这种情景：一段时间不操作，远程终端就会卡死，不响应我们的输入，只能 ctrl+c 强制退出再重新连接。

这是因为 Linux 自身的安全设置，在一段时间内没有使用数据的话就会自动断开与其他主机的 ssh 连接，以节省计算机资源。解决方法就是让本地或者服务器隔一段时间发送一个请求给对方，这种情景很像生物的心跳活动，故这种保持网络通信的机制也就被称为“心跳机制”。

:::info

具体如何解决 ssh 自动断开连接，参考这篇文章：[[SSH]客户端连接一段时间后卡死问题解决](https://zj-network-guide.readthedocs.io/zh-cn/latest/ssh/[SSH]%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%BF%9E%E6%8E%A5%E4%B8%80%E6%AE%B5%E6%97%B6%E9%97%B4%E5%90%8E%E5%8D%A1%E6%AD%BB%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3/)，其实改改设置就行。

:::

再举一个例子：

客户端和服务器往往不是直接相连，中间可能会经过数个路由器和交换机。如果这链路中某个必经的网络设备发生故障，且一段时间内没有恢复，导致连接链路不再畅通，而此时服务器与客户端之间也没有数据进行交换，同时由于 [TCP 连接是状态机](https://www.jianshu.com/p/3c7a0771b67e)，这种情况下，客户端/服务器都无法感知与对方的连接是否正常，这类连接我们一般称之为“死链”。

为了解决“死链”问题，我们可以控制任意一端定时向对方发送一个数据包以检测链路是否畅通。如果长时间没有任何数据来往，可以认为这个连接不存在，我们就可以关闭 Socket 以节约服务器资源。这种操作我们称之为“心跳检测”，而这种用于心跳检测的数据包我们就称之为“心跳包”。

常见心跳检测机制的作用就这两种：保持连接和检测链路连通性。

## TCP 的保活计时器与心跳检测

在开始之前先说清，TCP 的保活机制和心跳检测机制是两码事，二者虽然都是用于维护网络连接的稳定性和可靠性的技术，但它们在实现方式和目的上有所不同，而且分别在传输层和应用层实现，不要将二者混淆。

:::info

推荐阅读：[第23章 TCP的保活定时器](http://docs.52im.net/extend/docs/book/tcpip/vol1/23/)

:::

### 保活计时器 KeepAlive

保活计时器（Keepalive Timer）是在 TCP 协议栈中实现的机制。当 TCP 连接在一定时间内没有任何数据传输时，保活计时器会触发，TCP 层会发送保活探针报文以检测连接的可用性。如果连续发送的保活探针报文均未得到响应，TCP 层会认为连接已经断开，并通知应用层。

发送的探测包是非常小的数据包，它们不携带任何应用层的数据，而是作为一种信号来检测对方是否仍然在线。如果在一定时间内没有收到对方的响应，TCP 层可能会认为连接已经丢失，并采取相应的措施，比如尝试重新建立连接或者关闭连接。

:::tip

如果你看了上面推荐阅读的那篇文章，你会注意到里面有说：

> 许多 TCP/IP 的初学者会很惊奇地发现可以没有任何数据流通过一个空闲的 TCP 连接。也就是说，如果 TCP 连接的双方都没有向对方发送数据，则在两个 TCP 模块之间不交换任何信息。

但上边我们又说：“保活计时器会发送探针报文”，这种报文不被视为数据流吗？

可能有些不准确，但你可以这样理解：心跳检测的探测包确实是一种特殊的数据流，它们用于保持连接的活跃状态，而不是用于传输应用数据。因为这些探测包的目的和普通的数据流是不同的。心跳检测的探测包是为了维护连接的稳定性和可靠性，而不是为了数据交换，它们通常被视为控制信息，而不是应用数据流。

:::

在实际场景中，TCP 保活功能更多是为服务端应用提供，因为很多服务端程序希望知道客户端主机状态，及时得知客户端是否崩溃可以更加合理的利用计算机资源。

> 开启 TCP 保护选项的为服务端，被检测到主机被称为客户端。

当然，两台 TCP 连接的主机可以都使用保活选项，互为对方的服务端。需要注意的是，保活计时器并不是 TCP 标准的必要部分，而是一个可选功能。在某些情况下，频繁的保活探测可能会导致不必要的网络流量和额外的费用。

> 保活并不是 TCP 规范中的一部分。Host Requirements RFC 提供了 3 个不使用保活定时器的理由：（1）在出现短暂差错的情况下，这可能会使一个非常好的连接释放掉；（2）它们耗费不必要的带宽；（3）在按分组计费的情况下会在互联网上花掉更多的钱。

Linux 用户可以自行配置 TCP 的保活计时器。使用 `sysctl` 命令可以查看和设置保活计时器的参数，例如：

```shell
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_probes
```

这些参数的意义如下

- `tcp_keepalive_time`：TCP 发送保活探测前的空闲时间，默认是 2h。
- `tcp_keepalive_intvl`：两个保活探测之间的间隔时间，默认是 75s。
- `tcp_keepalive_probes`：在断开连接前发送的保活探测次数，默认是 9 次。

若要修改这些参数，可以使用sysctl -w命令，如：

```shell
sysctl -w net.ipv4.tcp_keepalive_time=7200
sysctl -w net.ipv4.tcp_keepalive_intvl=75
sysctl -w net.ipv4.tcp_keepalive_probes=9
```

当然也可以直接定位到具体文件去设置参数：

```shell
sudo vim /etc/sysctl.conf
```

::: info

Windows 下的配置比 Linux 会麻烦一些，这里就不再赘述，可以自己去看文档：[Windows TCP 功能说明](https://learn.microsoft.com/zh-cn/troubleshoot/windows-server/networking/description-tcp-features)

:::

## 应用层的心跳机制

上面所说的 TCP KeepAlive 机制比较特殊，它在传输层中实现，不能很好地与应用层程序进行交互，同时也容易造成宽带浪费，这就导致 TCP 保活机制一直饱受争议（但也一直在用）。因此在一般的服务开发中，心跳机制都是在应用层实现的。

### 思路

在技术层面上，心跳包实际上是一个预先定义格式的数据包，在程序中通过启动一个定时器来定时发送。然而，如果通信双方有频繁的数据交互，单纯按照固定时间发送心跳包可能会导致流量浪费。

为了避免不必要的流量浪费，最佳做法是根据实际情况动态调整心跳包的发送频率。具体而言，可以通过在通信过程中记录上次数据包发送的时间，并在每次数据交互时更新这个时间戳。同时，设置一个心跳检测计时器，定期检查上次数据包发送时间与当前系统时间的间隔。只有当两端之间没有数据交互达到一定时间间隔时，才发送一次心跳包。

这种动态调整的心跳包机制可以有效减少不必要的心跳包发送，只在必要时才发送，从而避免了流量浪费的问题。通常，根据具体需求，可以设置心跳包发送的时间间隔在 15 到 45 秒之间，以确保及时检测通信状态而又不至于频繁发送心跳包。这样就可以在保持通信稳定的同时，有效地管理心跳包的发送，避免不必要的网络流量消耗。

### 代码实现

正好手上有两台公网服务器，可以拿来做实验。替换 IP 地址和对应端口后就可以编译扔到两台服务器上运行：

```go {13}
// server.go
package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"time"
)

const (
	port         = "localhost:12345"
	heartbeatMsg = "HEARTBEAT"
)

func main() {
	logFile, err := os.OpenFile("logs.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Error opening log file:", err)
	}
	defer logFile.Close()

	logger := log.New(logFile, "SERVER: ", log.Ldate|log.Ltime|log.Lshortfile)
	logger.Println("Server starting...")

	listener, err := net.Listen("tcp", port)
	if err != nil {
		logger.Fatal("Error listening:", err)
	}
	defer listener.Close()

	logger.Println("Listening on" + port)
	for {
		conn, err := listener.Accept()
		if err != nil {
			logger.Println("Error accepting:", err.Error())
			continue
		}
		go handleRequest(conn, logger)
	}
}

func handleRequest(conn net.Conn, logger *log.Logger) {
	defer conn.Close()

	for {
		buffer := make([]byte, 1024)
		n, err := conn.Read(buffer)
		if err != nil {
			logger.Println("Error reading:", err.Error())
			break
		}

		if string(buffer[:n]) == heartbeatMsg {
			continue
		}

		logger.Printf("Received data: %s\n", string(buffer[:n]))
		_, err = conn.Write(buffer[:n])
		if err != nil {
			logger.Println("Error sending response:", err.Error())
			break
		}
	}
}

```



```go {13}
// client.go
package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"time"
)

const (
	serverAddr   = "localhost:12345"
	heartbeatMsg = "HEARTBEAT"
	timeout      = 5 * time.Second
)

func main() {
	logFile, err := os.OpenFile("logs.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Error opening log file:", err)
	}
	defer logFile.Close()

	logger := log.New(logFile, "CLIENT: ", log.Ldate|log.Ltime|log.Lshortfile)
	logger.Println("Client starting...")

	conn, err := net.Dial("tcp", serverAddr)
	if err != nil {
		logger.Fatal("Error connecting:", err)
	}
	defer conn.Close()

	lastDataTime := time.Now()

	for {
		if time.Since(lastDataTime) >= timeout {
			_, err := conn.Write([]byte(heartbeatMsg))
			if err != nil {
				logger.Println("Error sending heartbeat:", err.Error())
				return
			}
			logger.Println("Heartbeat sent")
			lastDataTime = time.Now()
		}

		buffer := make([]byte, 1024)
		n, err := conn.Read(buffer)
		if err != nil {
			logger.Println("Error receiving data:", err.Error())
			return
		}

		if string(buffer[:n]) == heartbeatMsg {
			continue
		}

		logger.Printf("Received data: %s\n", string(buffer[:n]))
		lastDataTime = time.Now()
	}
}

```

实现的很简陋，而且单独一个模拟心跳机制的程序没什么用，需要将其放到具体场景中。比如我们使用 frp 一类的工具进行内网穿透时，就需要做心跳机制以维持连接的稳定，毕竟谁也不想打进内网之后一会儿断一会儿断的。

具体使用可以戳这篇博客：[FRP工作原理及代码实现](https://ma5hr00m.top/archives/2024/05/how-frp-work.html)。