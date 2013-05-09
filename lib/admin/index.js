/*
 * GET admin home page.
 */
var express = require ('express');
var post = require('post-api');
var app = module.exports = express();

var user = {
  name:'jack',
  pass:'Formv!ne'
}

app.set('views', __dirname);
app.set('view engine', 'jade');

function merge (to, from) {
  for (var i in from) {
    to[i] = from[i];
  }
  return to;
}

function authenticate (req, res, next) {
  var name = req.session.user;
  if (!name || name !== user.name) {
    return res.redirect('/login');
  }else{
    next();
  }
}

app.get('/admin', authenticate, function(req, res, next) {
  post.getPosts(function(err, posts) {
    if(err){ return next(err); }
    res.render('index', { 
      title: 'Admin',
      posts: posts
    });
  })
});

app.get('/login', function(req, res) {
  res.render('login',{
    title:'login'
  });
});

app.post('/login', function(req, res, next) {
  var name = req.param('name');
  var pass = req.param('password');
  if(name === user.name && pass === user.pass ){
    res.cookie('name', name,{ path: '/' });
    req.session.user = name;
    res.redirect('/admin');
  }else{
    next(new Error('Authenticate error!'));
  }
});

app.get('/post', authenticate, function(req, res, next) {
  res.render('post', {
    title:'New post'
  })
})

app.post('/post', authenticate, function(req, res, next) {
  if (!req.body.id) return next();
  var time = new Date();
  var data = merge({}, req.body);
  data.update = time;
  post.updatePost(data, function(err) {
    if(err) return next(err);
    if(req.xhr){
      res.send({ success: true, id: req.body.id });
    }else{
      res.redirect('/admin');
    }
  });
}, function(req, res, next) {
  var time = new Date();
  //insert new post
  var data = merge({}, req.body);
  data.update = data.create = time;
  post.insertPost(data, function(err, id) {
    if(err) return next(err);
    if(req.xhr){
      res.send({ success: true, id: id});
    }else{
      res.redirect('/admin');
    }
  });
});


app.get('/post/remove/:id', authenticate ,function(req, res, next) {
  var id = req.params.id;
  post.deletePost(id, function(err) {
    return err? next(err): res.redirect('/admin')
  });
});

app.get('/post/edit/:id', authenticate, function(req, res, next) {
  var id = req.params.id;
  post.getPostById(id, function(err, post) {
    if(err){ return next(err); }
    res.render('edit', {
      title:'Edit blog',
      post:post
    });
  })
});
