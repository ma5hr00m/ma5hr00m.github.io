# Supabase+Vercel部署Umami
年末，云服务器快到期了，正好赶上腾讯云年底促销，118￥/年 2核2G云服务器，就租了台。

但是，我的umami网站数据统计服务运行在旧服务器的docker容器中，迁移有点麻烦，就想着干脆在第三方平台部署一个吧，免得以后更换云服务器还得迁移来迁移去的。这里写篇博客记录使用vercel+supabase部署umami服务的过程。

## umami
开始之前，先说说umami是什么，我们为什么需要它。

umami是一个轻量级的网站访问统计工具，开源免费，可自托管，用途类似 [Google Analytics](https://analytics.google.com/)。

相比老牌Google Analytics，umami的主要优势在于其对用户隐私的关注和资源占用的低占用。它不使用cookie，不跟踪用户，且所有收集的数据都会匿名化处理，符合GDPR政策。此外，umami的所有数据都存储在自己的数据库中，不用担心数据被第三方平台进行算法优化、用户建模等。

umami的功能虽然没有Google Analytics那么丰富，但如果你的需求不多，只想了解网站的访问量（PV、UV）、流量来源等基本信息，以及记录一些简单的自定义事件，那么Umami会是一个不错的选择。

而且，umami的文档编写的十分详细，并且详细讲解了在多数云平台中应该如何配置一个umami服务，这点非常棒。

## 准备工作
- github帐号
- vercel帐号（支持github认证登录）
- supabase帐号（支持github认证登录）

Vercel是一个面向现代前端项目的部署平台，它提供了快速、简单的部署流程，适用于静态网站、单页面应用和服务器端渲染应用。Vercel支持自动化部署、全球性能优化和无缝的集成，使开发人员能够专注于构建用户界面而不必担心基础架构。

Supabase是一个开源的后端即服务（BaaS）平台，它基于PostgreSQL数据库构建，提供了身份验证、实时订阅、文件存储等功能。Supabase旨在为开发人员提供可扩展的后端解决方案，使他们能够快速构建应用程序而无需花费大量时间在后端开发上。

## 部署流程

第一步，访问[umami官方仓库](https://github.com/umami-software/umami)，Fork一份代码到自己的仓库中。

第二步，访问supabase，点击`New Project`创建一个

![supabase create new project](https://img.ma5hr00m.top/blog/20231219091327.png)

成功创建项目，点击`SQL editor`按钮，页面跳转后点击`+ New query`按钮，在文本框中输入 [umami官方postgresql初始化脚本](https://github.com/umami-software/umami/blob/master/db/postgresql/migrations/01_init/migration.sql) 中的SQL语句，然后运行，在控制台输出`Success. No rows returned`即成功。

![postgresql init success](https://img.ma5hr00m.top/blog/20231219091713.png)

然后，按照下图中的顺序找到刚创建的这个umami postgresql服务的URI参数（记得替换成YOUR_PASSWORD），并记录下来，一会儿要用。

![supabase params](https://img.ma5hr00m.top/blog/20231219092709.png)

第三步。访问vercel，点击`Add New Project`，选中第一步中Fork的umami仓库，点击`import`，然后开始配置环境变量。

只需要配置两个环境变量字段：`HASH_SALT`对应一个由英文组成的字符串，闭着眼对键盘乱敲就行；`DATABASE_URL`对应后端服务URL，就是第二步最后记录的参数。

![vercel set params](https://img.ma5hr00m.top/blog/20231219092920.png)

配置完成后点击`Deploy`，稍等片刻，即可看到部署成功的欢迎页面，此时就能登录分配给你链接使用刚部署的umami服务了！记得更改默认密码。

:::warning 
在这一步，你很有可能会发现Vercel Build Project失败，并抛出`Error: P3005`报错。

解决方法就在下面。


:::

## 遇到的问题<Badge type="tip" text="umami v2 专享" />

Build项目时会出错，查看日志，关键报错信息如下：

```shell
Error: P3005

The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline
```

这个问题会在umami v2中碰到。我写这篇博客时umami的版本是`v2.9.0`，也遇到了这个问题。翻找官方仓库的issue，果然有收获：[#2005](https://github.com/umami-software/umami/issues/2005)。

原理很简单，会出现这个报错的本质原因是umami v2使用了prisma作为数据库迁移工具，而prisma要求数据库模式是空的，否则会导致冲突。为了解决这个问题，可以参考一下方法：

1. 将你Fork的umami项目仓库clone到本地；
2. 在你的umami项目中，创建.env文件，并在其中设置`DATABASE_URL`变量，该环境变量的值就是supabase中刚创建数据库的URL；
3. 在项目终端中依次运行以下三条指令：
```shell
yarn install
yarn build-db
npx prisma migrate resolve --applied 01_init
```

解决问题的手法也很简单，就是先在本地使用prisma来同步umami的数据库模式和迁移，然后再在vercel上部署umami的服务。这样可以避免vercel在部署umami v2项目时出现报错的本质原因，即数据库模式不为空。

注意哦，这里的操作应该在第二步之后、第三步之前。

## 参考
- [How to run Umami Analytics + Supabase + Vercel for free](https://route360.dev/en/post/umami-supabase/), by Route360

## 后话

跟着以上步骤走，可以零成本、轻松地部署自己的umami服务。如果你相对umami了解更多，包括怎么使用umami统计自己站点的数据，可以去看看官方文档，十分详细：[umami Docs](https://umami.is/docs)。

以上。