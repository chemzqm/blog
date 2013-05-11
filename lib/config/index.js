var express = require('express');
var fs = require ('fs');
var crypto = require ('crypto');

var app = module.exports = express();

//encrypt password
var passfile = __dirname + '/password';
var pass = 'admin'// default password

function encrypt (password) {
  var salt = '88888888';
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

function encryptFile (password, cb) {
  var hash_password = encrypt(password);
  app.set('password', hash_password);
  fs.writeFile(passfile, 'enc:' + hash_password, 'utf-8', function(err) {
    if(err){ throw err; }
  });
  if(cb) cb();
}
//enctype the password file if it's not encrypted
function setPass (cb) {
  fs.readFile(__dirname + '/password','utf-8' ,function(err, data) {
    if(err){ throw err; }
    data = data.replace(/\n/, '');
    if(!/^enc:/.test(data)){
      encryptFile(data, cb);
    }else{
      app.set('password', data.replace(/^enc:/, ''));
    }
  });
}

fs.stat(passfile , function(err, stats) {
  var cb = function() {
    fs.watch(passfile, function(e, filename) {
      setPass();
    })
  }
  if(err){
    return encryptFile(pass, cb);
  }else{
    setPass(cb);
  }
})

app.configure(function() {
  app.set('db uri','mongodb://localhost/blog');
  app.set('user', 'chemzqm');
  //github
  app.set('Github ID', '36de6a984177f2c758fe');
  app.set('Github Secret', 'cdfce11a1f92b7c735936811d214c72e0fe54660');
  app.set('validate', function(user, password, cb) {
    var hash_password = encrypt(password);
    if(user !== app.get('user') || hash_password !== app.get('password')){
      return cb(new Error('User and pass doesn\'t match'));
    }
    cb(null);
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


