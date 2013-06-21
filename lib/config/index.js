var express = require ('express');

var app = module.exports = express();

var checkPass = require('./password.js').checkPass;

app.configure(function() {
  app.set('db uri','mongodb://localhost/blog');
  app.set('user', 'admin');
  app.set('site title', 'XX');
  app.set('site url', 'http://xxx.xx');
  app.set('author name', 'YOUR NAME');
  app.set('author email', 'YOUR EMAIL');
  //评论验证服务，可屏蔽绝大部分垃圾评论
  //访问https://akismet.com/可免费注册
  app.set('akismet key',  'AKISMET KEY');
  //http邮件服务，访问https://postmarkapp.com/可免费注册
  app.set('postmark key', 'POSTMAKRT KEY');
  app.set('postmark from', 'YOUR EMAIL ADDRESS');
  app.set('postmark to', 'EMAIL ADDRESS');
  app.set('validate', function(user, password, cb) {
    checkPass(password, function(res) {
      if( user !== app.get('user') || !res ){
        return cb(new Error('User and pass doesn\'t match'));
      }
      cb();
    })
  });
})


//configuration for test environment, will overwrite the default configuration
app.configure('test',function() {
  app.set('db uri','mongodb://localhost/blog_test');
  app.set('validate', function(user, password, cb) {
    //user admin and password admin for test enviroment
    if(user !== 'admin' && password !=='admin' ){
      return cb(new Error('User and pass doesn\'t match'));
    }
    cb(null);
  });
})

