var debug = require('debug')('metalsmith-metallic');
var extname = require('path').extname;
var hljs = require('highlight.js');
var entities = require('entities');

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file) {
    return (/\.md|\.markdown/).test(extname(file));
}

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

function plugin(options) {
    'use strict';
    hljs.configure(options);
    return function (files, metalsmith, done) {
        setImmediate(done);
        Object.keys(files).forEach(function (file) {
            debug('checking file: %s', file);
            if (!markdown(file)) { return; }
            var data = files[file],
                str = data.contents.toString(),
                end = /^(\s*)```(.*)/m,
                remainder = str,
                pos = 0,
                endpos = 0,
                replacements = [];

            while (end.test(remainder)) {
                var match = end.exec(remainder),
                    candidate = match[2] && match[2].trim(),
                    lang = (candidate && candidate.length) > 0 ? candidate : null,
                    prev = pos,
                    buff = match[0].length,
                    leadingSpaceLength = match[1] ? match[1].length : 0;

                pos = pos + match.index + buff;
                remainder = str.substring(pos);

                var ends = end.exec(remainder);
                if (ends === null) {
                    break;
                }

                endpos = ends.index;
                replacements.push(str.substring(prev, pos - buff + leadingSpaceLength));

                var fencePrefixLength = (ends[1] ? ends[1].length : 0) + 3;
                var nextPos = pos + endpos + fencePrefixLength;
                remainder = str.substring(nextPos);
                var code = str.substring(pos, pos + endpos);
                code = code.trim('(\r\n|\n)');
                pos = nextPos;
                if (lang === null) {
                    replacements.push('<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>');
                } else {
                    try {
                        if (lang === 'no-highlight') {
                            replacements.push('<pre><code class="hljs ' + lang + '">' + entities.encodeHTML(code) + '</code></pre>');
                        } else {
                            replacements.push('<pre><code class="hljs ' + lang + '">' + hljs.highlight(lang, code).value + '</code></pre>');
                        }
                    } catch (err) {
                        replacements.push('<pre><code>' + hljs.highlightAuto(code).value + '</code></pre>');
                    }
                }
            }
            if (pos < (str.length - 1)) {
                replacements.push(str.substring(pos));
            }

            files[file].contents = new Buffer(replacements.join(''));
            debug(files[file].contents.toString());
        });
    };
}
