var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notify = require('notify');

var getTags = function (tags) {
  return tags.join(',')
}

var setTags = function (tags) {
  return tags.split(',')
}

var isEmail = [function (val) {
  if (val === ''){ return true; }
  return (/^[a-zA-Z_\-.]+@[a-zA-Z_]+?(\.[a-zA-Z]{2,3})+$/).test(val);
}, '邮箱地址格式错误']

var isUrl = [function isUrl (val) {
  if (val === ''){ return true; }
  return (/^http(s)?:\/\//).test(val);
}, '网站地址格式错误']

var PostSchema = new Schema({
    title: {type: String, required: true, trim: true},
    content: {type: String, required: true, trim: true},
    create: {type: Date, default: Date.now},
    update: {type: Date, default: Date.now},
    number: {type: Number, required: true, unique: true},
    hide: { type: Boolean, default: true },
    tags: {type: [], get: getTags, set: setTags},
    comments: [{
        author: { type: String, required: true, trim: true},
        body: {type: String, required: true, trim : true},
        avatar: { type: String},
        date: {type: Date, default: Date.now},
        email: {type: String, validate: isEmail},
        site: {type: String, validate: isUrl}
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

  load: function (criteria, cb) {
    this.findOne(criteria)
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
  },
  next: function (cb) {
    this.find({})
    .exec(function(err, res) {
      if(err){ return cb(err); }
      var number = 0;
      res.forEach(function(p) {
        if(p.number > number){
          number = p.number;
        }
      })
      cb(null, number + 1);
    })
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

    notify.comment({
      article: this.title,
      comment: comment
    }, function (err) {
      if(err){
        console.log('Email send error: ' + err.message);
      }
    });
    this.save(cb)

  },
  /**
   * remove comment
   * @param {String} id
   * @param {Function} cb
   * @api private
   */
  removeComment: function (id, cb) {
    this.comments.pull(id);
    this.save(cb);
  }
}

var Post = module.exports = mongoose.model('Post', PostSchema);
