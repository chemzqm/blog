var crypto = require ('crypto');
var fs = require ('fs');
//encrypt password
var passfile = __dirname + '/password';
var pass = 'admin'// default password
var hash_password;

function encrypt (password) {
  var salt = '88888888';
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

function encryptFile (password, cb) {
  hash_password = encrypt(password);
  fs.writeFile(passfile, 'enc:' + hash_password, 'utf-8', function (err) {
    if (err) { throw err; }
  });
  if (cb) {
    cb();
  }
}
//enctype the password file if it's not encrypted
function setPass (cb) {
  fs.readFile(__dirname + '/password','utf-8' ,function(err, data) {
    if (err) { throw err; }
    data = data.replace(/\n/, '');
    if (!/^enc:/.test(data)) {
      encryptFile(data, cb);
    } else {
      hash_password = data.replace(/^enc:/, '');
    }
  });
}

fs.stat(passfile , function(err, stats) {
  var cb = function() {
    fs.watch(passfile, function(e, filename) {
      setPass();
    })
  }
  if (err) {
    return encryptFile(pass, cb);
  } else {
    setPass(cb);
  }
})

exports.checkPass = function (pass, fn) {
  var res =  ( encrypt(pass) === hash_password ) ? true : false;
  fn(res);
}
