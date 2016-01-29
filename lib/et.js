/**
 * Expose render().
 */

exports = module.exports = render;

exports.compile = compile;

/**
 * Render the given template `str` with `obj`.
 *
 * @param {String} str
 * @param {Object} obj
 * @return {String}
 * @api public
 */

function render(str, obj) {
  obj = obj || {};
  var fn = compile(str);
  return fn(obj);
}

function compile(str, options) {
  options = options || {};
  var debug = options.debug;

  if (debug) {
    // Adds the fancy stack trace meta info
    str = [
      'var __stack = { lineno: 1, input: ' + str + ' };',
        rethrow.toString(),
      'try {',
        parse(str, options),
      '} catch (err) {',
      '  rethrow(err, __stack.input, __stack.lineno);',
      '}'
    ].join("\n");
  } else {
    str = parse(str, options);
  }

  str = 'escape = escape || ' + escape.toString() + ';\n' + str;
  //console.log(str);
  var fn;
  try {
    fn = new Function('locals, filters, escape, rethrow', str);
  } catch (err) {
    if ('SyntaxError' == err.name) {
      err.message += ' while compiling ejs';
    }
    throw err;
  }

  return fn;
}

function parse(str, options) {
  options = options || {};
  var debug = options.debug
    , open = options.open || '{{'
    , close = options.close || '}}'
    , buf = '';


  buf += 'var buf = [];';
  buf += '\nwith (locals || {}) { (function(){ ';

  var lineno = 1;
  var closes = [];
  var append;
  var closed = true;

  var consumeEOL = false;
  for (var i = 0, len = str.length; i < len; ++i) {
    var stri = str[i];
    if (str.slice(i, open.length + i) == open) {
      if (closed === false) {
        buf += '\');' ;
        closed = true;
      }
      i += open.length;

      var end = str.indexOf(close, i);

      if (end < 0){
        throw new Error('Could not find matching close tag "' + close + '".');
      }
      var js = str.substring(i, end);
      var prefix, postfix, line = (debug ? '__stack.lineno=' : '') + lineno;
      var res = parseKeyword(js, closes);
      if (res) {
        js = res.prefix;
        if (append) {
          js = append + js;
          append = '';
        }
        append = res.append;
        buf += js;
        consumeEOL = true;
      } else {
        switch (str[i]) {
          case '=':
            prefix = "', escape((" + line + ', ';
            postfix = ")), '";
            ++i;
            break;
          case '!':
            prefix = "', (" + line + ', ';
            postfix = "), '";
            ++i;
            break;
          default:
            throw new Error('unrecognized keyword ' + js);
        }

        var n = 0;

        js = js.substring(1, js.length);

        while (~(n = js.indexOf("\n", n))) n++, lineno++;

        if (js) {
          js = js.replace(/\bthis\b/g, 'v');
          buf += '\n buf.push(\'' + prefix;
          buf += js;
          buf += postfix + '\');';
          consumeEOL = true
        }
      }
      i = end + close.length - 1;
    } else {
      if (closed) {
        buf += '\n buf.push(\'';
        closed = false;
        consumeEOL = false;
      }
      if (stri == "\\") {
        buf += "\\\\";
      } else if (stri == "'") {
        buf += "\\'";
      } else if (stri == "\r") {
        // ignore
      } else if (stri == "\n") {
        if (consumeEOL) {
          consumeEOL = false;
        } else {
          buf += "\\n";
          lineno++;
        }
      } else {
        buf += stri;
      }
    }
  }
  if (closed === false) {
    buf += '\');' ;
    closed = true;
  }

  buf += "\n})();\n} \nreturn buf.join('');";
  return buf;
}

/**
 * Re-throw the given `err` in context to the
 * `str` of ejs, and `lineno`.
 *
 * @param {Error} err
 * @param {String} str
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

function rethrow(err, str, lineno){
  var lines = str.split('\n')
    , start = Math.max(lineno - 3, 0)
    , end = Math.min(lines.length, lineno + 3);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.message = 'et:'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html){
  html = html == null ? '': html;
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

function parseKeyword(js, closes) {
  if (!/^\/|each|if|elif|else|switch|case|default(\s|$)/.test(js)) return;
  var postfix, prefix, append;
  var expression = js.replace(/^\w+\s*/, '');
  if (js.indexOf('each') === 0) {
    prefix  = '\n' + expression + '.forEach(function(v, i){with(v){\n';
    postfix = '}})\n';
  } else if (js.indexOf('if') === 0) {
    prefix  = '\n' + 'if (' + expression + '){\n';
    postfix = '}\n';
  } else if (js.indexOf('else') === 0) {
    prefix  = '\n' + '} else {\n';
  } else if (js.indexOf('elif') === 0) {
    prefix  = '\n' + '} else if (' + expression + '){\n';
  } else if (js.indexOf('switch') === 0) {
    prefix  = '\n' + 'switch (' + expression + '){\n';
    postfix = '}\n';
  } else if (js.indexOf('case') === 0) {
    prefix  = '\n' + 'case ' + expression + ':\n';
    append  = 'break;\n'
  } else if (js.indexOf('default') === 0) {
    prefix  = '\n' + 'default:\n'
  } else if (js.indexOf('\/' === 0)) {
    js = closes.pop();
    if (!js) throw new Error('could not find matching close tag');
    prefix = '\n' + js + '\n';
  }

  if (postfix) closes.push(postfix);
  return {
    prefix: prefix,
    append: append
  }
}
