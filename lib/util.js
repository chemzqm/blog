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
  var criteria;
  if(id){
    criteria = { _id: id }
  }else if(req.param('number')){
    var number = req.param('number');
    criteria = { number: Number(number) };
  }else{
    return next();
  }
  Post.load(criteria, function(err, post) {
    if (err) { return next(err); }
    if(!post) {
      return res.redirect('/404.html');
    }
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

