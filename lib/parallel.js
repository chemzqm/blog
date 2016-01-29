var nextTick = setImmediate;
/**
 * Parallel Class
 * @api public
 */
function Parallel () {
  if (!(this instanceof Parallel)) return new Parallel();
  this.results = [];
  this.t = 10000;
  this.cbs = [];
  return this;
}

/**
 * 
 * @param {String} ms
 * @api public
 */
Parallel.prototype.timeout = function(ms) {
  this.t = ms;
  return this;
}

/**
 * Add parallel function
 *
 * @param {String} fn
 * @api public
 */
Parallel.prototype.add = function(fn) {
  var self = this;
  this.len = (this.len || 0) + 1;
  var i = this.len - 1;
  var cb = timeout(function(err, res) {
    if (self.finished === true) return;
    if(err) return self.cb(err);
    var results = self.results;
    results[i] = res;
    self.len = self.len -1;
    if (self.len === 0) self.cb();
  }, this.t);
  this.cbs.push(function() {
    fn(function() {
      var args = arguments;
      nextTick(function() {
        cb.apply(null, args);
      })
    });
  });
  return this;
}

/**
 * cb is called when all parallel function finished
 * this function should only be called once
 *
 * @param {String} cb
 * @api public
 */
Parallel.prototype.done = function(cb) {
  if(this.cb) throw new Error('Callback exist');
  var self = this;
  this.cb = function() {
    self.finished = true;
    cb.call(null, arguments[0], self.results);
    delete self.cbs;
  }
  if (this.cbs.length === 0) return this.cb();
  this.cbs.forEach(function(fn) {
    fn();
  })
}

function timeout (fn, ms) {
  var called;
  var id = setTimeout(function(){
    fn(new Error('Timeout ' + ms + ' reached'));
    called = true;
  }, ms);
  var cb = function() {
    if (called) return;
    clearTimeout(id);
    fn.apply(null, arguments);
  }
  return cb;
}

module.exports = Parallel;
