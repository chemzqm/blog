/*
 * GET home page.
 */
var express = require ('express');
var Post = require('db').Post;
var fs = require ('fs');
var app = module.exports = express();
var moment = require('moment');
var marked = require('color-marked');
var config = require ('config');


app.set('views', __dirname);
app.set('view engine', 'jade');

function filter (text, number) {
  var max = 20;
  var lines = text.split('\r\n');
  if (lines.length < max) {
    return marked(text);
  }
  else{
    var i = 0;
    var code = false
    for (; i < lines.length; i++) {
      var line = lines[i];
      if(/^```\s+\w+/.test(line)){
        code = true;
      }else if(/^```\s*$/.test(line)){
        code = false;
      }
      if (i > max && /^\s*$/.test(line)) {
        break;
      }
    }
    text = lines.slice(0, i).join('\r\n');
    if(code === true){
      text += '```\r\n';
    }
    return marked(text) + '<p><a href="/v/' + number + '" class="more">阅读更多</a></p>'
  }
}

app.get(/^\/(?:p\/(\w)+)?$/, function(req, res, next) {
  var page = req.params[0]||0;
  var options = {
    criteria : {
      hide: false
    },
    page : page,
    perPage: 5
  }
  Post.count( options.criteria, function(err, count) {
    if(err) { return next(err); }
    var pageCount = Math.ceil(count/options.perPage);
    Post.list(options ,function(err, posts) {
      res.render('index', { 
        title: config.get('site title'),
        posts: posts,
        filter: filter,
        page: page,
        count: pageCount,
        moment: moment
      });
    });
  })
});

app.get('/archive', function(req, res, next) {
  Post.listAll({ hide:false }, function(err, posts) {
    if(err) { return next(err); }
    res.render('archive', {
      title: config.get('site title') + '> 文章存档',
      posts: posts,
      moment: moment
    });
  })
});


app.get('/about', function(req, res, next) {
  var content;
  fs.readFile(__dirname + '/about.md', 'utf-8', function(err, data) {
    if(err){
      content = '<p>没有找到文件 about.md ，请手工添加。</p>'
    }else{
      content = marked(data);
    }
    res.render('about', {
      title: config.get('site title') + '> 关于我',
      content: content
    });
  });
});
