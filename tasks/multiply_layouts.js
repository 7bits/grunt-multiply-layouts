/*
 * grunt-multiply-layouts
 * git://github.com/7bits/grunt-multiply-layouts.git
 *
 * Copyright (c) 2014 Dmitry Shmatko
 * Licensed under the MIT license.
 */

'use strict';

var processLayout = function (fileText, filename, cssDir, jsDir, staticSrc, staticDst) {
  var fileOut = "";
  var lines = fileText.split("\n");
  var css = [];
  var js = [];
  var filenameWoExt = filename.substr(0, filename.lastIndexOf("."));
  var cssCombinedFilename = filenameWoExt + ".min.css";
  var jsMinifiedFilename = filenameWoExt + ".min.js";
  var cssFound = false;
  var jsFound = false;
  var cssRegexp = new RegExp("(.*?)link\\(.*?href=['\"](\/?"+ cssDir + ")\/(.*?)['\"].*?\\).*?");
  var jsRegexp = new RegExp("(.*?)script\\(.*?src=['\"](\/?"+ jsDir + ")\/(.*?)['\"].*?\\).*?");
  for (var i=0; i<lines.length; i++) {
    var currentLine = lines[i];
    var cssMatch = cssRegexp.exec(currentLine);
    if (cssMatch) {
      css.push(staticSrc + "/" + cssDir + "/" + cssMatch[3]);
      if (!cssFound) {
        fileOut += currentLine.replace(cssRegexp, "$1link(href='/" + cssDir + "/" + cssCombinedFilename + "', rel='stylesheet')") + "\n";
        cssFound = true;
      }
    } else {
      var jsMatch = jsRegexp.exec(currentLine);
      if (jsMatch) {
        js.push(staticSrc + "/" + jsDir + "/" + jsMatch[3]);
        if (!jsFound) {
          fileOut += currentLine.replace(jsRegexp, "$1script(src='/" + jsDir + "/" + jsMinifiedFilename + "', type='text/javascript')") + "\n";
          jsFound = true;
        }
      } else  {
        fileOut += currentLine + "\n";
      }
    }
  }
  return {
    fileOut: fileOut,
    js: js,
    jsMin: staticDst + "/" + jsDir + "/" + jsMinifiedFilename,
    css: css,
    cssMin: staticDst + "/" + cssDir + "/" + cssCombinedFilename
  };
};

var extractFiles = function(fileText, cssDir, jsDir) {
  var lines = fileText.split("\n");
  var css = [];
  var js = [];
  var cssRegexp = new RegExp("(.*?)link\\(.*?href=['\"](\/?"+ cssDir + ")\/(.*?)['\"].*?\\).*?");
  var jsRegexp = new RegExp("(.*?)script\\(.*?src=['\"](\/?"+ jsDir + ")\/(.*?)['\"].*?\\).*?");
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
  return {
    css: css,
    js: js
  };
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('multiply_layouts', 'Grunt plugin for minifying css and js for several templates in prod, and just copy in development', function() {
    // Iterate over all specified layouts.
    var options = this.data.options;
    var uglifyOptions = {};
    if (!grunt.file.isDir(options.staticSrc)) {
      grunt.log.warn('Source directory "' + options.staticSrc + '" is not directory.');
      return false;
    }
    this.data.layouts.forEach(function(f) {
      var filepath = f.src;
      grunt.file.recurse(filepath, function callback(abspath, rootdir, subdir, filename) {
        var fileText;
        if (f.mode === 'prod') {
          console.log('Prod, minifying');
          console.log(filename);
          fileText = grunt.file.read(abspath);
          var layout = processLayout(fileText, filename, options.cssDir, options.jsDir, options.staticSrc, options.staticDst);
          /**/
          var jsFiles = {};
          jsFiles[layout.jsMin] = layout.js;
          uglifyOptions[abspath] = {files: jsFiles};
          /**/
          grunt.file.write(f.dst + "/" + filename, layout.fileOut);
        } else if (f.mode === 'dev') {
          console.log('Dev, copying only');
          fileText = grunt.file.read(abspath);
          var files = extractFiles(fileText, options.cssDir, options.jsDir);
          grunt.file.copy(abspath, f.dst + "/" + filename);
          console.log("Copying " + abspath + " to " + f.dst);
          var css = files.css;
          var js = files.js;
          for (var i=0; i<css.length; i++) {
            grunt.file.copy(options.staticSrc + "/" + options.cssDir + "/" + css[i],
              options.staticDst + "/" + options.cssDir + "/" + css[i]);
            console.log("Copying " + options.staticSrc + css[i] + " to " + options.staticDst);
          }
          for (var j=0; j<js.length; j++) {
            grunt.file.copy(options.staticSrc + "/" + options.jsDir + "/" + js[j],
              options.staticDst + "/" + options.jsDir + "/" + js[j]);
            console.log("Copying " + options.staticSrc + js[j] + " to " + options.staticDst);
          }
        }
      });
    });
    if (uglifyOptions != null) {
      console.log("Running uglify...");
      grunt.config.set('uglify', uglifyOptions);
      grunt.task.run('uglify');
    }
  });

};
