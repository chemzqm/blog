var express = require ('express');
var config = require ('config');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/login', function(req, res) {
  res.render('login', {
    title:'login'
  });
});

app.post('/login', function(req, res, next) {
  var name = req.param('name');
  var pass = req.param('password');
  var validate = config.get('validate');
  validate(name, pass, function(err) {
    if (err) { return next(err); }
    res.cookie('name', name,{ path: '/' });
    //identify login state
    req.session.user = name;
    res.redirect('/admin');
  })
});
