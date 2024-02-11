# Spring Boot开发学习

## 初始化项目

### CLI初始化项目

用于初始化Spring Boot项目的Maven指令：

```bash
mvn archetype:generate -DgroupId=com.example -DartifactId=springboot-demo -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

- `mvn archetype:generate`用于初始化项目；
- `-DgroupId`指定项目包名；
- `-DartifactId`指定项目名称；
- `-DarchetypeArtifactId`用于生成项目脚手架的Maven Archetype的artifactId，这里使用的是maven-archetype-quickstart，一个快速启动项目的脚手架；
- `-DinteractiveMode=false`禁用交互模式，这样Maven就不会在生成项目时询问用户输入，而是使用默认值。

初始化的目录结构如下：

```
- src
  - main/java/com/example
    - App.java
  - test/java/com/example
    - AppTest.java
```

### IDEA初始化项目

比较简单，不做介绍。但个人暂时抗拒，而且也存在IDEA和maven版本的小问题，暂不采用。本篇博客的操作都未使用IDEA。

### 可能遇到的问题

CLI中使用Maven初始化项目时，可能会在这里卡住：

```bash
[INFO] Generating project in Batch mode
```

可以通过在指令后面添加一个`-X`参数查看详情，会发现初始化操作是找不到所需文件：

```bash
[DEBUG] Searching for remote catalog: https://repo.maven.apache.org/maven2/archetype-catalog.xml
```

解决问题的方法也很简单，直接找到这个文件下载到本地，然后在初始化项目时设置从本地读取文件就好了。从这个网址下载对应的archetype-catalog.xml文件：[https://repo.maven.apache.org/maven2/](https://repo.maven.apache.org/maven2/)，保存到`~/.m2/`目录下，然后在maven初始化springboot项目的指令后面添加`-DarchetypeCatalog=local`参数即可。

## pom.xml

Maven的配置文件，直接底下一篇文章速通：

- [Maven POM文件配置详解](https://juejin.cn/post/7230284316102459429)，by 稀土掘金

## 连接MySQL

- [Spring Boot实战（二）：Spring Boot连接MySQL数据库](https://juejin.cn/post/6844903923526926344)，by 稀土掘金
