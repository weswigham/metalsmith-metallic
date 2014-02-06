
var assert = require('assert');
var excerpt = require('..');
var Metalsmith = require('metalsmith');

describe('metalsmith-excerpt', function(){
  it('should convert excerpt files', function(done){
    Metalsmith('test/fixture')
      .use(excerpt())
      .build(function(err, files){
        if (err) return done(err);
        assert.equal('excerpt', files['index.md'].excerpt);
        done();
      });
  });
});