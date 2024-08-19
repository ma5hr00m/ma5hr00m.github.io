# 基于Koa2+SQLite快速构建CRUD API
暑期的尾声渐近，创新实践课的老师突然要验收暑期学习成果，愚蠢的阿菇对此事完全没有印象……毫无准备的他决定临时搓个小东西出来。前端肯定是要用 React 来做，后端嘛……思来想去，准备学习 koa 现学现卖一下。之前没用 node.js 写过后端，想尝试尝试新东西，单纯为了补作业而写东西感觉不值……

## 准备
先了解一些基本概念。

### koa
`koa` 是一个基于 Node.js 的 Web 开发框架，提供了一种**简洁优雅**的方式来处理 HTTP 请求和响应。我个人觉得 koa 就是精简版的 Express，删减了路由、视图渲染等多种功能，同时在中间件以及异步处理等方面进行了一些优化。

可以去 [👋koa 官网](https://www.koajs.com.cn/) 进一步了解。但官网阅读起来比较难受，目录不是很好，但一手文档的参考简直自然是没得说。

如果只想要快速上手 koa 开发，阿菇更推荐下面这个教程：

[《Koa3 进阶学习笔记》](https://chenshenhai.github.io/koa2-note/)

### sqlite
`sqlite` 是一个嵌入式 SQL 数据库引擎，它提供了一种简单、轻量级且独立的方法来存储和管理数据。它不需要单独的服务器进程，可以直接在应用程序中使用。它不像 MySQL 那么笨重，轻便到你只需要在你的项目中留有一个 sqlite.db 即可，对初学者来说省去了很多配置环境的麻烦（阿菇首次接触到的数据库就是 sqlite）。

## 模式
`MVC` 是一个最基本的核心架构知识，以后会经常用到。你是离不开它的🤗。

![MVC架构图](https://agu-images.oss-cn-hangzhou.aliyuncs.com/test/image-20230828212321994.png)

MVC 模式，全称为 Model-View-Controller（模型-视图-控制器）模式，它是一种软件架构模式，其目标是将软件的用户界面（即前台页面）和业务逻辑分离，使代码具有更高的可扩展性、可复用性、可维护性以及灵活性。

具体到代码层面，MVC 将应用程序分为三个主要部分：模型（Model）、视图（View）和控制器（Controller）。Model 负责数据的存储和处理，Controller 负责业务逻辑的处理和协调，View 负责数据的可视化呈现给用户。

MVC 模式的优势在于分离关注点、提高代码的可重用性和可维护性。通过将应用程序分成模型、视图和控制器，实现更好地组织代码、降低模块之间的耦合度，并提供了良好的扩展性和可测试性。

除了 MVC，还有其他一些常见的架构模式，这里不做展开介绍😜，感兴趣的请自行前往以下链接了解：
- [MVP模式（Model-View-Presenter）](https://zh.wikipedia.org/wiki/Model-view-presenter)
- [MVVM模式（Model-View-ViewModel）](https://en.wikipedia.org/wiki/Model–view–viewmodel)

## 实战场景概括
在接下来的实战中，我们会实现一个 `users` 表，包括 id、username 和 password 三个列，并基于这个表使用 koa 以及相关库实现 crud api 接口，并在完成后使用 `postman` 工具进行测试。

不想听我啰嗦的可以直接去看 GitHub 项目地址：

[koa2-crud-example](https://github.com/ma5hr00m/koa2-crud-example)

## 初始化项目
常用的 koa 语法前往官网自行了解 👉[Koa 中文网](https://www.koajs.com.cn/#application)
```bash
# 初始化 node.js 项目
mkdir example
cd example
yarn init

# 安装 koa
yarn add -D koa
```

## init & ping
该部分参考：[处理 URL - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025933764960)。这个文章会告诉你如何搭建一个基础的 koa 服务，并编写一个 `/ping` api 进行示范。

你需要先安装一些依赖库：
```bash
yarn add -D koa-router require-directory
```

`koa-router` 是一个用于 koa 框架的路由中间件，它提供了类似于 Express 的路由功能（例如 app.get、app.put、app.post 等）。它支持命名 URL 参数、命名路由与 URL 生成、匹配特定主机的路由、响应带有允许方法的 OPTIONS 请求、支持 405 方法不允许和 501 未实现等特性。

`require-directory` 可以递归地遍历指定目录，使用 `require()` 加载每个文件，并返回包含这些模块的嵌套哈希结构。它可以用来自动加载目录中的所有模块，而不需要手动一个一个地加载（似乎只适配 Common JS）。

完成以下代码，你能实现一个最基本的 koa 后端服务，当你访问 http://localhost:3000/ping 时能得到一个 `pong!` 响应。

先来看看目录结构：

<div align='center'>
    <img style='height:200px' src='https://agu-images.oss-cn-hangzhou.aliyuncs.com/test/image-20230828220513695.png' />
</div>

`/core/init.js` 文件用于初始化 /api/ 目录下所有 api 接口文件：

```js
const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
    static initCore(app) {
        InitManager.app = app;
        InitManager.initLoadRouters();
    }

    static initLoadRouters() {
        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }

        const apiDirectory = `${process.cwd()}/api`
        
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        });
    }
}

module.exports = InitManager;
```

`/api/ping.js` 实现了一个简单的后端 api 接口，当用户访问 /ping 路由时，后端服务会返回给用户一个 `pong!` 文本响应：

```js
const Router = require('koa-router');

const router = new Router();

router.get('/ping',async ctx => {
    ctx.body = 'pong!';
} );

module.exports = router;
```

`/app.js` 是入口文件，初始化一个 Koa 对象，调用 `init.js` 启用所有 api 接口，然后监听本地 3000 端口：

```js
const Koa = require('koa');
const InitManager = require('./core/init');

const app = new Koa();

InitManager.initCore(app);

app.listen(3000);
console.log(`🎁 Listening on localhost:3000 ...`);
```

完成以上代码后，在项目根目录执行以下指令启动服务：

```bash
node app.js
```

## database
先安装一些依赖库：
```bash
yarn add -D sqlite3 sequelize
```

`sequelize` 是一个基于 promise 的 Node.js ORM（对象关系映射），可用于 PostgresSQL、MySQL、MariaDB、SQLite 和 Microsoft SQL Server 数据库。它提供了一种简单、灵活且强大的方法来定义模型和关系，并支持事务、迁移和复杂查询等高级功能。

简单的说，就是大家都不想写 Raw SQL，觉得麻烦且存在安全问题，就封装了一套接口用来实现常用的 SQL 语句。

我们在项目根目录下创建一个 `/database/db.js`，写入以下内容：

```js
// 你不需要手动创建 database.db，若代码检测到对应数据库不存在则会自动创建
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite.db'
});

try {
    sequelize.authenticate();
    console.log(`Connect to database successfully`);
} catch (err) {
    console.log(`Connection failed: ${err}`);
}

module.exports = { sequelize };
```

## schema
我们在项目根目录下创建一个 `/schema/user.js`，该文件的作用是定义了数据库模型，方便我们在其他文件使用。写入以下内容：
```js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id',
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'username',
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'password',
        },
    });
}
```

## modules
这段代码定义了一个名为 `userModel` 的类，它包含了一些静态方法，用于对数据库中的 `users` 表进行操作。
```js
const db = require('../database/db');

const sequelize = db.sequelize;

const user = require('../schema/user')(sequelize);
user.sync({force: false});

class userModel {
    static async showAllUsers() {
        const users = await user.findAll();
        return users;
    }

    static async createUser(username, password) {
        const newUser = await user.create({
            username,
            password
        });
        return newUser;
    }

    static async deleteUser(username) {
        const result = await user.destroy({
            where: {
                username
            }
        });
        return result;
    }

    static async searchUser(username) {
        const result = await user.findOne({
            where: {
                username
            }
        });
        return result;
    }

    static async updateUser(userId, username, password) {
        const result = await user.update({
            username,
            password,
        }, {
            where: {
                id: userId
            }
        });
        return result;
    }
}

module.exports = userModel;
```

## controllers
这段代码定义了一个名为 `userController` 的类，它包含了一些静态方法，用于处理与用户相关的 HTTP 请求。

controllers 中的静态方法与上文提到的 modules 中的静态方法一一对应。
```javascript
const userModel = require('../modules/user');

class userController {
    static async show(ctx) {
        const users = await userModel.showAllUsers();
        ctx.response.status = 200;
        ctx.body = {
            status: 200,
            message: 'success',
            data: users
        };
    }

    static async create(ctx) {
        const data = ctx.request.body;
        const username = data.username;
        const password = data.password;
        console.log(username + ' ' + password);

        const newUser = await userModel.createUser(username, password);
        ctx.response.status = 200;
        ctx.body = {
            status: 200,
            message: 'success',
            data: newUser
        };
    }

    static async delete(ctx) {
        const data = ctx.request.body;
        const username = data.username;
        const result = await userModel.deleteUser(username);
        ctx.response.status = 200;
        ctx.body = {
            status: 200,
            message: 'success',
            data: result
        };
    }

    static async search(ctx) {
        const data = ctx.request.body;
        const username = data.username;
        const result = await userModel.searchUser(username);
        ctx.response.status = 200;
        ctx.body = {
            status: 200,
            message: 'success',
            data: result
        };
    }

    static async update(ctx) {
        const data = ctx.request.body;
        const userId = data.userId;
        const username = data.username;
        const password = data.password;
        const result = await userModel.updateUser(userId, username, password);
        ctx.response.status = 200;
        ctx.body = {
            status: 200,
            message: 'success',
            data: result
        };
    }
}

module.exports = userController;
```

## router/api
我们为每个接口单独创建一个文件，便于后期维护。每个接口也是对应到 `userControllers` 类中的静态方法。

`/api/show` 接口，用于展示当前数据库所有内容：
```javascript
const Router = require('koa-router');
const userController = require('../controllers/user');

const router = new Router();

router.get('/api/show', userController.show);

module.exports = router;
```

`/api/create` 接口，用于创建一个新的用户：
```javascript
const Router = require('koa-router');
const userController = require('../controllers/user');

const router = new Router();

router.post('/api/create', userController.create);

module.exports = router;
```

`/api/delete` 接口，用于删除一个用户：
```javascript
const Router = require('koa-router');
const userController = require('../controllers/user');

const router = new Router();

router.post('/api/delete', userController.delete);

module.exports = router;
```

`/api/search` 接口，用于查找一个用户：
```javascript
const Router = require('koa-router');
const userController = require('../controllers/user');

const router = new Router();

router.post('/api/search', userController.search);

module.exports = router;
```

`/api/update` 接口，用于更新一个用户的信息：
```javascript
const Router = require('koa-router');
const userController = require('../controllers/user');

const router = new Router();

router.post('/api/update', userController.update);

module.exports = router;
```

## bodyparser & cors
### 参数解析
原生 kao 不支持解析 POST 请求正文数据，也就是说，此时你编写的 body 参数解析代码并不生效！

就像我们编写的 controllers 部分代码需要解析 POST 请求主体并获取参数，此时并不会生效。比如：
```javascript
// /controllers/user.js
class userController {
 	... ...
    
    static async create(ctx) {
        // 解析 POST 请求主体中的 username & password 参数
        const data = ctx.request.body;
        const username = data.username;
        const password = data.password;
        ...
    }

    ... ...
}
```

为了解决这个问题，我们需要安装以下依赖库：
```bash
yarn add -D koa-bodyparser
```

`koa-bodyparser` 是一个 koa 框架的中间件，它可以解析 HTTP 请求的正文（body）数据，并将解析后的数据存储在 `ctx.request.body` 中。它支持解析 JSON、表单和文本类型的正文数据，但不支持解析多部分格式（multipart）数据。也就是说，如果想要实现文件上传，我们还会需要其他的库。

安装成功后，我们将以下代码添加到 app.js 中，之后我们用于解析 body 的代码就能够正常工作了。

```javascript
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());
```

### 跨域
假设你的 koa 后端运行在 [http://localhost:3000](http://localhost:3000)，而你的 react 前端运行在 [http://localhost:5173](http://localhost:5173)。如果此时你的前端服务向后端 api 发送请求，会遭到拒绝，提示存在跨域问题：

<div align='center'>
    <img src='https://agu-images.oss-cn-hangzhou.aliyuncs.com/test/image-20230829135418397.png' />
</div>

最简单的解决方法就是在我们的 app.js 中添加一个用于处理跨域资源共享（CORS）的中间件，你可以通过以下指令安装这个库：
```bash
yarn add -D koa-cors
```

安装成功后，将以下代码添加到 app.js 中：
```javascript
const cors = require('koa-cors');
...
app.use(cors());
```

## app
在解决前面的工作之后，我们开始编写入口文件 app.js：

```JavaScript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const InitManager = require('./core/init');

const app = new Koa();

app.use(cors());
app.use(bodyParser());
InitManager.initCore(app);

app.listen(3000);
console.log(`🎁 Listening on localhost:3000 ...`);
```

完成之后，我们只需要在项目根目录下运行 `node app.js` 指令，即可启动我们的 koa 后端服务！

## 测试工具
我们按照以上步骤实现了一套 koa-crud，还需要对其功能进行测试🤧。

当然，你可以通过访问网页完成对 api 的测试，但这种方法局限性太大，不够灵活且很不方便。好在，现在有很多成熟的🔨工具供我们使用。

我个人推荐 `postman`。

postman 是一款用于测试和开发 API 的合作平台和工具。它提供了一个用户友好的界面，让开发人员能够轻松地发送 HTTP 请求、测试响应并与 API 进行交互

使用 postman，你可以创建各种类型的 HTTP 请求（例如 GET、POST 和 PUT），设置请求参数（如头部、身体、查询参数等），发送请求，并查看服务器返回的响应。它还提供了断言（assertions）功能，用于验证API的响应是否符合预期。

<div align='center'>
    <img src='https://agu-images.oss-cn-hangzhou.aliyuncs.com/test/image-20230829141158347.png' />
</div>

下载使用都很简单，这里不做介绍，请自行前往 💥[postman 官网](https://www.postman.com/) 了解。

## 优化
以上代码就是 `kao+sqlite` 实现 CRUD 的简单实战，整套代码还有很多可以✨优化的地方。

比如，调用这个 koa 服务中的 api 都需要使用 POST 请求，不符合目前流行的 `RESTful` 设计风格，后续可以进行调整（但 POST 一把嗦确实无脑易用🤣）。

在 controllers 中，我也没有进行适当的错误处理，不方便 DEBUG，也是可以优化的点。

对传入参数的处理也没有做，我不晓得 koa-bodyparser 有没有进行处理，也可能会存在安全问题。

> 问题多多❤～摩多摩多❤～

不过呢，这是阿菇第一次用 koa 写后端服务（其实后端都没怎么写过🥲），至少能跑起来了！后续会继续优化这个服务，并更新在 GitHub 仓库中，以上实现的 api 会被规范化为 `/api/v1/*`，之后优化过的版本会注册为 `/api/v2/`，这样做可能较符合实际生产环境的写法……

## 参考
- [Koa 中文网](https://www.koajs.com.cn/#)
- [Koa2 进阶学习笔记](https://chenshenhai.github.io/koa2-note/)
- [koa - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025933764960)
- [Koa 框架教程 - 阮一峰的网络日志](https://ruanyifeng.com/blog/2017/08/koa.html)
- [koa 连接sqlite3 项目目录结构 - 稀土掘金](https://juejin.cn/post/7066568536944017438#heading-8)

## 后话
每次写CRUD，都会觉得后端这套东西的逻辑性比前端要强😇，写的时候行云流水。

`koa` 给我的开发初体验不错，主打一个轻便简洁，仅存储少量数据时配合 `sqlite` 更是方便。