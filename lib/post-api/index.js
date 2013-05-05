
var posts = [{
  create:'2013-01-01',
  update:'2013-01-02',
  title:'test title',
  content:'test',
  id:0
}];
var _id = 0;

exports.getPosts = function(fn) {
  fn(null, posts);
}

exports.savePost = function(data, fn) {
  var id = data.id;
  if(id == null){
    data.id = ++_id;
    posts.push(data);
  }else{
    posts.forEach(function(v) {
      if(v.id == id){
        for(var i in data){
          v[i] = data[i];
        }
      }
    })
  }
  fn(null);
}

exports.deletePost = function(id, fn) {
  id = Number(id);
  posts = posts.filter(function(v, i) {
    return v.id !== id;
  })
  fn(null);
}

exports.getPostById = function (id, fn) {
  posts.forEach(function(v) {
      if(v.id == id){
        fn(null, v);
      }
  })
}
