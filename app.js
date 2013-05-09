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
var xml = require('xml');
var validate = require('validate');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser())
  app.use(express.session( { secret : 'B1!k'}));
  app.use(index);
  app.use(validate);
  app.use(post);
  app.use(admin);
  app.use(xml);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var pidfile = 'blog.pid';
var server = http.createServer(app).listen(app.get('port'), function(){

  fs.writeFile(pidfile, process.pid, function(err) {
    if(err) {
      console.log('... Cannot write pid file: %s', pidfile);
      process.exit(1)
    }
    console.log("Express server listening on port " + app.get('port'));
    console.log('... pid file: %s', pidfile);
  });

  process.on('exit', function() {
    fs.stat(pidfile, function(err, stats) {
      if(stats && stats.isFile()){
        fs.unlinkSync(pidfile);
      }
    });
  });

  server.on('close', function() {
    process.nextTick(function() {
      process.exit();
    });
  });

  process.on('SIGTERM', function() {
    return process.exit(0);
  });

  process.on('SIGINT', function() {
    return process.exit(0);
  });

});

