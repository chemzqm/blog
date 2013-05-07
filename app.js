/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require ('fs')
  , path = require('path');

var app = express();

var index = require('index');
var post = require('post');
var admin = require('admin');
var rss = require('rss');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser())
  app.use(express.session( { secret : 'B1!k'}));
  app.use(index);
  app.use(post);
  app.use(admin);
  app.use(rss);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
