
var debug = require('debug')('metalsmith-metallic');
var extname = require('path').extname;
var hljs = require('highlight.js');
var entities = require("entities");

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to highlight code in markdown files.
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options){
  hljs.configure(options);
  //var theme = options.theme || "http://yandex.st/highlightjs/8.0/styles/default.min.css";
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!markdown(file)) return;
      var data = files[file];
      var str = data.contents.toString();
      //Fenced block start/end
      var end = /```/;
      var typed = /```(\s*[\w\-]+\s*)\r?\n/;
      var remainder = str;
      var pos = 0;
      var endpos = 0;

      var replacements = [];
      while(end.test(remainder)) {
        var match = remainder.match(end);
        var lang = null;
        var isTyped = remainder.match(typed);
        if (isTyped && match.index===isTyped.index) {
          lang = isTyped[1].trim();
        }
        var prev = pos;

        var buff = 3 + (lang ? isTyped[1].length : 0);

        pos = pos + match.index + buff;
        remainder = str.substring(pos);

        var ends = remainder.match(end);
        if (ends==null || ends[0] == null) {
          break;
        }

        endpos = ends.index;
        replacements.push(str.substring(prev, pos-buff));

        remainder = str.substring(pos+endpos+3);
        var code = str.substring(pos,pos+endpos);
        code = code.trim('(\r\n|\n)')
        pos = pos+endpos+3;
        if (lang==null) {
          replacements.push("<pre><code>"+hljs.highlightAuto(code).value+"</code></pre>");
        } else {
          try {
            if (lang==="no-highlight") {
              replacements.push("<pre><code class=\""+lang+"\">"+entities.encodeHTML(code)+"</code></pre>");
            } else {
              replacements.push("<pre><code class=\""+lang+"\">"+hljs.highlight(lang, code).value+"</code></pre>");
            }
          } catch(err) {
            replacements.push("<pre><code>"+hljs.highlightAuto(code).value+"</code></pre>");
          }
        }
      }
      if (pos < (str.length-1)) {
        replacements.push(str.substring(pos));
      }

      files[file].contents = replacements.join('');
      //files[file].contents = '<link rel="stylesheet" href="'+theme+'">\n'+files[file].contents;
      debug(files[file].contents);
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}
