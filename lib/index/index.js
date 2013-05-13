/*
 * GET home page.
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require('moment');
var marked = require('color-marked');

app.set('views', __dirname);
app.set('view engine', 'jade');

function filter (text, id) {
  var lines = text.split('\r\n');
  if (lines.length < 20) {
    return marked(text);
  }
  else{
    var i = 15;
    for (; i < lines.length; i++) {
      if (/^\s*$/.test(lines[i])) {
        break;
      }
    }
    text = lines.slice(0, i).join('\r\n');
    return marked(text) + '<p><a href="/view/post/' + id + '" class="more">阅读更多</a></p>'
  }
}

app.get('/', function(req, res) {
  Post.listAll( {hide : false} ,function(err, posts) {
    res.render('index', { 
      title: 'Express',
      posts: posts,
      filter: filter,
      moment: moment
    });
  })
});
