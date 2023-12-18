# Linux 中 Python 环境/版本管理
阿菇觉得 Python 的环境/版本管理实在是依托，感觉不如 Node.js。
尤其是在 Linux 环境下，多数发行版的系统组件、工具依赖自带的 Python，折腾系统自带的 Python 环境时，一个搞不好就会把整个系统干掉。

同时，研究安全的小伙伴经常用各种工具，而很多工具又是是基于 python2 的，而当前使用的绝大多数 Linux 发行版都自带的 python3，不方便。

另一方面，我们的各种 python 项目都会有各自需要的依赖，而我们总不可能把所有需要的依赖库都直接全局安装，这很丑陋，而且很多情况下不方便项目的迁移。

> 流行的 python 项目/工具基本都是提供了 `requirements.txt`，用户需要手动本地安装。

Windows 系统中，我们可以直接使用强大的 [Anaconda](https://www.anaconda.com/) 管理我们的 python 环境以及版本，Linux 就不行了。
这篇文章，总结了阿菇在 python 环境/版本管理方面的经验，可供参考。

::: warning  
本篇文章使用环境：系统 `Ubuntu22.04`，自带 `python3.10.12`。
:::

## py3环境管理 - venv
python3 推出了 `venv` 模块，python3.6 及以上已经默认安装，python3.5 需要手动安装：

```bash
sudo apt install python3-venv
```

venv 模块支持创建轻量级的虚拟环境，每个环境拥有它们自己安装在其 `/site` 目录下的 python 软件包（依赖）集合。

### 使用

使用以下指令可以创建一个 python 虚拟环境，python 版本与当前系统使用的 python 版本相同：

```bash
python3 -m venv env
```

实际效果就是在你的当前目录下创建一个名为 `env` 的目录，其中包括了特定的 python 解释器、软件库和二进制文件。你可以把上面指令中的 `env` 替换为你想要的虚拟环境名称（也就是那个目录名称），习惯上我们会将其命名为 `venv` 或者 `.venv`，通常放在项目根目录下。

需要遵守一些默认规范。python 虚拟环境是可丢弃的，也就是说，我们不会将其一并打包的项目中，我们只需要给用户提供 `requirements.txt` 文件，用户自己创建一个虚拟环境并安装所需依赖。开发者不应该把任何项目代码放到虚拟环境目录中。同时，我们也不会移动虚拟环境，哪里需要就在哪里创建。

创建好虚拟环境后，它只是一个放在那儿的目录，需要手动激活。

假设你是在当前目录下创建了名为 `venv` 的虚拟环境，你使用以下指令将这个虚拟环境激活：

```bash
source ./venv/bin/active
```

然后你可以发现命令行中标志出当前命令行使用了虚拟环境，虚拟环境名称默认与当前项目名称相同。

![20231102001458](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63d4846c761b4d5bb86b8863cd745a83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980\&h=365\&s=57542\&e=png\&b=0e1019)

>图中是 [zsh](https://www.zsh.org/)，配置了 [oh-my-zsh](https://ohmyz.sh/)，应用了 [powerlevel10K 主题](https://github.com/romkatv/powerlevel10k)，通过 [tabby 模拟终端工具](https://tabby.sh/) 使用，是一个非常 nice 的组合，可以试试看！

此时使用 `pip --version` 会提示用户使用的是虚拟环境中的 `pip` 包管理工具。激活虚拟环境后我们就可以在这里面肆意安装我们需要的各种依赖了，虚拟环境与外界是隔离的，你可以想象成虚拟机，一般不会影响到系统本身。

使用完虚拟环境后，执行以下指令关闭虚拟环境：

```bash
deactivate
```

### 进一步

就是如此的干净清爽，我们只需用系统自带的 python 创建虚拟环境即可，之后的一切依赖都放在各自的虚拟环境中，不用把自己系统的 python 软件包搞得一团糟。

阿菇的建议是：*不要在自己的系统中安装任何额外的 python 软件包，把自带的 python 当作一个虚拟环境创建器，所有需要依赖的项目都单独创建一个虚拟环境*。

现在问题来了。我们使用这个指令只能创建与当前版本相同的 python 虚拟环境，并不能满足我们的需求，下一步该怎么做呢？

## Linux中使用python2

很多 Linux 发行版不带 python2 环境，但我们有时需要用。可以在系统中配置一个 python2 环境。

### python2

包管理工具直接安装：

```bash
sudo apt install python2
```

安装好之后指定使用 `python2` 即可，默认路径是 `/usr/bin/python2`，此时可以使用 `python2` 来运行代码了。

> 这里默认安装 python2.7

### pip2

为了方便地管理 python2 依赖，我们还需要 pip2。

但通过 ubuntu 软件源安装的 python2 不自带 pip2 管理工具。这是因为 Python 2.7 的支持周期已于 2020 年 1 月 1 日结束，pip 21.0 也于 2021 年 1 月停止对 Python 2.7 的支持。

只能手动安装。

假设你已经按照上文描述安装好了 python2，使用以下命令拉取 [pypa.io](pypa.io) 的安装脚本并用 python2 执行即可：

```bash
wget -O - https://bootstrap.pypa.io/pip/2.7/get-pip.py | python2
```

安装成功后重启终端，然后使用 `pip2 --version` 检查是否安装成功。现在，你已经在本地有了 python2.7 环境和对应的 pip2 包管理工具。

## py2环境管理 - virtualenv

只有本地 python2 环境肯定不行，我们不能容忍我们的软件包变成依托。

管理 python2.7 环境，我们可以使用 venv 的前身 —— `virtualenv`。

### 使用

与 venv 基本一致，这里不再赘述：

```bash
# 安装
pip2 install virtualenv

# 创建虚拟环境 env
virtualenv env

# 激活虚拟环境
source ./env/bin/avtivate

# 关闭虚拟环境
deactivate
```

激活虚拟环境后，使用 `python --version` 查看虚拟环境的 python 版本，会提示：`Python 2.7.18`。这与你安装的 python2 版本有关，自行判断。

### 为什么不用 venv

尝试 `pip2 install venv` 会提示：`ERROR: Could not find a version that satisfies the requirement venv (from versions: none)`，也就是官方没有提供对应的模块版本。

或许你在什么地方看到过使用 venv 指定 python 解释器来创建对应虚拟环境，比如：

```bash
python3 -m venv --python=/usr/bin/python2 venv
```

不知道是否真的可行，至少阿菇这里行不通，会提示没有存在不支持的参数 `--python`，不知道是不是 venv 版本问题。

### 再进一步

现在有了 python2.7 和 python3.10，也做到了虚拟环境，已经能胜任多数使用场景了。

但阿菇并不满意，版本管理不够精细。我们该如何使用其他更细分的版本呢，比如 python3.8？

## py版本管理工具 - pyenv

有一款合适的 Python 版本管理工具—— `pyenv`。

### 使用

使用 Git 直接拉取 pyenv 到本地就行：

```bash
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

然后需要修改环境变量，这个和的命令行有关，这里提供 zsh 和 bash 两个版本的：

```bash
# zsh
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zprofile
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zprofile
echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# bash
echo -e 'if shopt -q login_shell; then' \
      '\n  export PYENV_ROOT="$HOME/.pyenv"' \
      '\n  export PATH="$PYENV_ROOT/bin:$PATH"' \
      '\n eval "$(pyenv init --path)"' \
      '\nfi' >> ~/.bashrc
echo -e 'if [ -z "$BASH_VERSION" ]; then'\
      '\n  export PYENV_ROOT="$HOME/.pyenv"'\
      '\n  export PATH="$PYENV_ROOT/bin:$PATH"'\
      '\n  eval "$(pyenv init --path)"'\
      '\nfi' >>~/.profile
echo 'if command -v pyenv >/dev/null; then eval "$(pyenv init -)"; fi' >> ~/.bashrc
```

执行完成后就可以使用 pyenv 了。

> 上面的指令中中已经包括重新加载命令行配置的指令。

执行 `pyenv -h` 可以查看手册，然后上手用就行。

```bash
# 查看当前 python 版本
pyenv version

# 查看所有 python 版本
pyenv versions

# 查看所有可安装的 python 版本
pyenv install --list

# 安装指定 python 版本
pyenv install 3.8.12

# 安装新版本后 rehash
pyenv rehash

# 指定全局 python 版本
pyenv global 3.8.12

# 删除指定 python 版本
pyenv uninstall 3.8.12

# 指定多个全局版本, python3版本优先
pyenv global 3.8.12 2.7.10
```

### 加速pyenv

国内访问外网不方便，执行 `pyenv install` 时可能会非常慢，甚至超时终止访问。我们有几种方案解决这个问题。

#### 01 手动下载压缩包

网上最多的是手动下载压缩包到 pyenv 缓存，然后再用 `pyenv install` 安装。

国内有 python 镜像站，我们进去找到对应版本压缩包下载就行：[国内镜像站](https://registry.npmmirror.com/binary.html?path=python/)

![20231102104041](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/823d54c959b8426bb3b901c9a28838a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1672\&h=755\&s=175052\&e=png\&b=ffffff)

先找到所需版本的下载链接，右键复制链接地址，然后使用 wget 拉取到本地 pyenv 缓存中，再执行命令下载：

```bash
wget https://registry.npmmirror.com/-/binary/python/2.7.10/Python-2.7.10.tar.xz -P ~/.pyenv/cache
pyenv install 2.7.10
```

#### 02 终端代理

这个同样适用于其他下载慢的情况，设置 shell 的 `http_proxy` 环境变量，让终端走代理。

前提是你要有一个代理服务器，或者有相应的工具。

```bash
export https_proxy=http://127.0.0.1:7890
```

#### 03 pyenv镜像

使用国内镜像站中的压缩包资源，这里以[搜狐 pyenv 镜像源](http://mirrors.sohu.com/python/)为例：

```bash
v=3.5.2|wget http://mirrors.sohu.com/python/$v/Python-$v.tar.xz -P ~/.pyenv/cache/;pyenv install $v
```

## py环境管理工具 - pyenv-virtualenv

pyenv 可以实现快捷的 python 版本管理，我们可以使用它的 `virtualenv` 插件一并实现虚拟环境管理。

### 使用

拉取脚本然后添加环境变量，再重启 shell 即可，这里以 zsh 为例：

```bash
# 安装插件
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv

# 添加环境变量到 zsh
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc

# 重启 zsh
exec zsh
```

然后我们就可以使用 pyenv 的 virtualenv 插件管理虚拟环境了。只要是你已经通过 pyenv 安装的版本，都可以使用该插件创建对应的虚拟环境。

```bash
pyenv virtualenv 3.8.12 v3812env
```

但是要注意，`virtualenv`  插件的逻辑和 venv 以及 py2 的 virtualenv 模块不同，它不是在当前目录下创建虚拟环境目录，而是在 `～/.pyenv` 目录中安装。

![20231102133150](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8a617a9327746d69b0573d010a4d8a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880\&h=167\&s=36334\&e=png\&b=15192b)

使用 virtualenv 插件的虚拟环境也很方便：

```bash
# 列出当前虚拟环境
pyenv virtualenvs

# 激活虚拟环境
pyenv activate v3812env

# 退出虚拟环境
pyenv deactivate v3812env 
```

至此，我们基本实现了 Linux 下方便的管理各版本的 python 虚拟环境，这允许我们为每个项目/工具创建独立的虚拟环境，有效的维护了系统本身的整洁。

### 或许，还可以……？

以上是我们的 python 版本/环境管理方案，已经够用了，但或许你并不满足。身为合格的程序员，你对环境管理有着更高的需求。

那还有更优秀的解决方案吗？

有！

## Nox 堂堂登场！

![20231102192818](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7653602e147c43ccab1438a4589f7dfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932\&h=287\&s=90851\&e=png\&b=fffefe)

`Nox` 是一个命令行工具，用于在多个 Python 环境中进行自动测试，开发者可以使用标准的 Python 文件对项目进行配置。

我们可以在项目根目录下创建一个 `noxfile.py` 文件，使用安装好的 `nox` 模块运行这个文件，以创建 python 虚拟环境并运行一些预定的指令。我们也可以手动激活 python 虚拟环境，就像前面的 venv 一样。

### 使用案例

新建个 `app` 目录，在里面配置一份 `noxfile.py`：

```python
import nox # 引用 nox 模块

@nox.session(python='3.8.12') # 使用 python3.8.12
def install_flask(session): # 创建一个名为 install_flask 的会话
    session.install('flask') # 安装 flask 依赖
```

然后，我们在当前目录下执行以下指令，初始化这个虚拟环境：

```bash
$ python3 -m nox   

nox > Running session install_flask
nox > Creating virtual environment (virtualenv) using python3.8 in .nox/install_flask
nox > python -m pip install flask
nox > Session install_flask was successful.
```

初始化完成后，当前目录下多出 `__pycache__` 和 `.nox` 文件，前者是缓存目录，存储编译后的 python 代码，后者就是我们的虚拟环境目录，类似与使用 \`python -m venv env\`\` 创建的 env 目录。

有了虚拟环境之后，常用的指令就和 venv 没有太大差别了：

```bash
# 激活 install_flask 虚拟环境
source .nox/install_flask/bin/activate

# 退出虚拟环境
deactivate
```

你可以把下面这段 `app.py` 写入当前目录下，作用是实现一个 flask Web 服务，你可以激活刚创建好的这个虚拟环境，然后尝试运行这个服务。

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()
```

如果运行结果与下图类似，即 flask web 服务正常运行，则代表你的 nox 与刚创建的虚拟环境没有问题。

![20231102194422](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fc32ac6fac94f3188fe1648edb07a62~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=881\&h=211\&s=31011\&e=png\&b=15172a)

> nox 只能创建当前系统已有 python 解释器对应版本的虚拟环境，也就是说你本地没有 python2.7.10 环境，你也无法创建 2.7.10 虚拟环境。

### More

可以从以下渠道继续学习 nox，它的功能远比我这个案例中所演示的强大得多。

*   官方文档：[Welcome to Nox](https://nox.thea.codes/en/stable/index.html)
*   中文文档：[欢迎来到 Nox](https://daobook.github.io/nox/index.html)
*   项目地址：[Winterbloom/nox](https://github.com/wntrblm/nox)

## 另一选择 - Tox

`Nox` 与 `Tox` 十分相似，二者都是 python 任务自动化工具，都可以创建虚拟环境以隔绝项目与本地系统。

- 官方文档：[欢迎来到tox自动化项目](https://www.osgeo.cn/tox/)
- GitHub 仓库：[tox-dev/tox](https://github.com/tox-dev/tox)

## 终极解决方案(x)

在群里问 python 环境管理的时候，学长提供了一个终极解决方案：

> ***“遇到 py2 的代码，就先帮他 migrate 到 py3 再跑。”***

听到这句话的阿菇：

![20231102200942](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9290643581454d859553ae708dd893fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=213\&h=218\&s=10453\&e=jpg)
