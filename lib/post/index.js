/*
 * view post
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require('moment');
var marked = require('color-marked');
var path = require('path');
var fs = require ('fs');


app.set('views', __dirname);
app.set('view engine', 'jade');

moment.lang('zh-cn');

app.get('/view/post/:id', express.csrf(),function(req, res, next) {
  var id = req.params.id;
  Post.load(id, function(err, post) {
    if(err){ return next(err); }
    post.html = marked(post.content);
    res.render('index',{
      title: post.title,
      post: post,
      moment: moment,
      marked: marked,
      csrf: req.session._csrf
    });
  })
});

app.post('/uploadimg', express.csrf(), function(req, res, next) {
  var file = req.files.uploadingFile;
  var name = file.name;
  var targetPath = file.path + path.extname(name);
  fs.rename(file.path, targetPath, function(err) {
    if(err){ return next(err); }
    res.send({
      success: true,
      filepath: targetPath.replace(/^public/, '')
    });
  });
});
