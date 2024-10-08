# 面向新生的Linux教程

::: tip
2023 年 ***Vidar-Team*** 第四次新生培训 Linux 部分内容讲解。
:::

## 什么是操作系统
### 概念
大家都知道计算机硬件和软件。硬件就是我们计算机的物理组成部分，比如内存、硬盘、键盘，都是些电子元件；软件就是大家常用的浏览器、游戏这些。
你单独使用硬件或软件都很难正常工作。想让计算机正常工作，就需要硬件和软件相互配合。而负责中间这个过程的，就是操作系统。

操作系统（Operating System），也就是我们说的 OS，本质上就是一组相互关联的软件程序。
操作系统是计算机最底层的软件，负责管理计算机的硬件和软件资源，控制着计算机的运行。

我们平常使用的应用程序，包括 vscode、firefox 这样的软件应用，以及我们写的 C 语言程序、Python 脚本什么的，都需要以操作系统为基本支撑。没有操作系统，这些应用程序就都无法正常运行。

### 组成
如下图所示，操作系统可以简单划分为内核和系统调用两部分：

![操作系统抽象划分](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231013143007.png)

- 内核：内核是操作系统的核心，它负责管理计算机的硬件资源，如CPU、内存、磁盘、网络等。内核可以基于权限和规则对资源访问进行裁决，保证系统的安全性和稳定性。内核运行在特权模式下，可以直接访问硬件设备和指令。
- 系统调用：系统调用是用户进程进入内核的接口层，它是由内核函数实现的。通过系统调用，用户进程可以临时切换到内核模式，使用内核提供的服务和功能，如文件操作、进程管理、网络通信等。系统调用对资源进行抽象，提供一致性接口，避免用户在使用资源时发生错误，且编程效率大大提高。

一些系统组件运行在应用程序层，比如我们经常使用的 shell、图形界面等，它们也是操作系统的一部分。


## Linux
Linux 是一个操作系统。它由 *Linus* 于 1991 年构思设计而成。最初这只是他的一项兴趣爱好。
现如今，经过多年的发展，这项兴趣爱好已经成为了拥有最大用户群的操作系统。

