
/*
 * GET admin home page.
 */
var express = require ('express');
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

function loadPost (req, res, next) {
  var id = req.param('id');
  if (!id) { return next(); }
  Post.load(id, function(err, post) {
    if (err) { return next(err); }
    req.Post = post;
    next();
  })
}

app.post('/comment/:id', loadPost, function(req, res, next) {
  var post = req.Post;
  var validate = req.body.validate;
  console.log(validate);
  var comment = merge({}, req.body);
  post.addComment(comment, function(err) {
    if (err) { return next(err); }
    res.json(200 ,{ success: true });
  })
});

app.delete('/comment/:id', loadPost, function (req, res, next) {
  res.json(200, { success: true });
});

