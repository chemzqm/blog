
/*
 * GET admin home page.
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require ('moment');
var gravatar = require('gravatar');




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
  var expire = moment(req.session.vartify_expires);
  if (validate !== req.session.verifycode ) {
    return next(new Error('验证码不正确'));
  }
  if (moment().isAfter(req.session.vertify_expires)) {
    return next(new Error('验证码已过期'));
  }
  var comment = merge({}, req.body);
  comment.avatar = gravatar.url(comment.email, { s:'48', r:'pg', d: 'mm' }, true);
  post.addComment(comment, function(err) {
    if (err) { return next(err); }
    res.json(200 ,{ success: true });
  })
});

app.delete('/comment/:id', loadPost, function (req, res, next) {
  res.json(200, { success: true });
});

