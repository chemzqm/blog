var crypto = require ('crypto');
var fs = require ('fs');
//encrypt password
var passfile = __dirname + '/password';
var hash_password;

function encrypt (password) {
  if(/^enc:/.test(password)){
    return password;
  }
  var salt = '88888888';
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

//set hash_password to password file
function encryptFile (password, cb) {
  fs.writeFile(passfile, 'enc:' + encrypt(password), 'utf-8', function (err) {
    if (err) { cb(err); }
  });
  if (cb) { cb(); }
}

//read the password
function readPass (cb) {
  fs.readFile(passfile ,'utf-8' ,function(err, data) {
    var pass = data ? data.replace(/\n/, '') : 'admin';
    cb(null, pass); 
  });
}

var initPassword = function () {
  readPass(function(err, pass) {
    var cb = function(error) {
      if(error){ throw error; }
      fs.watch(passfile, function(e, filename) {
        initPassword();
      });
    }
    if(!/^enc:/.test(pass)){
      encryptFile(pass, cb);
    }else{
      hash_password = pass.replace(/^enc:/, '');
      cb();
    }
  });
}

initPassword();

exports.checkPass = function (pass, fn) {
  var res =  ( encrypt(pass) === hash_password ) ? true : false;
  fn(res);
}
