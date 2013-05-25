#Blog

本项目的目标是构建**易于使用，易于维护，基本功能健全**的博客工具。后端为Nodejs编写，采用MongoDB做为数据库，前端展示
页面借鉴了[Noderce](https://github.com/willerce/noderce)，管理页面借鉴了[Flat UI](http://designmodo.com/flat/)。

##基本特点

* 模块化设计，依赖清晰，易于维护，参考<https://vimeo.com/56166857>
* 界面响应式设计，适用不同分辨率屏幕。
* 管理界面只有文章增删改，评论删除，文章自动保存功能，简洁易用。
* 使用markdown语法，支持github方式代码块，编写更高效。
* 垃圾评论过滤和邮件提醒功能（使用第三方服务）。
* 支持rss，sitemap，google-analysis

##使用

* 因为使用`Makefile`作为构建工具，所以暂时只支持 \*nix 系统。
* 安装[Nodejs](http://nodejs.org/)，[MongoDB](http://www.mongodb.org/)。
  ``` bash
  git clone https://github.com/chemzqm/blog
  cd blog
  ```
* 如果不是 Ubuntu 系统，需要编辑`Makefile`将`notify-send`替换为对应的桌面提醒工具，例如[growl](http://growl.info/)
* 编辑配置文件`lib/config/index.js `和`lib/views/layout.jade`，修改为你想要的。
* 创建文件 `lib/config/password` 在第一行输入你的后台密码(服务启动后会被自动加密，支持在线修改)。
* 运行：
  ``` bash
  npm install #安装依赖模块
  make compile #合并压缩资源文件
  make start #启动服务
  ```
* 安装[watch](https://github.com/visionmedia/watch)可完成自动压缩打包，例如运行：
  ```bash
  watch -q make compile &
  ```
* 安装Chrome插件[livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)，可让浏览器自动重加载编辑过的文件（`make start`会同时启动`tiny-lr`服务，启用插件可让页面连接到此服务）
* 运行`make stop`停止服务

##工具

* [Akismet](https://akismet.com/) 过滤垃圾评论服务。
* [Postmark](https://postmarkapp.com/) 有新评论或者他人冒充管理员登陆会向你发邮件通知。

##部署

* 可使用[Appfog](https://www.appfog.com/)的服务将应用部署到公网，不过要注意添加环境变量`NODE_PATH`为`lib`，而且在上面绑定自己的域名需要收费，最低20$一个月。

* 或者购买VPS服务，我用的是[42qu]()

##licence

MIT
