/*
 * grunt-multiply-layouts
 * git://github.com/7bits/grunt-multiply-layouts.git
 *
 * Multiply Layouts for Grunt
 *
 * Grunt Task for proceeding multiply jade layouts and
 * 1) copy all css-es and js-es they needed from source
 * directory to destination in development mode or
 * 2) minify css-es and js-es for every template,
 * puts minified files in static files destination folder
 * and modified template linked to them in layouts
 * destination folder
 *
 * Copyright (c) 2014 Dmitry Shmatko
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Process jade layout, removing all link href to CSS files and script src to JS files
 * Replaces all of them to one link href to minified CSS and one script src to minified JS
 * Removes only CSS links to files in cssDir and JS file links in jsDir
 * @param fileText      Jade template text
 * @param filename      Template filename
 * @param cssDir        CSS directory
 * @param jsDir         JS directory
 * @param staticSrc     Static files source (development) directory
 * @param staticDst     Static files destination directory
 * @returns {{
 * fileOut: string,     Processed template text
 * js: Array,           List of JS files with absolute paths
 * jsMin: string,       Filename for minified js
 * css: Array,          List of CSS files with absolute paths
 * cssMin: string       Filename for minified css
 * }}
 */
var processLayout = function (fileText, filename, cssDir, jsDir, staticSrc, staticDst) {

  // Output layout
  var fileOut = "";
  // CSS files
  var css = [];
  // JS files
  var js = [];
  // Flag, whether css was found in template
  var cssFound = false;
  // Flag, whether js was found in template
  var jsFound = false;
  // CSS file href regexp for jade, relative path in 3rd match
  var cssRegexp = new RegExp("(.*?)link\\(.*?href=['\"](\/?"+ cssDir + ")\/(.*?)['\"].*?\\).*?");
  // JS file src regexp for jade, relative path in 3rd match
  var jsRegexp = new RegExp("(.*?)script\\(.*?src=['\"](\/?"+ jsDir + ")\/(.*?)['\"].*?\\).*?");

  // We need names for minified css and js
  var filenameWoExt = filename.substr(0, filename.lastIndexOf("."));
  var cssCombinedFilename = filenameWoExt + ".min.css";
  var jsMinifiedFilename = filenameWoExt + ".min.js";

  var lines = fileText.split("\n");

  // Iterating jade template line by line
  for (var i=0; i<lines.length; i++) {

    var currentLine = lines[i];
    var cssMatch = cssRegexp.exec(currentLine);
    // IF we have found css link
    if (cssMatch) {
      css.push(staticSrc + "/" + cssDir + "/" + cssMatch[3]);
      // If it's first time, replace it with link to minified css
      if (!cssFound) {
        fileOut += currentLine.replace(cssRegexp, "$1link(href='/" + cssDir + "/" + cssCombinedFilename + "', rel='stylesheet')") + "\n";
        cssFound = true;
      }
    } else {
      var jsMatch = jsRegexp.exec(currentLine);
      // OR we have found js link
      if (jsMatch) {
        js.push(staticSrc + "/" + jsDir + "/" + jsMatch[3]);
        // If it's first time, replace it with link to minified js
        if (!jsFound) {
          fileOut += currentLine.replace(jsRegexp, "$1script(src='/" + jsDir + "/" + jsMinifiedFilename + "', type='text/javascript')") + "\n";
          jsFound = true;
        }
        // OR there neither css nor js link in this line
      } else  {
        fileOut += currentLine + "\n";
      }
    }
  }

  // Returns compiled layout, list of css and js files and filenames for minified css and js
  return {
    fileOut: fileOut,
    js: js,
    jsMin: staticDst + "/" + jsDir + "/" + jsMinifiedFilename,
    css: css,
    cssMin: staticDst + "/" + cssDir + "/" + cssCombinedFilename
  };
};

/**
 * Extract list of css and js files from Jade layout
 * ignoring all css files located not in CSS directory
 * and all js files located not in JS directory
 * @param fileText  Jade layout text
 * @param cssDir    CSS directory name
 * @param jsDir     JS directory name
 * @returns {{
 * css: Array of css filenames inside CSS dir,
 * js: Array of js filenames inside JS dir
 * }}
 */
