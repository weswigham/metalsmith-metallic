
var equal = require('assert-dir-equal');
var excerpt = require('..');
var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');

describe('metalsmith-excerpt', function(){
  it('should convert excerpt files', function(done){
    Metalsmith('test/fixture')
      .use(excerpt())
      .use(templates({ engine: 'swig' }))
      .build(function(err){
        if (err) return done(err);
        equal('test/fixture/expected', 'test/fixture/build');
        done();
      });
  });
});