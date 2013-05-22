/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , http = require('http')
  , fs = require ('fs')
  , ejs = require ('ejs')
  , path = require('path');

var app = express();
var config = require('config');

var routes = ['admin', 'post', 'index', 'comment',
  'xml', 'validate'];

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/lib/views');
  app.engine('ejs', ejs.renderFile);
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
  app.use(express.bodyParser({ uploadDir : __dirname + '/public/upload/'}));
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
  var maxAge = app.get('env') === 'production' ? 31557600000 : 0;
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: maxAge }));
  app.use(function (err, req, res, next) {
    if (req.xhr) {
      var errs = getErrors(err);
      return res.json(200, {
        success: false,
        error: errs
      });
    }
    next(err);
  });
});

app.configure('production', function () {
  //404
  app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404.ejs', { url: req.url });
      return;
    }
    if (req.accepts('json')) {
      res.send({success:false ,message: 'Not found' });
      return;
    }
    res.type('txt').send('Not found');
  });
  //500
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(req.accepts('html')){
      res.render('500.ejs', { error: err});
      return;
    }
    if(req.accepts('json')){
      res.send({success:false ,message: err.message});
      return;
    }
    res.type('txt').send(err.message);
  })
});

app.configure('development', function(){
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

var server = http.createServer(app).listen(app.get('port'), function(){
  if (app.get('env') !== 'development') {
    return;
  }
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

