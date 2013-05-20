这篇文章的目标是帮助大家快速上手grunt，适用的grunt版本为0.4.x，本文只是大致介绍,如果想做深入了解请阅读[grunt官方文档](http://gruntjs.com/getting-started)。

##安装grunt命令行工具

首先确保你的node版本在0.8以上(暂时不建议适用0.10.0)，命令：
``` bash
node -v
```
然后安装grunt命令行工具grunt-cli
``` bash
npm install -g grunt-cli
```

可能需要前面加上sudo（例如 OSX, *nix）。

如果你只前装过grunt的老版本的话则需要卸载：
``` bash
npm uninstall -g grunt
```

##安装grunt模板

grunt模板的作用是帮助你生成初始的Gruntfile.js文件，当然你也可以直接把其它项目的Gruntfile.js文件拷贝过来使用。

首先要安装命令行工具grunt-init：
``` bash
npm install -g grunt-init
```
然后安装模板，目前有三种模板是由grunt官方做维护的，还有别的可在github上找到，或者你自己实现一个。 官方模板的安装命令如下：
``` bash
git clone git://github.com/gruntjs/grunt-init-gruntfile.git $HOME/.grunt-init/
git clone git://github.com/gruntjs/grunt-init-jquery.git $HOME/.grunt-init/
git clone git://github.com/gruntjs/grunt-init-node.git $HOME/.grunt-init/
```
三种分别对应默认grunt模板，jquery插件的grunt模板，node包的grunt模板。

然后就可以适用grunt-init命令来初始化你的Gruntfile.js文件了，例如你要安装默认模板：
``` bash
grunt-init grunt-init-gruntfile #最后一个参数也可以是模板所在的文件夹
```

它会问你一些问题，然后根据你的答案创建当前项目的Gruntfile.js文件。

##安装所需node包

首先是创建package.json文件(npm的[包管理配置文件](https://npmjs.org/doc/json.html)）。
你可以使用`npm init`命令创建这个文件或者直接拷贝其它项目的。

然后在项目的根目录下安装你开发依赖的各种grunt包，首先是grunt：
``` bash
npm install grunt --save-dev
```
`--save-dev`可以将你所安装的包自动保存到package.json文件中的`devDependencies`属性中去，如果你的项目使用时（不仅仅是开发）也需要用到某个包，
你应该使用`--save`将其保存在`dependcies`属性中。

你肯定要用到需要其它grunt模块来帮你完成构建任务，这时你就可以用这种方法把他们都加到项目中，例如最常用的`concat` `jshint` `uglify`模块：
``` bash
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-uglify --save-dev
```

还有种方式就是先把依赖的包写到package.json中的`devDependencies`中去，然后直接使用`npm nistall`来安装。

##编辑Gruntfile.js文件使之工作

我们以本站当前使用的Gruntfile.js为例来了解一下grunt设置中最重要的部分。

``` javascript
var path = require('path');
var snippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    concat: {
      dist: {
        src: ['javascripts/common.js','javascripts/respond.js'],
        dest: 'javascripts/main.js'
      }
    },
    uglify: {
      options: {
        banner: '/*script for site: http://chemzqm.me*/'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'javascripts/main.min.js'
      }
    },
    cssmin: {
      compress:{
        files:{
          "stylesheets/styles.min.css":["stylesheets/styles.css"]
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {
          jQuery: true
        }
      },
      all: ['javascripts/common.js','Gruntfile.js']
    },
    regarde: {
      livereload: {
        files: ['_posts/*.md', 'javascripts/common.js', 'stylesheets/styles.css', '*.html'],
        tasks: ['default', 'livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 8000,
          middleware: function(connect, options) {
            return [snippet, connect.static(path.resolve(process.cwd(), '_site'))];
          }
        }
      }
    },
    bgShell:{
      jekyll:{
        cmd: 'jekyll'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'bgShell:jekyll']);
  // start livereload server
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);

};
```

* `module.exports`指向调用该模块时将返回的对象，而当你使用`grunt`命令的时候这个名为`Gruntfile.js`的文件就会被`grunt`找到（0.4.0以上会找Gruntfile.js,而之前是`grunt.js`，具体的找法也很简单，就是从运行命令的目录开始一直往上找，直到找到为止）,然后以`grunt`对象为参数执行该模块返回的函数。
 
* `grunt.initConfig`方法接受一个Plain Object做为参数，该对象的每个属性名代表一个顶层task名字，而值则是具体的配置。配置任务时要注意不能把子任务名配置成任务要读取的配置属性，例如uglify需要options做为配置属性，这时就不能把子任务名也设置成options。如果任务是`multitask`则可以为一个任务配置多个子任务，例如配置多个合并文件的任务：

        concat: {
          dist: {
            src: ['javascripts/common.js','javascripts/respond.js'],
            dest: 'javascripts/main.js'
          },  
          dist2:{
            src: ['javascripts/*.js'],
            dest:'javascripts/all.js'
          }   
        },

    这样你就可以通过`grunt concat`来顺序执行两个合并任务，或者`grunt concat:dist`只执行`dist`任务。上面用到的任务都是`multitask`，具体实践的时候从文档或者源码都可以判断。此外，grunt还支持文件名的模式匹配和模板替换的功能,例如匹配所有js文件可以用`*.js`，想引用`concat:dist`任务的`dist`属性可以用`<%= concat.dist.dest %>`, 详细的说明还请阅读[官方文档](https://github.com/gruntjs/grunt/wiki/Configuring-tasks)。
  
* `grunt.loadNpmTasks`负责载入npm模块定义的任务，grunt 0.4.0之后没有了核心任务，所以每个任务都需要开发者写代码载入（还有一个`grunt.task.loadTasks`方法用来加载指定目录task文件,具体参阅[task官方文档](https://github.com/gruntjs/grunt/wiki/grunt.task)）。

* `grunt.registerTask`用来注册新的任务，它最简单的形式如下：
    grunt.task.registerTask(taskName, taskList)
名为`taskname`的任务出发后,`tasklist`数组(grunt 0.4.0之前是空格分格的字符串)中的任务将被顺序执行， 比较特殊的是名为`default`的任务，它将在命令行输入`grunt`后被调用。`grunt.registerTask`和`grunt.registerMultiTask`还可通过传入函数的方式创建新的任务，具体参阅[创建task文档](https://github.com/gruntjs/grunt/wiki/Creating-tasks)。

最后重点介绍一下[livereload模块](https://github.com/gruntjs/grunt-contrib-livereload),这个模块分两个任务`liveload-start`和`liveload` ,前一个任务启动livereload服务，后一个任务负责通知浏览器进行刷新。livereload本身不提供文件的web服务，所以我们需要connect任务插件来提供。然后通过`require('grune-contrib-livereload/lib/utils').livereloadSnippet`获取到`livereload`插件提供的中间件函数(实质上就是参数为`req, res, next`的函数)，然后配置到`connect`的`middleware`参数中，这时请求connect服务
(http://localhost:8000) 得到的html就会被动态的加入负责与`livereload`服务端通讯的一段代码。`grunt-regarde`模块负责监控文件变化（不用`grunt-watch`是因为那个获得不了变化的文件名）,这里我们根据需要配置成每当文件变化后就执行`default`任务和`livereload`任务。最后，配置

    grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);

就可以通过`grunt server`命令同时启用liveload, connect, 和regard服务(顺序可以任意)

grunt已经开始被越来越多的知名项目所使用了(例如jquery和AngularJS)，而且它的任务插件也在不断的扩展之中(例如coffeescript, jade, stylus)。虽说相比Makefile笨拙了一些，但更容易满足团队中各种操作系统下开发的需要。
