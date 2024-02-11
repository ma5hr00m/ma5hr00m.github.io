# Manjaro体验优化

我个人认为Mnajaro KDE的使用体验是高于Ubuntu Gnome的，舒服很多。但默认设置有不尽如人意的地方，稍作调整。

## 输入法

安装fcitx5输入法，目前体验效果接近windows原生的输入法，流畅且颜值高：

![20240211102936](https://img.ma5hr00m.top/blog/20240211102936.png)

卸载系统中已安装的fcitx4输入法：
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

X11用户需要在`~/.xprofile`中添加以下


## 软件
- logo-ls：带图标ls
- ranger：终端文件浏览器