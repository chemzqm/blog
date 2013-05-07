
/*
 * GET admin home page.
 */
var express = require ('express');
var post = require('post-api');
var app = module.exports = express();
var marked = require('color-marked');


app.set('views', __dirname);
app.set('view engine', 'jade');


app.get('/view/post/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  post.getPostById(id, function(err, p) {
    p.html = marked(p.content);
    res.render('index',{
      title: p.title,
      post: p
    });
  })
});

