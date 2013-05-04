
var posts = [{
  create:'2013-01-01',
  update:'2013-01-02',
  title:'test title',
  content:'test',
  id:0
}];
var id = 0;

exports.getPosts = function(fn) {
  fn(null, posts);
}

exports.savePost = function(data, fn) {
  data.id = ++id;
  posts.push(data);
  fn(null);
}

exports.deletePost = function(id, fn) {
  id = Number(id);
  posts = posts.filter(function(v, i) {
    return v.id !== id;
  })
  fn(null);
}
