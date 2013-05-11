var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var getTags = function (tags) {
  return tags.join(',')
}

var setTags = function (tags) {
  return tags.split(',')
}

function isEmail (val) {
  return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val);
}

function isUrl (val) {
  return /^http(s)?:\/\//.test(val);
}

var PostSchema = new Schema({
    title: {type: String, required: true, trim: true},
    content: {type: String, required: true, trim: true},
    create: {type: Date, default: Date.now},
    update: {type: Date, default: Date.now},
    hide: { type: Boolean, default: true },
    tags: {type: [], get: getTags, set: setTags},
    comments: [{
        author: { type: String, required: true, trim: true},
        body: {type: String, required: true, trim : true},
        date: {type: Date, default: Date.now},
        email: {type: String, validate: isEmail },
        site: {type: String, validate: isUrl }
      }]
});

PostSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Article title cannot be blank')

PostSchema.path('content').validate(function (body) {
  return body.length > 0
}, 'Article body cannot be blank')

/**
 * Statics
 */
PostSchema.statics = {

  /**
   * Find post by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },
  
  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'create': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  /**
   * @param {Object} criteria
   * @param {Function} cb
   * @api private
   */
  listAll: function (criteria, cb){
    this.find(criteria)
      .sort({'create': -1}) // sort by date
      .exec(cb);
  }
}

PostSchema.methods = {
  /**
   * Add comment
   *
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function ( comment, cb) {

    this.comments.push(comment)

    //notify.comment({
    //  article: this,
    //  currentUser: user,
    //  comment: comment.body
    //})

    this.save(cb)
  }

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


var Post = module.exports = mongoose.model('Post', PostSchema);
