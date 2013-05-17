/*
 * view post
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require('moment');
var marked = require('color-marked');
var path = require('path');
var fs = require('fs');
var util = require('../util');


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

var authenticate = util.authenticate;
var loadPost = util.loadPost;
//create/modify post
app.post('/post', authenticate, loadPost, function(req, res, next) {
  var post = req.Post;
  if (!post) { return next(); }
  util.merge(post, req.body);
  post.save(function(err) {
    if (err) { return next(err); }
    if (req.xhr) {
      return res.send({ success: true, id: post._id });
    }
    res.redirect('/admin');
  });
}, function(req, res, next) {
  //insert new post
  var data = util.merge({}, req.body);
  var post = new Post(data);
  post.save(function (err) {
    if (err) { return next(err); }
    if (req.xhr) {
      return res.send({ success: true, id: post._id});
    }
    res.redirect('/admin');
  })
});

app.get('/post', authenticate, function(req, res, next) {
  res.render('post', {
    title:'Create new post'
  })
});

app.get('/post/remove/:id', authenticate, loadPost, function(req, res, next) {
  var post = req.Post;
  post.remove(function(err) {
    if(err){ return next(err); }
    res.redirect('/admin');
  })
});

app.get('/post/edit/:id', authenticate, loadPost, function(req, res, next) {
  var post = req.Post;
  res.render('edit', {
    title: 'Edit blog',
    post: post
  })
});

