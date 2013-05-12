var express = require ('express');
var config = require('config');
var Post = require('db').Post;
var app = module.exports = express();
var ejs = require('ejs');
var moment = require('moment');

app.set('views', __dirname);
//app.set('view engine', 'jade');

app.engine('ejs', ejs.renderFile);

app.locals({
  site : {
    title : config.get('site title'),
    url : config.get('site url'),
    author : {
      name: config.get('author name'),
      email: config.get('author email')
    }
  }
});

app.get('/atom', function(req, res, next) {
  Post.listAll({ hide: false }, function(err, posts) {
    if(err){ return next(err); }
    res.set('Content-type', 'text/xml');
    res.render('atom.ejs', { 
      posts: posts,
      moment: moment
    });
  });
});

app.get('/sitemap', function(req, res, next) {
  Post.listAll({ hide: false }, function(err, posts) {
    if(err){ return next(err); }
    res.set('Content-type', 'text/xml');
    res.render('sitemap.ejs', { 
      posts: posts,
      moment: moment
    });
  });
});
