var express = require ('express');

var app = module.exports = express();

var checkPass = require('./password.js').checkPass;

app.configure(function() {
  app.set('db uri','mongodb://localhost/blog');
  app.set('user', 'admin');
  //github
  app.set('Github ID', '36de6a984177f2c758fe');
  app.set('Github Secret', 'cdfce11a1f92b7c735936811d214c72e0fe54660');
  app.set('validate', function(user, password, cb) {
    checkPass(password, function(res) {
      if( user !== app.get('user') || !res ){
        return cb(new Error('User and pass doesn\'t match'));
      }
      cb();
    })
  });
})


app.configure('test',function() {
  app.set('db uri','mongodb://localhost/blog_test');
  app.set('validate', function(user, password, cb) {
    if(user !== 'admin' && password !=='admin' ){
      return cb(new Error('User and pass doesn\'t match'));
    }
    cb(null);
  });
})

