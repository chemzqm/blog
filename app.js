/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , http = require('http')
  , fs = require ('fs')
  , path = require('path');

var app = express();
var config = require('config');

var routes = ['admin', 'post', 'index', 'comment',
  'xml', 'validate'];

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  var env = app.get('env');
  if(env === 'development'){
    app.use(express.logger('dev'));
  }else if(env === 'production'){
    app.use(express.logger());
  }
  app.use(express.bodyParser({ uploadDir :'./public/upload/'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  // express/mongo session storage
  app.use(express.session({
    secret: 'my!blog',
    store: new mongoStore({
      url: config.get('db uri'),
      collection : 'sessions'
    })
  }));
  routes.forEach(function(m) {
    app.use(require(m));
  });
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(function (err, req, res, next) {
    if (req.xhr) {
      var errs = getErrors(err);
      return res.json(200, {
        success: false,
        error: errs
      });
    }
    next(err);
  })
  app.use(express.errorHandler());
});

function getErrors (err) {
  if ( err.name !== 'ValidationError' ) {
    return err.message;
  }
  var errs = [];
  for(var i in err.errors){
    errs.push(err.errors[i].type);
  }
  return errs;
}

var init = require ('import');

var server = http.createServer(app).listen(app.get('port'), function(){

  var pidfile = 'blog.pid';
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
    process.exit();
  });

  process.on('SIGTERM', function() {
    return process.exit(0);
  });

  process.on('SIGINT', function() {
    return process.exit(0);
  });

});

