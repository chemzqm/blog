/*
 * GET home page.
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require('moment');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  Post.listAll( {hide : false} ,function(err, posts) {
    res.render('index', { 
      title: 'Express',
      posts: posts,
      moment: moment
    });
  })
});
