/* jshint mocha: true */
var assert = require('assert');
var metallic = require('..');
var Metalsmith = require('metalsmith');
var fs = require('fs');


describe('metalsmith-metallic', function(){
  it('should set file contents as a buffer', function(done){
    Metalsmith('test/fixture')
      .use(metallic())
      .build(function(err, files){
        if (err) { return done(err); }
        assert.strictEqual(files['index.md'].contents instanceof Buffer, true);
        done();
      });
  });

  it('should highlight code blocks in markdown files', function(done){
    fs.readFile('test/fixture/expected/index.md', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      Metalsmith('test/fixture')
        .use(metallic())
        .build(function(err, files){
          if (err) { return done(err); }
          assert.equal(files['index.md'].contents.toString(), data.toString());
          done();
        });
    });
  });

  it('should parse code blocks with the no-highlight language in markdown files', function(done){
    fs.readFile('test/fixture/expected/nohighlight.md', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      Metalsmith('test/fixture')
        .use(metallic())
        .build(function(err, files){
          if (err) { return done(err); }
          assert.equal(files['nohighlight.md'].contents.toString(), data.toString());
          done();
        });
    });
  });

  it('should highlight specific languages as it does in the browser', function(done){
    fs.readFile('test/fixture/expected/csharp.md', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      Metalsmith('test/fixture')
        .use(metallic())
        .build(function(err, files){
          if (err) { return done(err); }
          assert.equal(files['csharp.md'].contents.toString(), data.toString());
          done();
        });
    });
  });
  
  it('should handle embedded fences correctly', function(done){
    fs.readFile('test/fixture/expected/embedded-markers.md', 'utf8', function (err,data) {
      if (err) {
        return console.log(err)
      }
      Metalsmith('test/fixture')
        .use(metallic())
        .build(function(err, files){
          if (err) { return done(err); }
          assert.equal(files['embedded-markers.md'].contents.toString(), data.toString());
          done();
        });
    });
  });
});
