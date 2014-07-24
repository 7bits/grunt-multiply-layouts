'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.multiply_layouts = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  layout_was_not_changed_in_dev: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/views/layouts-dev/admin-layout.jade');
    var expected = grunt.file.read('test/fixtures/views/layouts/admin-layout.jade');
    test.equal(actual, expected, 'Layout should not changed in development mode');

    test.done();
  },
  css_was_not_changed_in_dev: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/public-dev/css/main.css');
    var expected = grunt.file.read('test/fixtures/public/css/main.css');
    test.equal(actual, expected, 'Css should not changed in development mode');

    test.done();
  },
  js_was_not_changed_in_dev: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/public-dev/js/component/ajax-form.js');
    var expected = grunt.file.read('test/fixtures/public/js/component/ajax-form.js');
    test.equal(actual, expected, 'Js should not changed in development mode');

    test.done();
  },
  layout_was_not_changed_in_prod: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/views/layouts-prod/restricted-layout.jade');
    var expected = grunt.file.read('test/fixtures/views/layouts/restricted-layout.jade');
    test.notEqual(actual, expected, 'Layout should change in production mode');

    test.done();
  },
  css_min_not_empty_in_prod: function(test) {
    test.expect(1);

    var minFile = grunt.file.read('test/fixtures/public/css/restricted-layout.min.css');
    test.ok(minFile.length > 0, 'Css min file should be created in production mode');

    test.done();
  },
  js_min_not_empty_in_prod: function(test) {
    test.expect(1);

    var minFile = grunt.file.read('test/fixtures/public/js/restricted-layout.min.js');
    test.ok(minFile.length > 0, 'Js min file should be created in production mode');

    test.done();
  }
};
