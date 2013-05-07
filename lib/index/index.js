/*
 * GET home page.
 */
var express = require ('express');
var post = require('post-api');
var app = module.exports = express();
var moment = require('moment');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  post.getPosts(function(err, posts) {
    res.render('index', { 
      title: 'Express',
      posts: posts,
      moment: moment
    });
  })
});
