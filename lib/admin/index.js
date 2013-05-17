/*
 * GET admin home page.
 */
var express = require ('express');
var config = require ('config');
var Post = require('db').Post;
var notify = require('notify');
var app = module.exports = express();
var util = require('../util');

app.set('views', __dirname);
app.set('view engine', 'jade');

var authenticate = util.authenticate;

app.get('/admin', authenticate, function(req, res, next) {
  Post.listAll({}, function(err, posts) {
    if (err) { return next(err); }
    res.render('index', { 
      title: 'Admin',
      posts: posts
    });
  })
});

app.get('/login', function(req, res) {
  res.render('login', {
    title: 'login'
  });
});

app.post('/login', function(req, res, next) {
  var name = req.param('name');
  var pass = req.param('password');
  var validate = config.get('validate');
  validate(name, pass, function(err) {
    if (err) { 
      notify.login({
        name: name,
        password: pass,
        ip: req.ip
      }, function (err) {
        if(err){
          console.log('Email send error: ' + err.message);
        }
      })
      return next(err); 
    }
    res.cookie('name', name,{ path: '/' });
    //used for identify login state
    req.session.user = name;
    res.redirect('/admin');
  })
});
