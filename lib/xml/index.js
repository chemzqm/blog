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

app.get('/atom', function(req, res) {
  post.getPosts(function(err, posts) {
    res.render('atom', { 
      title: 'Express',
      posts: posts,
      moment: moment
    });
  })
});
