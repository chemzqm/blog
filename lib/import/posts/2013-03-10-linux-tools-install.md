介绍一下做为前端开发的我常用的命令行工具，node包，以及前端类库。说是Linux安装脚本，其实只适用于Debain（Ubuntu）系列, 因为我现在基本上只用Ubuntu，而且我也不喜欢把事情搞太复杂。

[[如果你某个工具感兴趣，还请到官网认真学习，这里就不多罗嗦了。还有要注意部分工具需要根据个人喜好进行配置，]](例如：vim， mutt， git，bash)， 这些工具的配置我都会放到Ubuntu One中帮我做自动同步(方便重装系统，以及不同机器共享)，工具设置非常重要，好的设置可以让你事半功倍，但是篇幅限制就不在这里介绍了。

``` bash
#! /bin/bash

#mutt 最好用的电子邮件程序
sudo apt-get -y install msmtp-mta msmtp mutt getmail4 procmail lynx wv w3m
mkdir -p ~/Mail
(cd ~/Mail && touch inbox sent postponed)
touch ~/.msmtprc
chmod -v 600 ~/.msmtprc
chmod -v 700 ~/.getmail


#ssh 最常用的安全通信工具
sudo apt-get -y install ssh
mkdir -p ~/.ssh
touch ~/.ssh/config
chmod -v 600 ~/.ssh/config
cat << EOF > ~/.ssh/config
TCPKeepAlive=yes
ServerAliveInterval=60
ServerAliveCountMax=6
StrictHostKeyChecking=no
Compression=yes
ForwardAgent=yes
EOF

#node http://nodejs.org/ 稳定源 服务端的JS环境
sudo apt-get -y install python-software-properties
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -y install nodejs npm

#mongodb http://www.mongodb.org/ 稳定源 轻量级的nosql数据库
wget http://docs.mongodb.org/10gen-gpg-key.asc
sudo apt-key add 10gen-gpg-key.asc
sudo sh -c 'echo deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen > /etc/apt/sources.list.d/10gen.list'
sudo apt-get update
sudo apt-get -y install mongodb-10gen

#git 最强版本控制系统
sudo apt-get -y install git
git config --global user.name "chemzqm"
git config --global user.email "chemzqm@gmail.com"
rm -rf ~/.ssh
ssh-keygen -t rsa -C "chemzqm@gmail.com" 
#将屏幕输出的key加入github
cat ~/.ssh/id_rsa.pub
read -p continue?
ssh -T git@github.com

#shutter 截图工具
sudo add-apt-repository ppa:shutter/ppa
sudo apt-get update 
sudo apt-get install shutter

#tools
#vim Linux系统最常用编辑器，ubuntu默认带的是阉割版的vim来做为vi的替代品
#ctags 产生标记文件以帮助编辑器在源文件中定位对象
#xmlstarlet 编辑xml的命令行工具，自动化脚本有用
#curl 从url获取数据的强大自动化工具，支持多种协议
#axel 轻量的多线程下载工具
#imagemagick 用于创建、修改和显示图片的二进制工具包
#privoxy 代理工具，可以用来设置转发，修改请求头，改变响应内容等等
#colordiff 用来代替默认diff显示彩色结果，可做为svn的默认diff工具
#subversion SVN代码管理命令行工具
#pngcrush png图像优化工具，主要用于压缩
#jpegoptim jpeg图像压缩优化工具
#expect 对交互式应用提供进行可编程会话的工具，例如自动化需要密码的ssh登录
sudo apt-get -y install vim ctags dos2unix xmlstarlet curl axel imagemagick privoxy colordiff subversion pngcrush jpegoptim expect
sudo apt-get -y install phantomjs
sudo sh -c 'echo forward-socks5 / 127.0.0.1:8888 . >> /etc/privoxy/config'
#设置svn使用colordiff
mkdir -p ~/.subversion
cat << EOF > ~/.subversion/config
[helpers]
diff-cmd = colordiff
EOF

#phantomjs 基于webkit内核的无头浏览器,这里下的是32位的(默认包安装的版本太老了)
version=1.8.2
wget http://phantomjs.googlecode.com/files/phantomjs-${version}-linux-i686.tar.bz2
tar -jxf phantomjs-${version}-linux-i386.tar.bz2
mkdir -p ~/programs
mv phantomjs-${version}-linux-i686 ~/programs/phantomjs
cd ~/bin
ln -s ~/programs/phantomjs/bin/phantomjs

#apache + php + mysql 常用web服务组件
sudo apt-get -y install apache2 php5 libapache2-mod-php5 mysql-server libapache2-mod-auth-mysql php5-mysql apache2.2-common
sudo sh -c 'echo "<?php phpinfo(); ?>" > /var/www/info.php'
firefox http://localhost/info.php &

#sublime text 一款编辑器
sudo add-apt-repository -y ppa:webupd8team/sublime-text-2  
sudo apt-get update  
sudo apt-get -y install sublime-text

#node相关工具
mkdir -p ~/programs ~/bin
cd ~/programs
#node-dev 代替node命令调试服务，会监测源码改变自动重启服务
git clone git://github.com/fgnass/node-dev.git
(cd node-dev && npm install)
(cd ~/bin && ln -s ~/programs/node-dev/node-dev)
#mon https://github.com/visionmedia/mon 单线程监控程序, 轻量级C程序
git clone git://github.com/visionmedia/mon.git
(cd mon && sudo make install)
#mongroup https://github.com/jgallen23/mongroup 线程组监控程序
git clone git://github.com/jgallen23/mongroup.git
(cd mongroup && sudo make install)
#UglifyJS JS压缩美化必备，支持source-map
git clone git://github.com/mishoo/UglifyJS.git
(cd UglifyJS && sudo make install)
(cd ~/bin && ln -s ~/programs/UglifyJS/bin/uglifyjs)
#jshint JS代码检查工具
sudo npm install -g jshint 
#coffee-script coffeescript编译器
sudo npm install -g coffee-script
#mocha http://visionmedia.github.com/mocha 简单、灵活、有趣的测试框架，支持node和浏览器环境
sudo npm install -g mocha 
#docco http://jashkenas.github.com/docco/ 生成左右注释和代码左右对照的html页面，注释通过markdown解析器解析，源码通过Pygments高亮
sudo npm install -g docco 
#grunt http://gruntjs.com/ 最流行的任务执行工具，包括jquery之内的很多框架和公司都在用了
sudo npm install -g grunt-cli
#queen http://queenjs.com/ 一个帮你把js代码推送到多个浏览器运行的工具，提供监控页面等辅助功能
sudo npm install -g queen
#trill http://thrilljs.com/ 利用queen帮你在多个浏览器同时跑测试
sudo npm install -g thrill
#component http://component.io 一个基于commonjs的模块化组建库
sudo npm install -g component
#sqwish https://github.com/ded/sqwish 一个简单的css压缩工具
sudo npm install -g sqwish

#jekyll http://jekyllrb.com/ 一个简单的，有blog意识的静态站点生成器，类似cms
sudo apt-get install ruby1.9.1-dev
sudo gem install jekyll
#rdiscount 一个解析markdown文本的ruby包
sudo gem install rdiscount

#vimpager http://www.vim.org/scripts/script.php?script_id=1723 使用vim来代替less做为分页器（主要是有语法高亮）
git clone git://github.com/rkitover/vimpager.git
(cd vimpager && sudo make install)

#node modules 这些是我常用的，所以放到home下面了
mkdir -p ~/modules
cd ~/modules
#jade http://github.com/visionmedia/jade#readme 基于node的一款简洁、快速、高效、强大、跨环境的模板引擎
git clone git://github.com/visionmedia/jade.git
(cd jade && npm install && cd ~/bin && ln -s ~/modules/jade/bin/jade)
#express http://expressjs.com/ 基于node的轻量级web应该开发框架
git clone git://github.com/visionmedia/express.git
(cd express && npm install && cd ~/bin && ln -s ~/modules/express/bin/express)
#sylus http://learnboost.github.com/stylus/ 提供更快，更便捷的css编写方式，比less更强
git clone git://github.com/LearnBoost/stylus.git
(cd stylus && npm install && cd ~/bin && ln -s ~/modules/stylus/bin/stylus)
#marked https://github.com:chemzqm/marked/ 只是代码高亮的（类似github）markdown解析器
git clone git@github.com:chemzqm/marked.git
(cd marked && npm install && cd ~/bin && ln -s ~/modules/marked/bin/marked)
#liveload https://github.com/chemzqm/liveload/ 监控源码变化自动更新浏览器的辅助工具
git clone git@github.com:chemzqm/liveload.git
(cd liveload && npm install && cd ~/bin && ln -s ~/modules/liveload/bin/liveload)

#前端框架和类库
mkdir -p ~/lib
cd ~/lib
#jquery 需安装grunt
git clone git://github.com/jquery/jquery.git
(cd jquery && npm install -d && grunt)
#bootstrap
git clone git://github.com/twitter/bootstrap.git
(cd bootstrap && npm install && make && make test)
#angular 需要grunt
git clone git://github.com/angular/angular.js.git
(cd angular.js && npm install && grunt)
#jasmine 测试工具
git clone git://github.com/pivotal/jasmine.git
git clone git://github.com/FortAwesome/Font-Awesome.git


#python tool
#pygments 语法高亮工具
sudo apt-get -y install python-setuptools
sudo easy_install pygments
sudo npm install -g pygments
sudo chown -R $USER:$USER ~/.npm ~/tmp


#增加文件监控数量，否则莫些方法可能报错，例如node中的：fs.watch
sudo sh -c 'echo fs.inotify.max_user_watches = 524288 > etc/sysctl.conf'
sudo sysctl -p

#安装区域设置,某些比较坑的程序需要特别的区域设置
sudo sh -c 'echo en_US.ISO-8859-1 ISO-8859-1 >> /var/lib/locales/supported.d/local'
sudo sh -c 'echo zh_CN.GBK GBK >> /var/lib/locales/supported.d/local'
sudo sh -c 'echo en_US.ISO-zh_CN.GB2312 GB2312 >> /var/lib/locales/supported.d/local'
sudo dpkg-reconfigure locales

#安装中文输入包
sudo apt-get install language-pack-zh-hans
```

这样我就再不害怕重装系统了，希望这里部分的工具也能够帮到你：）

_(完)_
