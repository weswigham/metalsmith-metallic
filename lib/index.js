
var debug = require('debug')('metalsmith-metallic');
var extname = require('path').extname;
var hljs = require('hightlight.js');

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
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!markdown(file)) return;
      var data = files[file];
      var str = data.contents.toString();
      
      //Fenced blocks start
      var re = /```(\w+)\n/;
      //Fenced block end
      var end = /```/;
      var remainder = str;
      var pos = 0;
      var endpos = 0;
      
      var replacements = {};
      
      while(re.test(remainder)) {
        var match = remainder.match(re);
        var prev = pos;
        pos = pos + match.index;
        var lang = match[0];
        remainder = str.substring(pos);
        
        var ends = remainder.match(end);
        if (ends==null || ends[0] == null) {
          break;
        }
        endspos = ends.index;
        replacements.append(str.substring(prev, pos));
        replacements.append(hljs.highlight(lang, str.substring(pos,pos+endpos)));
      }
      if (endpos > pos) {
        replacements.append(str.substring(endpos));
      }
      
      data.contents = replacements.join('\n');
      
      debug(data.contents);
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