![Linux Logo](https://pakhotin.org/wp-content/uploads/2023/07/53113-106400-Linux-xl.jpg)

在座的大多数人都在使用 Windows 操作系统，Windwos 足够满足大家的日常学习生活，比如写代码、玩游戏、看视频。
那我们今天为什么要来介绍 Linux 呢？

原因很简单。如果你未来要踏足计算机领域，不管你是要学习计算机安全，还是要做些其他的什么方向，你都会有茫茫多的场景需要接触到 Linux，你没法避开它。
不论你是否会把 Linux 当作主力操作系统，你都有必要学会使用它。

## Linux 的优势
现在来说说我们为什么要使用 Linux。

Linux 自带强大的命令行工具，可以完成各种工作，比如文件操作、网络通信、进程管理等，而不需要使用图形化界面。
以前有很多设置你可能需要在 windows 的系统设置里面翻来翻去，而在 Linux 下，你只需要打开命令行，敲一些指令就行。

此外，相比 Windows 系统，Linux 可以做到更加高效，更加安全，更加稳定，以及更小的损耗。
这些优势使得 Linux 在服务器领域占据了大量份额，对运维来说，熟练使用 Linux 是必备技能。

同时，Linux 还是一款开源的操作系统，每个人都可以下载其源代码进行定制。
这使得 Linux 有着强大的生命力，可以适应各种场景的需求，也促生了 Linux 活跃的社区生态。

现阶段，对大家来说，使用 Linux 最大的好处就是可以快速地搭建各种环境。

比如，你现在想要在 Windows 系统中配置一个基本的 Java 开发环境（[教程](https://www.runoob.com/java/java-environment-setup.html)），
你需要先去 Java 官网下载 JDK，然后安装，接着配置 `JAVA_HOME` 等环境变量，这样才能开始写代码。一些没有经验的新生就会在这里消耗大量时间。
而在 Linux 下你不需要这么麻烦，多数情况下，你只需要使用一行类似的命令就可以完成上述工作：
```bash
sudo apt install openjdk-17-jdk
```

当这句指令执行成功后，你就可以开始写代码了。非常轻松愉快，也节省了很多时间，让你专注于 Java 语言本身，而非繁琐的环境配置。

## 发行版
Linux 操作系统分为很多种，这些不同的 Linux 统称为 Linux 发行版（*Linux distribution*）。

这些发行版都是基于 Linux 内核的，它们之间的差异主要体现在软件包管理工具、软件包源、软件包版本等方面，我们一会儿会做详细讲解。

大家可以看这张图，这张图展示了一些常见的 Linux 发行版：

![常见Linux发行版](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015001556.png)

从这张图里，大家可以看到现在当下流行的一些发行版，比如 `Ubuntu`、`Fedora`、`ArchLinux`、`CentOS` 等等。
这些发行版各有特点，有各自的适用场景，也都有着庞大的用户群体以及高度活跃的社区生态。

实际上，现有的 Linux 发行版远不止图中展示的这些，现在光是被记录 Linux 版本列表中的就有超过 300 个。
它们大多数都正处于活跃的开发中，由不同的公司、组织或其他群体进行维护，不断地被改进。

接下来，我们会以 `Ubuntu22.04` 为例，来介绍 Linux 操作系统的一些常见概念以及基本使用方法。

## 来，Ubuntu！
### 安装
在自己的计算机中安装一个 Ubuntu 系统有以下几种方式：
1. 安装到VMware，Virtual Box等虚拟机软件里（推荐），这也是大多数初学者的选择。
2. 安装到物理机上，单系统或双系统，但不推荐大家这样做。  
   刚开始你直接单系统的话可能会出各种各样的问题，你可能会在一段时间内不断的搞坏自己的系统，然后重装，然后再搞坏，然后再重装，但这个折腾的过程中你也能学到很多东西，看你愿不愿意花这个时间。  
   双系统的话，确实兼具了使用 Windows 的方便和体验 Linux 物理机的优势，但你有可能会遇到一些奇奇怪怪的问题，而这些问题你去网上有时候很难搜到解决方案，会耗费你很多时间。
3. WSL（*Windows Subsystem for Linux*）也是一种可选方案，这是微软为 Windows 提供的一个 Linux 子系统。
   但 WSL 相比虚拟机或者物理机来说都会有一些限制，比如你无法使用图形界面，无法使用一些特殊的硬件设备等等。

关于如何在自己的计算机中安装一个 Ubuntu 系统，今天不会讲解具体步骤，这次分享会之前我们已经在群里发过了详细的教程，大家可以从群文件中找到那份文件，自行查阅。
网上也有详细的教程，大家也都可以搜到。

### 换源 & 包管理
当你在安装好 Ubuntu 虚拟机后，你可以看到这样的桌面：

![Ubuntu默认桌面](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015005727.png)

乍一看还是和 `windows` 区别蛮大的。

为了方便的安装各种软件，我们需要先了解一下软件源和包管理工具。

软件源（*software source*）是指存放软件包的服务器，它们通常由软件开发商或者 Linux 发行版的维护者维护。

包管理工具（*package manager*）是指用于安装、更新、卸载软件包的工具，它们可以从软件源中下载软件包，然后安装到系统中。
`Ubuntu` 自带的包管理工具是 `apt`，它的软件源默认是国外的。

出于一些众所周知的原因，国内用户访问国外链接会比较慢，有时候还会请求超时。
不管不问的话用起来会很不爽。
为了解决问题，我们需要对我们的软件源进行更换，一般是将其更换为国内源，比如清华镜像源。

我们可以使用指令来完成换源的操作，具体指令可以看看群里的文档，这里就不再赘述了。

在换源之后，我们需要执行命令更新软件包列表 `sudo apt update`。
成功执行后，我们就可以使用 `apt` 来方便地管理软件了。

常用的 `apt` 指令有图片中这些，不需要刻意去记，你自己用几次就熟悉了。

![常用apt指令](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015010916.png)

除了 apt，其他 Linux 发行版也都有各自的包管理工具，比如 CentOS 的 `yum`、Fedora 的 `dnf`、Arch 的 `pacman` 等等。
他们的使用方法都差不多，也都是用来管理软件包的。
根据自己用的发行版来就好了。

![根据包管理器划分Linux发行版](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231014223037.png)

上面这张图是根据包管理工具的不同对当前常见的 Linux 发行版做的一个分类。

## 文件系统
现在来说说目录结构，这也是 Windows 和 Linux 之间的一个重要区别。

Windows 的目录结构是以物理存储介质为主，通过分区来实现文件目录的管理，每个分区被视为一个独立的盘符，如 C 盘、D 盘等等。
不同分区之间相互独立，联系并不紧密。

而在 Linux 中，所有分区都被挂载到根目录下，所有的文件和目录都被组织成以一个跟节点开始的树形结构。
这个树形结构就是 Linux 的文件系统。

打开 Linux 的终端，输入 `ls /`，你就可以看到根目录下的所有文件和目录。

![ls / 执行结果](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015105831.png)

Linux 的根目录是 `/`，它是整个文件系统的起点，在根目录之下的既可以是其他目录，也可以是文件。
而每一个目录中又可以包含其他目录和文件，如此反复就构成了一个庞大的文件系统。

![Linux文件系统](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015113020.png)

根目录下的每个目录都有各自作用。

比如这里的 `/home` 目录，就是用户的主目录。在 Linux 中，每个用户都有自己的主目录，用来存放用户的个人文件。
用户主目录一般是以用户的帐号命名的，比如上图中的 alice、bob、eve。

再比如这里的 `/lib` 目录，这个目录里存放着系统最基本的动态连接共享库，其作用类似于 Windows 里的 DLL 文件。
几乎所有的应用程序都需要用到这些共享库。

<!-- 介绍各个目录的作用 -->

这张图中的箭头是在表示某些目录之间的关系。

先来看根目录下的 `/bin`，bin 是 `binary` 的缩写，这个目录下存放着一些最基本的命令，比如 `ls`、`cp`、`mv`、`rm` 等等。这些命令在系统启动时就会用到，可以被当前系统下所有用户使用。
与 bin 相连的箭头指向了 `/usr/bin`，这个目录下存放着一些用户级的命令，比如 `vim`、`gcc` 等，这些命令只能被当前用户使用。

类似的还有 `/sbin` 和 `/usr/sbin`。

## 常用命令
讲完前面这些，我们就可以来说说 Linux 常用的一些指令了。

`ls`用来列出目录下的所有文件和目录。
```
ls
ls -a
ls -l
ls <path>
```

`cd`用于切换目录。
```
cd ~ 
cd ..
cd -
cd <path>
```

`mkdir` 用于创建目录。
```
mkdir <name>
mkdir –p <name>
```

`cp` 用于复制文件或目录到指定位置。
```
cp <src> <dst>
cp –r <src> <dst>
```

`mv` 用于移动文件或目录到指定位置，这个指令也可以用来给某个文件或目录重命名。
```
mv <src> <dst>
```

`rm` 用于删除文件或目录。
```
rm <target>
rm –r <target>
rm –f <target>
```

## 权限管理
在多用户计算机系统的管理中，权限是指某个特定用户具有特定的系统资源使用权利。

个人主机大家一般不会管这么多，通常都是直接使用管理员身份登陆了，因为个人计算机的使用者一般都是大家可以信任的人。
而在服务器上就不是这种情况。服务器上的用户可能彼此之间并不熟悉，而服务器中又往往存储着各种各样的资源，有些资源你不希望别的用户看到。
服务器中的数据越重要，价值越高，往往服务器中对权限的设定就要越详细，用户的分级也要越明确。

与 windows 不同，Linux 为每个文件都设置了很多属性，最大的作用就是维护数据安全。
举个简单的例子，在你的 Linux 系统中，和系统服务相关的文件通常只有 root 用户才能读或写。
就拿 `/etc/shadow` 这个文件来说，此文件记录了系统中所有用户的密码数据，非常重要，因此绝不能让任何人读取（否则密码数据会被窃取），只有 root 才可以有读取权限。

再比如说，本来 root 用户才能做的开关机、新增或删除用户等命令，一旦允许任何人拥有这些权限，系统就可能会经常莫名其妙的挂掉。
而且，万一 root 用户的密码被其他人获取，他们就可以登录你的系统，从事一些只有 root 用户才能执行的操作，这是绝对不允许发生的。

因此，在服务器上，绝对不是所有的用户都使用 root 身份登录，而要根据不同的工作需要和职位需要，合理分配用户等级和权限等级。

### 查看权限

Linux 系统中，我们可以使用上文提到过的 `ls -al` 查看当前目录下所有文件的权限属性。

![ls -al 指令](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015122718.png)

在这些信息中，最左侧这一列就是文件的权限属性，它由 10 个字符组成。

左侧 10 个字符，分为四部分，第一个字符表示文件类型，后面每部分 3 个字符，分别代表了所有者权限、所有者所在组权限、其他用户权限。

文件类型共有以下可能的值：

| `d` | `-` | `l` | `b` | `c` | `s` | `p` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 目录 | 普通文件 | 链接文件 | 块设备 | 字符设备 | 套接字 | 管道 |

文件权限共有以下可能的值，所有者、所有组、其他用户权限都一样：

| `r` | `w` | `x` | `-` |
| :---: | :---: | :---: | :---: |
| 读权限，用数字4表示 | 写权限，用数字2表示 | 执行权限，用数字1表示 | 无权限，用数字0表示 |

了解这些属性值之后，我们举个例子来讲解一下。
```bash
drwxr-xr-x   3 root root       4096  9月 11 22:23 home
```

比如我们的 `/home` 目录，它的权限属性是 `drwxr-xr-x`，表示这是一个目录文件，这个目录可以被所有者读取、写入和执行，而属于同一组的用户和其他用户只能读取和执行它。

### 修改权限
我们可以使用 `chmod` 指令来修改文件的权限属性。一般有两种方式，一种是符号模式，一种是绝对模式。

#### 符号模式
我们可以使用以下格式的指令去修改文件的权限属性：
```bash
chmod [ugoa][+-=][rwx] filename
```

第一个参数是权限修改的范围，第二个参数是权限的操作，第三个参数是权限的类型。

这里的第一个参数可以是以下四个字母中的任意一个：
- `u` 表示文件的所有者
- `g` 表示文件的所属组
- `o` 表示其他用户
- `a` 表示所有用户，相当于 `ugo` 的合集

第二个符号参数可以是以下三个符号中的任意一个：
- `+` 添加权限
- `-` 删除权限
- `=` 设置权限

第三个符号参数就是我们前面说过的 `rwx`，分别表示读、写、执行权限。

直接看使用案例可能更直观一些：
```bash
chmod u+x filename
chmod g-w filename
chmod o=rw- filename
```

#### 绝对模式
由于权限中 rwx，其中一种权限只有存在和不存在两种状态，每种权限可以用一个 bit 来表示，`0` 表示无权限，`1` 表示有权限，rwx 只要三个 bit 表示。
三个 bit 表示的一个二进制数即可表示rwx的情况。

![权限原理](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015141918.png)

求和之后，我们可以得到一个三位的八进制数，这个数就是我们要设置的权限。

因此，我们可以使用一个三位的八进制数来表示权限，比如 `777`，这个数的二进制表示为 `111 111 111`，表示所有者、所属组和其他用户都有读、写、执行权限。
```bash
chmod 777 filename
```

### 其他相关指令
除了 `chmod` 之外，还有一些指令用于 Linux 系统的权限管理，比如 `chown`、`chgrp` 等等。
```bash
chown user2 filename
chgrp group2 filename
```

这两个指令分别用于修改文件的所有者和所属组，使用的频率比较低，用起来也比较简单，大家知道就好。

## 更多的知识
Linux 操作系统先讲这么多，更多的知识就留给大家自己去探索了。

大家如果想看一些 Linux 教程书籍的话，推荐《鸟哥的 Linux 私房菜》，这本书是 Linux 界的经典书籍，内容详实，适合初学者阅读。
学校图书馆和协会里也都有，欢迎大家来协会线下借阅。

![鸟哥的Linux私房菜](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231015143017.png)

这些知识光听没什么用，大家还是要自己动手去实践，自己安装一个 Linux，多玩一玩，基本就能掌握个七七八八了。