/*
 * GET admin home page.
 */
var express = require ('express');
var Post = require('db').Post;
var app = module.exports = express();
var moment = require ('moment');
var gravatar = require('gravatar');
var config = require('config');
var util = require('../util');
var marked = require('color-marked');

var akismet_options = {
  apikey: config.get('akismet key'), // required: your akismet api key
  blog: config.get('site url'), // required: your root level url
  headers:  // optional, but akismet likes it if you set this 
  {
    'User-Agent': 'testhost/1.0 | node-akismet/0.0.1'
  }
}

var Akismet = require('node-akismet').Akismet(akismet_options);


app.set('views', __dirname);
app.set('view engine', 'jade');

function commentArgs (req) {
  var args = {
    blog: config.get('site url'),
    user_ip: req.ip,
    user_agent: req.get('User-Agent'),
    referrer: req.get('referer'),
    comment_type: 'comment',
    comment_author: req.body.author,
    comment_author_email: req.body.email,
    comment_author_url: req.body.site,
    comment_content: req.body.body
  }
  return args;
}
var loadPost = util.loadPost;
var merge = util.merge;
var authenticate = util.authenticate;

//post comment
app.post('/comment/:id', express.csrf(), loadPost, function(req, res, next) {
  var args = commentArgs(req);
  Akismet.isSpam(args, function(isSpam) {
    if(isSpam){
      return next(new Error('Spam detected ' + req.body.body));
    }
    var post = req.Post;
    var comment = merge({}, req.body);
    comment.avatar = gravatar.url(comment.email, { s:'48', r:'pg', d: 'mm' }, true);
    post.addComment(comment, function(err) {
      if (err) { return next(err); }
      res.json(200 ,{ success: true });
    });
  })
});

//remove comment
app.get('/comment/remove/:id', authenticate, loadPost, function (req, res, next) {
  var post = req.Post;
  var id = req.param('cid');
  post.removeComment(id, function(err) {
    if(err){ return next(err); }
    res.redirect('/comments');
  })
});


//get all comment list
app.get('/comments', authenticate, function(req, res, next) {
  Post.listAll({ hide: false }, function(err, posts) {
    var comments = [];
    posts.forEach(function(p) {
      if(p.comments){
        p.comments.forEach(function(c) {
          c.pid = p._id;
          comments.push(c);
        });
      }
    });
    comments.sort(function(a, b) {
      return moment(a.date).isBefore(b.date);
    });
    res.render('comment', {
      title: 'comment management',
      comments: comments,
      marked: marked,
      moment: moment
    });
  })
});
