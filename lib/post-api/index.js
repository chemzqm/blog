var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/blog');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    content: String,
    create: Date,
    update: Date,
    hide: Boolean,
    comments: [{
        author: String,
        body: String,
        date: Date,
        site: String
      }]
});

var Post = mongoose.model('post', PostSchema)

exports.getPosts = function(fn) {
  Post.find({}, function(err, posts) {
    return err? fn(err):fn(null, posts)
  })
}

exports.updatePost = function(data, fn) {
  Post.findOneAndUpdate({ _id: data.id },{ $set: data }, function(err, post) {
    return err? fn(err):fn(null, post)
  })
}

exports.insertPost = function (data, fn) {
  var post = new Post(data);
  post.save(function(err, post) {
    return err? fn(err):fn(null, post._id);
  })
}

exports.deletePost = function(id, fn) {
  Post.remove({ _id: id }, function(err) {
    return err? fn(err):fn(null)
  });
}

exports.getPostById = function (id, fn) {
  Post.findById(id, function(err, post) {
    return err? fn(err):fn(null, post)
  });
}
