# Manjaro体验优化

我个人认为Mnajaro KDE的使用体验是高于Ubuntu Gnome的，舒服很多。但默认设置有不尽如人意的地方，稍作调整。

## 输入法优化

之前一直使用的是ibus，感觉不佳。推荐使用 *fcitx5+rime+material color* 的组合，使用起来非常流畅且颜值颇高，体验很好，个人感觉不输windwos原生的输入法。

![20240211102936](https://img.ma5hr00m.top/blog/20240211102936.png)

如果之前安装过fcitx4输入法，需要先行卸载系统中已安装的fcitx4：
```bash
sudo pacman -Rs $(sudo pacman -Qsq fcitx)
```

安装fcitx5（community源）：
```bash
pacman -S fcitx5-chinese-addons fcitx5 fcitx5-gtk fcitx5-qt
```

配置环境变量，创建`~/.pam_environment`文件，并写入以下内容：
```bash
GTK_IM_MODULE=fcitx5
QT_IM_MODULE=fcitx5
XMODIFIERS="@im=fcitx5"
```

X11用户需要在`~/.xprofile`中添加以下内容：
```
fcitx5 &
```

:::tip

使用下面这条指令查询当前系统是否为X11标准：
```bash
echo $XDG_SESSION_TYPE
```

:::

输入法引擎方面推荐Rime。Rime提供了丰富的配置选项，允许用户根据自己的需求和喜好进行定制。用户可以定义自己的词库、短语和快捷键，以及调整输入法的行为和外观。这里可直接安装fcitx5-rime：
```bash
sudo pacman -S fcitx5-rime
```

安装后需要将`~/.config/fcitx5/profile`的内容修改为：
```
[Groups/0]
# Group Name
Name=Default
# Layout
Default Layout=us
# Default Input Method
DefaultIM=rime

[Groups/0/Items/0]
# Name
Name=keyboard-us
# Layout
Layout=

[Groups/0/Items/1]
# Name
Name=rime
# Layout
Layout=

[GroupOrder]
0=Default
```

为fcitx5配置 [Material-color](https://github.com/hosxy/Fcitx5-Material-Color) 皮肤，参考官方仓库README.md进行安装即可。官方提供了多款主题，其中`Material-Color-Teal`的青色最搭配Manjaro默认主题色。

## 音乐播放器
阿菇习惯用网易云音乐，但官方并没有支持Linux。好在，Manjaro中有很多第三方提供支持。

Manjaro中可以下载netease-cloud-music，界面基本完美复刻官方应用，功能齐全：

![20240211162625](https://img.ma5hr00m.top/blog/20240211162625.png)

但出于阿菇目前尚不清楚的原因，“发现音乐”功能一直无法使用。现在，阿菇已经转向了yesplaymusic，这同样是第三方网易云音乐播放器，满足一些音乐播放器该有的功能，颜值更高，运行稳定，但目前未支持音乐评论系统和悬浮窗播放（阿菇正好不用:yum:）：

![20240211162003](https://img.ma5hr00m.top/blog/20240211162003.png)

以上两款播放器都可以通过yay/paru安装：

```bash
paru -S netease-cloud-music
paru -S yesplaymusic
```

## CLI工具
### logo-ls

命令行中也可已有多样的icon图标！使用ls比较单调，我们可以使用logo-ls替代ls。logo-ls的使用方法与ls基本一致，使用效果如下：

![20240211155552](https://img.ma5hr00m.top/blog/20240211155552.png)

更详细的信息参考 [logo-ls 官方仓库](https://github.com/Yash-Handa/logo-ls)，直接使用yay/paru安装即可：

```bash
paru -S logo-ls
```

### ranger

终端文件浏览器，界面美观且自带vi键位绑定，使用效果如下：

![20240211160718](https://img.ma5hr00m.top/blog/20240211160718.png)

左到右三列分别为上一级目录、当前目录、子目录，终端底部为当前选中文件/目录的属性和当前系统的存储余量，选中具体文件后会默认使用nano打开文件。按`q`退出。

更详细的信息参考 [ranger 官方仓库](https://github.com/ranger/ranger)，同样使用yay/paru安装：

```bash
paru -S ranger
```


## 参考链接
- [在Manjaro上优雅地使用Fcitx5](https://www.wannaexpresso.com/2020/03/26/fcitx5/)， by DotIN13