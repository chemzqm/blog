var Post = require('db').Post;
var mongoose = require('mongoose');


var articles = [{
  title: '使用jekyll和github搭建个人博客，感觉舒服多了',
  file: 'posts/2013-03-05-blog-live.md',
  create: '2013-03-05',
  tags: 'github,jekyll',
  hide: false
}, {
  title: '实践：为jekyll构建的博客添加基础功能',
  file: 'posts/2013-03-08-blog-enhance.md',
  create: '2013-03-08',
  tags: 'jekyll',
  hide: false
}, {
  title: '那些年我们用的工具（Linux安装脚本，不定期更新）',
  file: 'posts/2013-03-10-linux-tools-install.md',
  create: '2013-03-10',
  tags: 'linux',
  hide: false
}, {
  title: 'grunt快速上手',
  file: 'posts/2013-03-13-grunt-quick-learn.md',
  create: '2013-03-13',
  tags: 'node',
  hide: false
}, {
  title: '为什么我喜欢vim',
  file: 'posts/2013-03-27-why-vim.md',
  create: '2013-03-27',
  tags: 'vim',
  hide: false
}, {
  title: '若干脚本语言的计算效率对比测试',
  file: 'posts/2013-04-03-script-language-compute-compare.md',
  create: '2013-04-03',
  hide: false
}, {
  title: '后端友好的自动重加载服务tiny-lr',
  file: 'posts/2013-04-21-tiny-lr.md',
  create: '2013-04-21',
  tags: 'node',
  hide: false
}, {
  title: '我们正在经历的技术变革',
  file: 'posts/2013-05-01-celebrate.md',
  create: '2013-05-01',
  tags: '思考',
  hide: false
}];

var count = articles.length;
var finished = 0;
var fs = require ('fs');
var path = require ('path');

function savePosts () {
  articles.forEach(function (post) {
    fs.readFile(path.resolve(__dirname, post.file), 'utf-8',function(err, content) {
      if(err){ throw err; }
      post.content = content;
      var p = new Post(post);
      p.save(function(err) {
        finished = finished + 1;
        if(finished === count){
          console.log('finished');
          process.exit();
        }
      });
    });
  });
}

Post.remove({}, function (err) {
  if(err){ throw err; }
  savePosts();
});
