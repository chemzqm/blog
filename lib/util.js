var Post = require('db').Post;
var app = require('express')();

exports.authenticate = function (req, res, next) {
  if (app.get('env') === 'test') {
    return next();
  }
  var name = req.session.user;
  if (!name) {
    return res.redirect('/login');
  }
  next();
}

exports.loadPost = function (req, res, next) {
  var id = req.param('id');
  if (!id) { return next(); }
  Post.load(id, function(err, post) {
    if (err) { return next(err); }
    req.Post = post;
    next();
  })
}

exports.merge = function (to, from) {
  for (var i in from) {
    to[i] = from[i];
  }
  return to;
}

