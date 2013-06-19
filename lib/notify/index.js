var Notifier = require('notifier');
var config = require('config');

var notifier = new Notifier({
  APN: false,
  email: true,
  actions: ['comment', 'login'],
  tplPath: require('path').resolve(__dirname, './template'),
  postmarkKey: config.get('postmark key')
});

exports.comment = function (options, cb) {
  var article = options.article;
  var comment = options.comment;
  var obj = {
    to: config.get('postmark to'),
    from: config.get('postmark from'),
    subject: comment.author + ' added a comment on your article ' + article,
    locals: {
      from: comment.author,
      body: comment.body,
      article: article,
      url: config.get('site url') + '/v/' + options.number
    }
  }
  
  notifier.send('comment', obj, cb);
}

exports.login = function(data, cb) {
  var obj = {
    to: config.get('postmark to'),
    from: config.get('postmark from'),
    subject: 'Someone trying to login!',
    locals: data
  }

  notifier.send('login', obj, cb);
}
