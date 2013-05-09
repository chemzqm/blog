/*
 * GET home page.
 */
var express = require ('express');
var post = require('post-api');
var app = module.exports = express();
var ejs = require('ejs');
var moment = require('moment');

app.set('views', __dirname);
//app.set('view engine', 'jade');

app.engine('ejs', ejs.renderFile);

app.locals({
  site : {
    title : "Qiming's blog",
    author : {
      name: '赵启明',
      email: 'chemzqm@gmail.com'
    },
    url : "http://chemzqm.me"
  }
});

app.get('/atom', function(req, res) {
  post.getPosts(function(err, posts) {
    res.set('Content-type', 'text/xml');
    res.render('atom.ejs', { 
      title: 'Express',
      posts: posts,
      moment: moment
    });
  })
});