var extractFiles = function(fileText, cssDir, jsDir) {

  // List of css files
  var css = [];
  // List of js files
  var js = [];
  // CSS file href regexp for jade, relative path in 3rd match
  var cssRegexp = new RegExp("(.*?)link\\(.*?href=['\"](\/?"+ cssDir + ")\/(.*?)['\"].*?\\).*?");
  // JS file src regexp for jade, relative path in 3rd match
  var jsRegexp = new RegExp("(.*?)script\\(.*?src=['\"](\/?"+ jsDir + ")\/(.*?)['\"].*?\\).*?");

  var lines = fileText.split("\n");

  // Checking css or js sourced line by line
  for (var i=0; i<lines.length; i++) {
    var currentLine = lines[i];
    var cssMatch = cssRegexp.exec(currentLine);
    if (cssMatch) {
      css.push(cssMatch[3]);
    } else {
      var jsMatch = jsRegexp.exec(currentLine);
      if (jsMatch) {
        js.push(jsMatch[3]);
      }
    }
  }

  // Returns list of css and js files
  return {
    css: css,
    js: js
  };
};

/**
 * Creates grunt task designed for processing multiply layouts
 * @param grunt   Grunt instance
 */
module.exports = function(grunt) {

  // We need some modules for production minifying
  // loadNpmTask will not work correctly here
  require('grunt-contrib-uglify/tasks/uglify')(grunt);
  require('grunt-contrib-cssmin/tasks/cssmin')(grunt);

  // Just some intro
  grunt.registerMultiTask('multiply_layouts', 'Grunt plugin for minifying css and js for several templates in prod, and just copy in development', function() {

    // Input options
    var options = this.data.options;
    // Object for storing uglify (js minimizer) options
    var uglifyOptions = {};
    // Object for storing minify (css minimizer) options
    var minifyOptions = {};

    // Options validation
    if (!grunt.file.isDir(options.staticSrc)) {
      grunt.log.warn('Static source directory ' + options.staticSrc['cyan'] + ' is not a directory.');
      return false;
    }

    // Iterate over all specified layout directories
    this.data.layouts.forEach(function(f) {

      // Layout validation
      if (!grunt.file.isDir(f.src)) {
        grunt.log.warn('Layouts source directory ' + f.src['cyan'] + ' is not a directory.');
        return false;
      }
      // Iterate over layouts in certain directory
      grunt.file.recurse(f.src, function callback(abspath, rootdir, subdir, filename) {

        var fileText = grunt.file.read(abspath);

        // Layout in production mode
        if (f.mode === 'prod') {
          grunt.log.writeln('Production mode (with minifying) for layout ' + abspath['cyan']);

          // Extract all needed data from layout
          var layout = processLayout(fileText, filename, options.cssDir, options.jsDir, options.staticSrc, options.staticDst);

          // Building task for js uglify and adding it to uglifyOptions
          var jsFiles = {};
          jsFiles[layout.jsMin] = layout.js;
          uglifyOptions[abspath] = {files: jsFiles};

          // Building task for css minify and adding it to minifyOptions
          var cssFiles = {};
          cssFiles[layout.cssMin] = layout.css;
          minifyOptions[abspath] = {files: cssFiles};

          // Saving compiled layout with links to minified css/js in destination directory
          grunt.file.write(f.dst + "/" + filename, layout.fileOut);

          // Layout in development mode
        } else if (f.mode === 'dev') {
          grunt.log.writeln('Development mode (copying only) for layout ' + abspath['cyan']);

          // Extract all needed data (css and js list) from layout
          var files = extractFiles(fileText, options.cssDir, options.jsDir);

          // Copying all css files linked in layout from src to dst
          var css = files.css;
          for (var i=0; i<css.length; i++) {
            grunt.log.verbose.ok("Copying " + options.staticSrc + css[i] + " to " + options.staticDst);
            grunt.file.copy(options.staticSrc + "/" + options.cssDir + "/" + css[i],
              options.staticDst + "/" + options.cssDir + "/" + css[i]);
          }

          // Copying all js files linked in layout from src to dst
          var js = files.js;
          for (var j=0; j<js.length; j++) {
            grunt.log.verbose.ok("Copying " + options.staticSrc + js[j] + " to " + options.staticDst);
            grunt.file.copy(options.staticSrc + "/" + options.jsDir + "/" + js[j],
              options.staticDst + "/" + options.jsDir + "/" + js[j]);
          }

          // Copying layout to destination directory without any modification
          grunt.log.verbose.ok("Copying " + abspath['cyan'] + " to " + f.dst['cyan']);
          grunt.file.copy(abspath, f.dst + "/" + filename);
        } else {
          grunt.log.warn('Mode ' + f.mode['cyan'] + ' is not available, only "prod" and "dev" can be used, skipping.');
        }
      });
    });

    // Running accumulated uglify tasks
    if (Object.keys(uglifyOptions).length > 0) {
      grunt.config.set('uglify', uglifyOptions);
      grunt.task.run('uglify');
    }

    // Running accumulated cssmin tasks
    if (Object.keys(minifyOptions).length > 0) {
      grunt.config.set('cssmin', minifyOptions);
      grunt.task.run('cssmin');
    }
  });
};
