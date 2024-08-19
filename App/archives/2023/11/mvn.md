# Maven学习笔记

> 阿菇的Java学习笔记第三篇，参考学习路线：https://roadmap.sh/java

构建工具是一个程序或命令行实用程序，它自动化编译、组装和部署软件的过程。构建工具不仅仅局限于编译代码;，它们还可以帮助进行包管理、依赖处理和持续集成系统。

总算是来到阿菇相对熟悉的部分了，有了相对熟悉的概念😆。Web前端开发也经常使用各种构建工具，比如Webpack、label。

但要先介绍下Gradle。

## Gradle

学习路线中推荐了三种Java项目构建工具，分别是Maven、Gradle和Ant。稍作了解后，阿菇原本准备先从Gradle学起，原因是比较新且上手难度低，阿菇主要看的Gradle教程是：[Gradle 用户指南官方文档中文版](https://doc.yonyoucloud.com/doc/wiki/project/GradleUserGuide-Wiki/index.html).

> 但之后又发现Maven的使用率高，就转去学Maven了。

阿菇的主系统是Ubuntu22.04，比较遗憾，不能通过`apt/apt-get`安装gradle工具。
同时感觉为了一个工具再去额外安装一个并不常用的包管理工具是很无聊的事情，遂决定手动安装。

网络通畅的前提下，依次执行以下指令在本地安装gradle-7.5.1，每句指令的作用都写在注释里了，自行查看：

> 想下载其他版本的gradle，可以在 [官方版本页面](https://gradle.org/releases/) 找找看。

```zsh
# 拉取官网安装包到 /tmp 目录
wget https://services.gradle.org/distributions/gradle-7.5.1-bin.zip -O /tmp/gradle-7.5.1-bin.zip

# 解压到 /opt/gradle 目录
sudo unzip -d /opt/gradle /tmp/gradle-7.5.1-bin.zip

# 创建 gradle.sh 并设置环境变量
echo -e "export GRADLE_HOME=/opt/gradle/gradle-7.5.1\n\
export PATH=\${GRADLE_HOME}/bin:\${PATH}" \
| sudo tee /etc/profile.d/gradle.sh

# 为 gradle.sh 添加执行权限
sudo chmod +x /etc/profile.d/gradle.sh

# 加载环境变量到当前 shell
source /etc/profile.d/gradle.sh
```

依次执行以上指令后，没有报错就说明我们成功在本地安装了gradle。运行以下指令查看本地gradle版本：

```zsh
gradle -v
```

不出意外的话，你能看到以下输出：

![20231107001820](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231107001820.png)

其他安装方法请参照：[下载与安装](https://doc.yonyoucloud.com/doc/wiki/project/GradleUserGuide-Wiki/installing_gradle/download.html)

:::info 🤯 想法
说实话，每次都鼓捣这么一堆指令，体验不好。

准备学学shell，以后装东西直接从仓库拉脚本，然后执行脚本安装配置。
:::


### Hello World

`gradle`命令会在当前目录下搜索`build.gradle`构建配置脚本，如果这样的脚本就会开始构建项目、执行任务。

以下是一个简单的实现，定义了一个`hello task`，并在这个task中添加了一个基本的action。当我们构建这个脚本时，就会执行这个action。

```
task hello {
    doLast {
        println 'Hello world!'
    }
}
```

在该构建配置脚本所在目录下执行`gradle hello`，会得到以下输出结果：

![20231107200253](https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/20231107200253.png)



## 环境配置

包管理工具下载：

```shell
sudo apt update && sudo apt install maven
```

添加环境配置。先创建`/etc/profile.d/maven.sh`文件，然后再该文件中写入以下内容：

```sh
# 个悲剧自己的需求改改参数
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 
export M2_HOME=/usr/share/maven
export MAVEN_HOME=/usr/share/maven
export PATH=${M2_HOME}/bin:${PATH}
```

保存退出，加载环境配置：

```shell
source /etc/profile.d/maven.sh
```

以管理员权限初始化maven本地仓库，执行以下命令会在当前用户主目录下生成一个`.m2`目录：

```shell
sudo mvn help:system
```

拷贝`settings.xml`到`.m2`目录下：

```shell
cp ${MAVEN_HOME}/conf/settings.xml ~/.m2
```

配置阿里镜像源，在在`settings.xml`添加以下内容：

```xml
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

输出版本信息，进行测试：

```shell
mvn -v
```

<br/>

:::tip
WIP
:::
