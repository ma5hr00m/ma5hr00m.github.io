# FRP v0.1.0 源码阅读

frp 是一款专注于内网穿透的、高性能的反向代理工具，做 Web 安全以及网络开发时常用。就算你没接触过这些领域，室友开黑打游戏时，也可能会使用 [Sakura FRP](https://www.natfrp.com/) 做内网穿透实现局域网联机。

## v0.1.0 版本

v0.1.0 版本的代码量很小，核心功能代码就 1079 行，项目结构也很简单，适合上手。

```bash
PROJECT:
└─frp
    ├─conf
    ├─Godeps       
    └─src
        └─frp
            ├─cmd
            │  ├─frpc
            │  └─frps
            ├─models
            │  ├─client | 客户端配置信息 & 
            │  ├─consts
            │  ├─msg | 定义请求/响应信息的结构体
            │  └─server | 服务端配置信息 & 处理代理服务器的函数
            └─utils
                ├─broadcast | 
                ├─conn | 设置本地监听器 & 获取/发起连接的函数
                ├─log | 日志处理
                └─pcrypto
```

在开始之前，先了解 Godeps，一个旧时代的包依赖管理工具，原理是扫描记录版本控制的信息，并在 go 命令前加壳以实现依赖管理。不过后来逐渐被大家更为熟知的 `go mod` 取代了，其 GitHub 仓库也被 archive 了。

项目中使用该工具管理 Go 依赖库时，会在项目中生成 `/Godeps/Godeps.json` 配置文件。这里就不在解释了，自己看看就可以：

```bash
{
	"ImportPath": "frp",
	"GoVersion": "go1.4",
	"Packages": [
		"./..."
	],
	"Deps": [
		{
			"ImportPath": "github.com/astaxie/beego/logs",
			"Comment": "v1.5.0-9-gfb7314f",
			"Rev": "fb7314f8ac86b83ccd34386518d97cf2363e2ae5"
		},
		{
			"ImportPath": "github.com/vaughan0/go-ini",
			"Rev": "a98ad7ee00ec53921f08832bc06ecf7fd600e6a1"
		}
	]
}
```

frp 分客户端（frpc）和服务端（frps），使用时是先建立服务端再建立客户端，就按照这个顺序。

### frps

对应的配置文件如下：

```ini
[common]
bind_addr = 0.0.0.0
bind_port = 7000
log_file = ./frps.log
# debug, info, warn, error
log_level = debug
# file, console
log_way = console 

[test1]
passwd = 123
bind_addr = 0.0.0.0
listen_port = 6000
```

先看项目入口文件，位置是 `src/frp/cmd/frps/main.go`：

```go
func main() {
	err := server.LoadConf("./frps.ini")
	// ... ...
	
	log.InitLog(server.LogWay, server.LogFile, server.LogLevel)
	
	l, err := conn.Listen(server.BindAddr, server.BindPort)
	// ... ...
	
	log.Info("Start frps success")
	ProcessControlConn(l)
}
```

调用 `src/frp/models/server/config.go` 中的 `LoadConf` 方法加载配置文件；初始化日志记录，使用 server 包中定义的日志记录方式、日志文件和日志级别；建立连接；在前面无误的情况下打印 success 信息；最后调用 `ProcessControlConn` 函数，处理控制连接。

然后看 `src/frp/models/server/config.go`。

这个文件的功能就是使用 `github.com/vaughan0/go-ini` 库将配置文件信息映射为结构体，方便后续使用。配置文件可分为两部分，`[common]` 通用信息和代理服务器信息列表，其中 `[common]` 如果没在配置文件中指定，就是用该文件开头指定的默认值。其他配置信息都被当做代理服务器信息循环读取，文件开头初始化了一个 `ProxyServers`  映射，用于存储代理服务器的配置：

```go
var ProxyServers map[string]*ProxyServer = make(map[string]*ProxyServer)

func LoadConf(confFile string) (err error) {
	// ... ...
	for name, section := range conf {
		if name != "common" {
			proxyServer := &ProxyServer{}
			proxyServer.Name = name

			proxyServer.Passwd, ok = section["passwd"]
			if !ok {
				return fmt.Errorf("Parse ini file error: proxy [%s] no passwd found", proxyServer.Name)
			}

			proxyServer.BindAddr, ok = section["bind_addr"]
			if !ok {
				proxyServer.BindAddr = "0.0.0.0"
			}

			portStr, ok := section["listen_port"]
			if ok {
				proxyServer.ListenPort, err = strconv.ParseInt(portStr, 10, 64)
				if err != nil {
					return fmt.Errorf("Parse ini file error: proxy [%s] listen_port error", proxyServer.Name)
				}
			} else {
				return fmt.Errorf("Parse ini file error: proxy [%s] listen_port not found", proxyServer.Name)
			}

			proxyServer.Init()
			ProxyServers[proxyServer.Name] = proxyServer
		}
	}
	// 要求至少有一个代理服务器配置选项，如果没有就提示解析错误
	if len(ProxyServers) == 0 {
		return fmt.Errorf("Parse ini file error: no proxy config found")
	}
	// ... ...
}
```

日志部分使用的是 `github.com/astaxie/beego/logs` 三方库。可以不细看，日志部分所需的配置信息由上面所说的配置文件指定的。

再看 `src/frp/utils/conn/conn.go`，这部分功能是实现服务端与客户端的连接。

文件开头定义了一个 `Listener` 结构体，用于存储 TCP 监听器的地址、监听器对象、连接通道和关闭标志。

```go
type Listener struct {
	addr      net.Addr
	l         *net.TCPListener
	conns     chan *Conn
	closeFlag bool
}
```

`Listen` 函数用于在指定端口启动一个 TCP 监听器，接受绑定的地址和端口号作为参数（配置文件中指定），并返回一个 `Listener` 对象。

```go
func Listen(bindAddr string, bindPort int64) (l *Listener, err error) {
	// 解析TCP地址，指定 tcp4
	tcpAddr, err := net.ResolveTCPAddr("tcp4", fmt.Sprintf("%s:%d", bindAddr, bindPort))
	if err != nil {
		return l, err
	}

	// 在解析的TCP地址上开始监听
	listener, err := net.ListenTCP("tcp", tcpAddr)
	if err != nil {
		return l, err
	}

	// 使用监听器的地址、监听器对象、连接通道和关闭标志初始化 Listener 结构体
	l = &Listener{
		addr:      listener.Addr(),
		l:         listener,
		conns:     make(chan *Conn),
		closeFlag: false,
	}

	// 启动一个协程来接受新的连接
	go func() {
		for {
			// 接受新的TCP连接
			conn, err := l.l.AcceptTCP()
			if err != nil {
				// 如果监听器已经关闭，则返回结束协程
				if l.closeFlag {
					return
				}
				// 如果是其他错误，则忽略并继续等待新的连接
				continue
			}

			// 为每个接受的连接创建一个 Conn 实例，并将其发送到 Listener 的连接通道中
			c := &Conn{
				TcpConn:   conn,
				closeFlag: false,
			}
			c.Reader = bufio.NewReader(c.TcpConn)
			l.conns <- c
		}
	}()
	return l, err
}
```

返回的 `Listener` 是一个准备好接受连接的结构体。这个结构体包含了一个通道（`conns`），用于接收和存储新的连接。在 `Listen` 函数内部，有一个协程不断地接受新的连接并将它们放入这个通道。

我们的目光再返回主函数。主函数建立好上文说的这个 `l` 后，就认为 frp 已经成功启动了，然后将这个 `l` 传递给控制模块进行管理，控制模块主体在 `src/frp/cmd/frps/control.go` 中。

`ProcessControlConn` 函数启动一个无限循环，调用 `l.GetConn()` 方法尝试从监听器获取一个新的连接对象 `c` ：如果成功获取到新的连接，它将为每个新的连接启动一个新的协程 `controlWorker(c)`，这个协程将独立处理每个连接的控制逻辑；如果 `l.GetConn()` 返回错误，函数将停止运行。

这里的连接对象 `c` 在项目的 `utils/conn` 中定义：

```go
type Conn struct {
	TcpConn   *net.TCPConn
	Reader    *bufio.Reader
	closeFlag bool
}
```

`Conn` 结构体是一个自定义的数据类型，用于封装 TCP 连接及其相关操作：

- `TcpConn`：指向 `net.TCPConn` 的指针，它代表了底层的 TCP 连接。通过这个字段，可以访问和控制 TCP 网络连接的各种属性和方法，如发送和接收数据。
- `Reader`：指向 `bufio.Reader` 的指针，它提供了一个缓冲区，可以更高效地读取数据。这个读取器封装了 `TcpConn`，使得可以方便地进行如按行读取文本等操作。
- `closeFlag`：布尔值，用于指示连接是否已经被关闭。如果为 `true`，则表示连接已经关闭，不应再进行读写操作。

然后再看用于处理连接的函数 `controlWorker(c)`，其中有两个较为关键的函数，均在注释中标注了 `★`：

```go
func controlWorker(c *conn.Conn) {
	// 首条消息是从客户端发往服务器的，如果出错则关闭连接。
	res, err := c.ReadLine()
	if err != nil {
		log.Warn("Read error, %v", err)
		return
	}

	// 读取成功则继续调试信息，打印返回的消息
	log.Debug("get: %s", res)

	// 将读取到的信息反序列化为 ClientCtlReq 结构体
	clientCtlReq := &msg.ClientCtlReq{}
	clientCtlRes := &msg.ClientCtlRes{}
	if err := json.Unmarshal([]byte(res), &clientCtlReq); err != nil {
		log.Warn("Parse err: %v : %s", err, res)
		return
	}
	
	// ★ 检查代理配置是否正确
	succ, info, needRes := checkProxy(clientCtlReq, c)
	if !succ {
		clientCtlRes.Code = 1
		clientCtlRes.Msg = info
	}

	if needRes {
		// 如果需要响应客户端，则在函数结束前关闭连接
		defer c.Close()
		
		// 将响应消息序列化并写入连接
		buf, _ := json.Marshal(clientCtlRes)
		err = c.Write(string(buf) + "\\n")
		if err != nil {
			log.Warn("Write error, %v", err)
			time.Sleep(1 * time.Second)
			return
		}
	} else {
		return
	}
	
	// 检查代理连接是否存在
	s, ok := server.ProxyServers[clientCtlReq.ProxyName]
	if !ok {
		log.Warn("ProxyName [%s] is not exist", clientCtlReq.ProxyName)
		return
	}
	
	// ★ 启动一个新的协程，用于读取客户端发送的控制信息
	go readControlMsgFromClient(s, c)

	// 创建一个新的 ClientCtlReq 结构体，并设置类型为工作连接
	serverCtlReq := &msg.ClientCtlReq{}
	serverCtlReq.Type = consts.WorkConn
	// 进入一个循环，等待用户连接，如果代理服务器关闭，记录调试信息并退出循环
	for {
		closeFlag := s.WaitUserConn()
		if closeFlag {
			log.Debug("ProxyName [%s], goroutine for dealing user conn is closed", s.Name)
			break
		}
		// 序列化服务器控制请求并写入连接。如果写入失败，记录警告，关闭代理服务器并返回
		buf, _ := json.Marshal(serverCtlReq)
		err = c.Write(string(buf) + "\\n")
		if err != nil {
			log.Warn("ProxyName [%s], write to client error, proxy exit", s.Name)
			s.Close()
			return
		}

		log.Debug("ProxyName [%s], write to client to add work conn success", s.Name)
	}

	log.Info("ProxyName [%s], I'm dead!", s.Name)
	return
}
```



`checkProxy` 函数首先检验代理是否合法，然后通过检查 `req.Type` 的值来区分控制连接和工作连接。

```Go
func checkProxy(req *msg.ClientCtlReq, c *conn.Conn) (succ bool, info string, needRes bool) {
	succ = false    // 默认设置成功标志为 false
	needRes = true  // 默认需要向客户端发送响应

	// 检查代理名称是否存在
	s, ok := server.ProxyServers[req.ProxyName]
	if !ok {
		info = fmt.Sprintf("ProxyName [%s] is not exist", req.ProxyName)
		log.Warn(info)
		return
	}

	// 检查密码是否正确
	if req.Passwd != s.Passwd {
		info = fmt.Sprintf("ProxyName [%s], password is not correct", req.ProxyName)
		log.Warn(info)
		return
	}

	// 根据请求类型处理控制连接或工作连接
	if req.Type == consts.CtlConn {
		// 如果是控制连接
		if s.Status != consts.Idle {
            // 如果代理已经在使用中，设置错误信息
			info = fmt.Sprintf("ProxyName [%s], already in use", req.ProxyName)
			log.Warn(info)
			return
		}

		// 启动代理并监听用户连接，此操作不会阻塞
		err := s.Start()
		if err != nil {
			info = fmt.Sprintf("ProxyName [%s], start proxy error: %v", req.ProxyName, err.Error())
			log.Warn(info)
			return
		}

		log.Info("ProxyName [%s], start proxy success", req.ProxyName)
	} else if req.Type == consts.WorkConn {
		// 如果是工作连接，则不需要向客户端发送响应
		needRes = false
		if s.Status != consts.Working {
			log.Warn("ProxyName [%s], is not working when it gets one new work conn", req.ProxyName)
			return
		}

		s.GetNewCliConn(c) // 获取新的客户端连接
	} else {
		info = fmt.Sprintf("ProxyName [%s], type [%d] unsupport", req.ProxyName, req.Type)
		log.Warn(info)
		return
	}

    // 如果所有检查都通过，则设置成功标志为 true
	succ = true
	return
}

```

其中控制连接主要用于设置和维护工作连接，以及进行心跳检测来确保客户端仍然活跃。

控制连接是客户端与服务器之间的初始连接，用于管理和控制代理的状态。在控制连接中，客户端会发送一个包含代理名称和密码的请求，服务器会验证这些信息，如果验证成功，服务器就会根据请求的类型来启动代理或处理其他控制消息。

而工作连接是在控制连接建立后由客户端发起的，用于实际的数据传输。工作连接允许用户数据通过代理服务器转发，实现客户端和服务端之间的通信。

`readControlMsgFromClient` 函数用于读取客户端发送的控制信息 ，它接受一个代理服务器和连接作为参数，用于读取客户端发送的控制消息，包括对心跳信息的处理，用于保持客户端和服务端的连接。

```go
func readControlMsgFromClient(s *server.ProxyServer, c *conn.Conn) {
	// 用于控制循环读取消息的条件
	isContinueRead := true
	
	// 用于处理心跳超时的情况，超时则关闭服务器连接
	f := func() {
		isContinueRead = false
		s.Close()
		log.Error("ProxyName [%s], client heartbeat timeout", s.Name)
	}
	
	// 创建一个定时器 timer，在 HeartBeatTimeout 时间后执行函数 f
	timer := time.AfterFunc(time.Duration(server.HeartBeatTimeout)*time.Second, f)
	// defer 语句保证在函数结束时停止定时器。
	defer timer.Stop()

	// 循环读取客户端发送的消息，连接超时则跳出循环
	for isContinueRead {
		// 从连接 c 中读取一行消息，存储在 content 中
		content, err := c.ReadLine()
		if err != nil {
			if err == io.EOF {
				log.Warn("ProxyName [%s], client is dead!", s.Name)
				s.Close()
				break
			} else if nil == c || c.IsClosed() {
				log.Warn("ProxyName [%s], client connection is closed", s.Name)
				break
			}

			log.Error("ProxyName [%s], read error: %v", s.Name, err)
			continue
		}

		// 创建一个指针，存储解析后的客户端控制请求消息
		clientCtlReq := &msg.ClientCtlReq{}
		// 将 content 解析为 msg.ClientCtlReq 结构体，并将解析结果存储在 clientCtlReq 中
		if err := json.Unmarshal([]byte(content), clientCtlReq); err != nil {
			log.Warn("Parse err: %v : %s", err, content)
			continue
		}
		// 判断消息是否为心跳请求
		if consts.CSHeartBeatReq == clientCtlReq.Type {
			log.Debug("ProxyName [%s], get heartbeat", s.Name)
			// 重置定时器，延长心跳超时时间，确保客户端保持活跃
			timer.Reset(time.Duration(server.HeartBeatTimeout) * time.Second)
			clientCtlRes := &msg.ClientCtlRes{}
			// 设置心跳响应消息的响应码为 consts.SCHeartBeatRes，然后将响应序列化为 JSON 格式字符串
			clientCtlRes.GeneralRes.Code = consts.SCHeartBeatRes
			response, err := json.Marshal(clientCtlRes)
			if err != nil {
				log.Warn("Serialize ClientCtlRes err! err: %v", err)
				continue
			}

			err = c.Write(string(response) + "\\n")
			if err != nil {
				log.Error("Send heartbeat response to client failed! Err:%v", err)
				continue
			}
		}
	}
}
```

### frpc

`ini` 配置文件如下：

```ini
[common]
server_addr = 127.0.0.1
server_port = 7000
log_file = ./frpc.log
# debug, info, warn, error
log_level = debug
# file, console
log_way = console

[test1]
passwd = 123
local_port = 22
```

同样是入口文件开始，位置是 `src/frp/cmd/frpc/main.go`：

```go
func main() {
	err := client.LoadConf("./frpc.ini")
	if err != nil {
		os.Exit(-1)
	}

	log.InitLog(client.LogWay, client.LogFile, client.LogLevel)

	// 等待所有控制协程退出，实际上是在声明将会有 len(client.ProxyClients) 数量的协程
	var wait sync.WaitGroup
	wait.Add(len(client.ProxyClients))

    // 遍历所有代理客户端，并为每个客户端启动一个控制协程
	for _, client := range client.ProxyClients {
		go ControlProcess(client, &wait)
	}

	log.Info("Start frpc success")

    // 等待所有控制协程退出
	wait.Wait()
	log.Warn("All proxy exit!")
}
```

加载配置文件和日志初始化都讲过了，不再赘述。将目光移至 `src/frp/cmd/frpc/control.go`，看看用于处理客户端的 `ControlProcess()`。其中关键函数是用于连接服务端的 `loginToServer` 函数。

```go
func ControlProcess(cli *client.ProxyClient, wait *sync.WaitGroup) {
    // 延迟 wait.Done() 的执行直到 ControlProcess( )函数即将返回
    // 这是通知 sync.WaitGroup 当前协程已经完成的标准方式
	defer wait.Done()

    // ★ 尝试登录到服务器，如果成功，返回一个连接对象
	c, err := loginToServer(cli)
	if err != nil {
		log.Error("ProxyName [%s], connect to server failed!", cli.Name)
		return
	}
	connection = c
    // 确保函数结束时关闭网络连接
	defer connection.Close()

    // 无限循环并从服务器读取数据
	for {
		content, err := connection.ReadLine()
        // 遇到 io.EOF 或连接被关闭，尝试重新连接服务器
		if err == io.EOF || nil == connection || connection.IsClosed() {
			log.Debug("ProxyName [%s], server close this control conn", cli.Name)
			
            // 使用指数退避策略来重连服务器，每次失败后等待时间翻倍，直到最大 60 秒
            var sleepTime time.Duration = 1
			for {
				log.Debug("ProxyName [%s], try to reconnect to server[%s:%d]...", cli.Name, client.ServerAddr, client.ServerPort)
				tmpConn, err := loginToServer(cli)
				if err == nil {
					connection.Close()
					connection = tmpConn
					break
				}

				if sleepTime < 60 {
					sleepTime = sleepTime * 2
				}
				time.Sleep(sleepTime * time.Second)
			}
			continue
		} else if err != nil {
			log.Warn("ProxyName [%s], read from server error, %v", cli.Name, err)
			continue
		}

        // 尝试解析服务器返回的内容为 ClientCtlRes 结构体
		clientCtlRes := &msg.ClientCtlRes{}
		if err := json.Unmarshal([]byte(content), clientCtlRes); err != nil {
			log.Warn("Parse err: %v : %s", err, content)
			continue
		}
        
        // 检查是否收到心跳响应，如果是，则重置心跳计时器
		if consts.SCHeartBeatRes == clientCtlRes.GeneralRes.Code {
			if heartBeatTimer != nil {
				log.Debug("Client rcv heartbeat response")
				heartBeatTimer.Reset(time.Duration(client.HeartBeatTimeout) * time.Second)
			} else {
				log.Error("heartBeatTimer is nil")
			}
			continue
		}

        // ★ 如果收到的不是心跳响应，则尝试启动隧道
		cli.StartTunnel(client.ServerAddr, client.ServerPort)
	}
}
```

接下来是 `loginToServer` 函数，核心函数有两个，分别是用于连接到指定地址端口的 `ConnectServer` 和用于启动心跳检测的 `startHeartBeat` 函数：

```go
func loginToServer(cli *client.ProxyClient) (c *conn.Conn, err error) {
	// ★ 建立连接，返回一个连接对象
    c, err = conn.ConnectServer(client.ServerAddr, client.ServerPort)
	if err != nil {
		log.Error("ProxyName [%s], connect to server [%s:%d] error, %v", cli.Name, client.ServerAddr, client.ServerPort, err)
		return
	}
	
    // 创建一个 ClientCtlReq 结构体，指定请求类型 CtlConn，表示这是一个控制连接请求
	req := &msg.ClientCtlReq{
		Type:      consts.CtlConn,
		ProxyName: cli.Name,
		Passwd:    cli.Passwd,
	}
    // 序列化为 JSON 并发送请求
	buf, _ := json.Marshal(req)
	err = c.Write(string(buf) + "\n")
	if err != nil {
		log.Error("ProxyName [%s], write to server error, %v", cli.Name, err)
		return
	}

    // 读取响应
	res, err := c.ReadLine()
	if err != nil {
		log.Error("ProxyName [%s], read from server error, %v", cli.Name, err)
		return
	}
	log.Debug("ProxyName [%s], read [%s]", cli.Name, res)

    // 将响应的内容解析为 ClientCtlRes 结构体
	clientCtlRes := &msg.ClientCtlRes{}
	if err = json.Unmarshal([]byte(res), &clientCtlRes); err != nil {
		log.Error("ProxyName [%s], format server response error, %v", cli.Name, err)
		return
	}

    // 检查响应代码
	if clientCtlRes.Code != 0 {
		log.Error("ProxyName [%s], start proxy error, %s", cli.Name, clientCtlRes.Msg)
		return c, fmt.Errorf("%s", clientCtlRes.Msg)
	}

    // ★ 启动心跳
	go startHeartBeat(c)
	log.Debug("ProxyName [%s], connect to server[%s:%d] success!", cli.Name, client.ServerAddr, client.ServerPort)

	return
}
```

先看实现连接的`ConnectServer` 函数，位于 `utils/conn`。这个函数实际上是对普通 TCP 连接的封装：

```go
type Conn struct {
	TcpConn   *net.TCPConn
	Reader    *bufio.Reader
	closeFlag bool
}

func ConnectServer(host string, port int64) (c *Conn, err error) {
	c = &Conn{}
    // 使用 net.ResolveTCPAddr 解析 TCP 地址
	servertAddr, err := net.ResolveTCPAddr("tcp4", fmt.Sprintf("%s:%d", host, port))
	if err != nil {
		return
	}
    // 建立到服务器的 TCP 连接
	conn, err := net.DialTCP("tcp", nil, servertAddr)
	if err != nil {
		return
	}
    // 将建立的 TCP 连接赋给 Conn 结构体的 TcpConn 字段
	c.TcpConn = conn
    // 创建一个新的缓冲读取器，并赋给 Conn 的 Reader 字段
	c.Reader = bufio.NewReader(c.TcpConn)
    // 表示连接目前是打开的
	c.closeFlag = false
	return c, nil
}

// 同文件中用于操作 Conn 结构体的函数此处不再展示
// 还有一个用于实现隧道通信的 Join 函数，稍后会说
```

然后看 `startHeartBeat` 函数，该函数用于发起心跳包维持客户端与服务端的连接：

```go
func startHeartBeat(c *conn.Conn) {
    // 心跳超时则关闭连接
	f := func() {
		log.Error("HeartBeat timeout!")
		if c != nil {
			c.Close()
		}
	}
    
   	// 创建一个计时器，在指定的心跳超时时间后执行函数f
	heartBeatTimer = time.AfterFunc(time.Duration(client.HeartBeatTimeout)*time.Second, f)
	// 确保在函数退出前停止计时器
    defer heartBeatTimer.Stop()

	clientCtlReq := &msg.ClientCtlReq{
		Type:      consts.CSHeartBeatReq,
		ProxyName: "",
		Passwd:    "",
	}
    
    // 将心跳请求序列化为JSON格式
	request, err := json.Marshal(clientCtlReq)
	if err != nil {
		log.Warn("Serialize clientCtlReq err! Err: %v", err)
	}

    // 进入一个无限循环，每次循环开始时都会休眠一段时间，这个时间由心跳间隔决定
	log.Debug("Start to send heartbeat")
	for {
		time.Sleep(time.Duration(client.HeartBeatInterval) * time.Second)
		if c != nil && !c.IsClosed() {
			err = c.Write(string(request) + "\n")
			if err != nil {
				log.Error("Send hearbeat to server failed! Err:%v", err)
				continue
			}
		} else {
			break
		}
	}
	log.Debug("Heartbeat exit")
}
```

现在，我们实现了客户端与服务端的连接，并在连接后依靠心跳机制实现了维持通信，下一步就是建立隧道，实现通信功能。视角转到 `utils/conn` 的 `StartTunnel` 函数：

```go
func (p *ProxyClient) StartTunnel(serverAddr string, serverPort int64) (err error) {
	// 建立到本地服务的连接
    localConn, err := p.GetLocalConn()
	if err != nil {
		return
	}
	// ★ 建立到服务端的连接
    remoteConn, err := p.GetRemoteConn(serverAddr, serverPort)
	if err != nil {
		return
	}

	// l means local, r means remote
	log.Debug("Join two conns, (l[%s] r[%s]) (l[%s] r[%s])", localConn.GetLocalAddr(), localConn.GetRemoteAddr(),
		remoteConn.GetLocalAddr(), remoteConn.GetRemoteAddr())
    // ★ 创建协程将本地连接和远程连接“连接”起来，使得数据可以在两者之间传输
	go conn.Join(localConn, remoteConn)
	return nil
}
```

建立到本地服务的连接没什么好说的，获取配置文件中的本地端口做个调用即可。着重看下 `GetRemoteConn` 函数：

```go
func (p *ProxyClient) GetRemoteConn(addr string, port int64) (c *conn.Conn, err error) {
    // 使用 defer 关键字来确保在函数返回前关闭连接
	defer func() {
		if err != nil {
			c.Close()
		}
	}()

	c, err = conn.ConnectServer(addr, port)
	if err != nil {
		log.Error("ProxyName [%s], connect to server [%s:%d] error, %v", p.Name, addr, port, err)
		return
	}

    // 构造一个客户端控制请求消息，声明为工作连接
	req := &msg.ClientCtlReq{
		Type:      consts.WorkConn,
		ProxyName: p.Name,
		Passwd:    p.Passwd,
	}

    // 将请求序列化为 JSON 格式并发送
	buf, _ := json.Marshal(req)
	err = c.Write(string(buf) + "\n")
	if err != nil {
		log.Error("ProxyName [%s], write to server error, %v", p.Name, err)
		return
	}

	err = nil
	return
}
```

最后我们再转到 `Join` 函数，这个函数是搭建隧道的关键，本质上就是实现两个连接之间的双向数据传输：

```go
func Join(c1 *Conn, c2 *Conn) {
    // 等待两个数据传输协程的完成
	var wait sync.WaitGroup
    // 从一个连接读取数据并写入到另一个连接
    // defer 用于确保在函数结束时关闭连接并通知 WaitGroup 协程已完成
	pipe := func(to *Conn, from *Conn) {
		defer to.Close()
		defer from.Close()
		defer wait.Done()

		var err error
        // 使用 io.Copy 函数将数据从一个连接复制到另一个连接
        // 这个操作会持续进行，直到遇到错误或者EOF（文件结束标志
		_, err = io.Copy(to.TcpConn, from.TcpConn)
		if err != nil {
			log.Warn("join conns error, %v", err)
		}
	}

	wait.Add(2)
    // 启动两个协程，分别处理从 c1 到 c2 和从 c2 到 c1 的数据传输
	go pipe(c1, c2)
	go pipe(c2, c1)
	wait.Wait()
	return
}
```

## 后话

Ok，至此，frp v0.1.0 的源码就分析的差不多了，虽说有点老（接近 10 年前），但对理解内网穿透的实现原理也是很有帮助的。之后的版本中虽然做了很多改进，但整体实现思路其实没有太大变化。

虽说不是第一次试着去阅读某个工具的源码，但边学边写博文还是第一次，可能略有混乱，但感觉也还好？唯一的问题是不适合把一段代码拆开，以 frpc 的 `controlWorker` 举例，里面先后使用了两个重要函数，一般这种情况下，我会按照代码执行逻辑先跳转到对应函数看看这个函数做了什么，看完之后再。但写文章的时候拆开整个函数，先贴前半部分，中间再塞调用的函数，然后再贴后半段函数，就感觉很怪，所以在这篇文章里，我就直接先介绍整个函数，标注其中调用的重要函数，然后在之后单独介绍。

然后通篇写下来，想要吐槽的是 Golang 的错误处理机制，不论是阅读的时候还是写文章的时候都感到略有麻烦。就是那种，大家都知道按照 Golang 的风格会在操作跟一个错误处理，控制日志模块输出些信息，多数情况下对核心功能的实现没什么帮助，但你又不好省略，因为就多出两三行，贴代码的时候用 `// ... ...` 代替效果也有限，但直接省去不写也感觉很不对。就比较难受。

别的都还好。

我能找到的还有一篇 FRP v0.5.0 源码阅读的文章，感兴趣的可以跳过去看看，也挺不错的：

https://www.joxrays.com/frp-source-code/