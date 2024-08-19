# Learn to live in Terminal<Badge type="tip" text="DevOps" />

## Process Monitoring

进程监控（Process Monitoring）帮助计算机用户了解系统的运行状态，即使发现并解决问题。在Linux中，进程监控可以借助命令行工具完成。

### 基础知识

进程（process）是正在执行的程序的实例，包括程序计数器、进程堆栈、寄存器、程序代码等。相比之下，程序代码只是文本部分。
当计算机程序被触发执行时，它不会直接运行，而是首先确定执行程序所需的步骤，然后按照这些执行步骤进行执行。
一个独立的进程占用自己的内存空间，不与其他进程共享这个空间。

线程（thread）是可以由调度程序独立管理的轻量级进程，它通过并行处理来提高应用程序的性能。
线程与其对等线程共享信息，如数据段、代码段、文件等，同时它包含自己的寄存器、堆栈、计数器等。
线程基本上是一个大进程的子部分，所有线程在一个进程中相互关联。

![thread and process](https://static.javatpoint.com/difference/images/process-vs-thread3.png)

以下会介绍常用的、用于监控进程的工具。

### ps

`ps`用于检索当前Linux系统中正在运行的进程。

```shell
ps aux # 展示所有进程信息
ps -AFl # 展示所有进程信息（包括命令行参数等更多信息）
ps -AFlH # 展示所有进程信息（树形线程图）
```

“树形线程图”说起来有点抽象，展示下区别：
```shell
# 普通模式
5 S root      1700   0 Dec21 ?        00:00:00 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
5 S www-data  5336   0 Dec21 ?        00:00:00 nginx: worker process
5 S www-data  5336   0 Dec21 ?        00:00:00 nginx: worker process

# 树形模式
5 S root      1700   0 Dec21 ?        00:00:00   nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
5 S www-data  5336   0 Dec21 ?        00:00:00     nginx: worker process
5 S www-data  5336   0 Dec21 ?        00:00:00     nginx: worker process
```

除了简单的树形模式，我们还能指定参数输出进程森林（这样翻译可能比较怪？）。

```shell
ps -e -o pid,args --forest

# 效果
715504 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
715505  \_ nginx: worker process
715506  \_ nginx: worker process
```

```shell
ps -U user -u user u # 查找指定用户的进程
ps -p pid # 特定 PID 的进程信息
ps uax | grep process_name # 指定进程信息
```



详细信息参考官方操作手册：
- [ps(1) — Linux manual page](https://man7.org/linux/man-pages/man1/ps.1.html)

### top

`top`是用于的查看Linux系统进程信息的CLI工具，几乎所有Linux发行版都内置了top。显示内容分为概要区和动态运行区：

![top params](https://img.ma5hr00m.top/blog/20231221104017.png)

从这张图中可以看到会显示很多信息，以下是`top`信息输出内容中各个参数的作用：

- 系统时间和系统运行时间 (up time): 显示当前的系统时间和系统已经连续运行的时间。
- 用户数量 (users): 显示当前登录系统的用户数量。
- 平均负载 (load average): 显示系统的平均负载情况，即一段时间内系统处于可运行状态的进程数量的平均值。
- 任务数量 (tasks): 显示系统中的任务数量，包括总任务数、正在运行的任务数、正在休眠的任务数以及停止或僵尸任务数。
- CPU使用情况 (%Cpu(s)): 显示CPU的使用情况，包括用户空间使用CPU的百分比（us）、系统空间使用CPU的百分比（sy）、空闲CPU的百分比（id）、等待I/O操作的CPU的百分比（wa）等。
- 内存使用情况 (MiB Mem, MiB Swap): 显示内存的使用情况，包括物理内存和交换空间的总量、空闲量和已使用量。
- 进程信息 (PID, USER, PR, VIRT, RES, SHR, S, %CPU, %MEM, TIME+): 显示运行中的进程的详细信息，包括进程的PID（进程ID）、用户、优先级、虚拟内存、实际内存、共享内存、进程状态、CPU使用率、内存使用率以及进程运行时间等。

可以通过添加参数使top输出其他信息，以及更改top工具配置，对动态运行区数据进行排序、查找、进程控制，更多使用细节可以看这篇文章和官方操作手册：
- [top (the UNIX process inspector) cheat sheet](https://gist.github.com/ericandrewlewis/4983670c508b2f6b181703df43438c37), by Eric Lewis
- [top(1) - Linux munual page](https://man7.org/linux/man-pages/man1/top.1.html), by Linux

### atop

`atop`——一款全屏性能监视器，用于查看系统负载。它显示最关键的硬件资源，如CPU、内存、磁盘和网络。

![atop](https://img.ma5hr00m.top/blog/20231221104836.png)

输出的信息更详细，不贴在博客里了，使用`man atop`指令可以查看atop内置的帮助文档。

### htop

:::info
wip
:::