/*
 * GET admin home page.
 */
var express = require ('express');
var config = require ('config');
var Post = require('db').Post;
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

function merge (to, from) {
  for (var i in from) {
    to[i] = from[i];
  }
  return to;
}

function authenticate (req, res, next) {
  if (app.get('env') === 'test') {
    return next();
  }
  var name = req.session.user;
  if (!name) {
    return res.redirect('/login');
  }
  next();
}

function loadPost (req, res, next) {
  var id = req.param('id');
  if (!id) { return next(); }
  Post.load(id, function(err, post) {
    if (err) { return next(err); }
    req.Post = post;
    next();
  })
}

app.get('/admin', authenticate, function(req, res, next) {
  Post.listAll({}, function(err, posts) {
    if (err) { return next(err); }
    res.render('index', { 
      title: 'Admin',
      posts: posts
    });
  })
});


app.get('/post', authenticate, function(req, res, next) {
  res.render('post', {
    title:'Create new post'
  })
})

app.post('/post', authenticate, loadPost, function(req, res, next) {
  var post = req.Post;
  if (!post) { return next(); }
  merge(post, req.body);
  post.save(function(err) {
    if (err) { return next(err); }
    if (req.xhr) {
      return res.send({ success: true, id: post._id });
    }
    res.redirect('/admin');
  });
}, function(req, res, next) {
  //insert new post
  var data = merge({}, req.body);
  var post = new Post(data);
  post.save(function (err) {
    if (err) { return next(err); }
    if (req.xhr) {
      return res.send({ success: true, id: post._id});
    }
    res.redirect('/admin');
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
    title:'Edit blog',
    post:post
  })
});
