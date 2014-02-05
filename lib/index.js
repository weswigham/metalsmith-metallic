
/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to add an excerpt from files.
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options){
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      var data = files[file];
      var str = data.body;
      var i = str.indexOf('\n\n');
      data.excerpt = ~i
        ? str.substring(0, i)
        : '';
    });
  };
}