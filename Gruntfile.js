/*
 * grunt-multiply-layouts
 * git://github.com/7bits/grunt-multiply-layouts.git
 *
 * Copyright (c) 2014 Dmitry Shmatko
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
      multiply_layouts: ['test/fixtures/public/css', 'test/fixtures/public/js', 'test/fixtures/views/layouts']
    },

    // Configuration to be run (and then tested).
    multiply_layouts: {
      dev: {
        options: {
          staticSrc: 'test/fixtures/public-dev',
          staticDst: 'test/fixtures/public',
          cssDir: 'css',
          jsDir: 'js'
        },
        layouts: [{
          src: 'test/fixtures/views/layouts-dev',
          dst: 'test/fixtures/views/layouts',
          mode: 'dev'
        }]
      },
      prod: {
        options: {
          staticSrc: 'test/fixtures/public-dev',
          staticDst: 'test/fixtures/public',
          cssDir: 'css',
          jsDir: 'js'
        },
        layouts: [{
          src: 'test/fixtures/views/layouts-dev',
          dst: 'test/fixtures/views/layouts',
          mode: 'prod'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'multiply_layouts:dev', 'nodeunit']);

  // No tests task
  grunt.registerTask('notest', ['jshint', 'clean', 'multiply_layouts:dev']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
