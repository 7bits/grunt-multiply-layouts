# grunt-multiply-layouts

> Automatic css and js minifying for multiply jade layouts using Grunt  

# What this plugin is needed for?

In my Node.js apps I use several templates with different css and js files included. It can be, say, public and private parts of one site. You don't need javascripts from private part to be loaded in public and vice versa. All standard minify procedures just pick all files in your css/js directory, combine and compress them.

Multiply Layouts for Grunt do it other way: you setup task and choose mode for your layouts: `prod` or `dev`. In `prod` task minifies css and js for every layout separately and creates modified layouts in configured  directory, in `dev` just copying them from development directories to those, your application will use.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-multiply-layouts --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-multiply-layouts');
```

## The "multiply_layouts" task

### Overview
In your project's Gruntfile, add a section named `multiply_layouts` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  multiply_layouts: {
    options: {
          staticSrc: 'public-dev',
          staticDst: 'public',
          cssDir: 'css',
          jsDir: 'js'
    },
    layouts: {[{
          src: 'views/layouts-dev',
          dst: 'views/layouts',
          mode: 'dev'
    }]},
  },
});
```

### Options

#### options.staticSrc
Type: `String`  
Default value: None  

Directory from which css and js files will be copied. You should develop them in it.

#### options.staticDst
Type: `String`  
Default value: None  

Directory to which css and js files will be copied. You should use it as directory for static files in your app.

#### options.cssDir
Type: `String`  
Default value: None  

Directory used for storing css files. Task will proceed only css files in staticSrc/cssDir.

#### options.jsDir
Type: `String`  
Default value: None  

Directory used for storing js files. Task will proceed only js files in staticSrc/jsDir.

### Layouts

#### layouts.src
Type: `String`  
Default value: None  

Relative path to your jade layouts development directory.

#### layouts.dst
Type: `String`  
Default value: None  

Relative path to your jade layouts destination directory. They will be used in other templates from this location.

#### layouts.mode
Type: `String`  
Default value: None  
Possible values: `prod` or `dev`  

Production `prod` or development `dev` mode is used. You can use only one of it.  

In `dev` mode task will copy template from layouts.src to layouts.dst, plus copy all css and js files used in templates, located in layouts.src from options.staticSrc to options.staticDst.

In `prod` mode task will read templates from layouts.src, replace all css links to one with minifed css and all js sources to one with minified js. All css and js files will be minified for each template file separately.

### Usage Examples

#### Default Options
No default options setup available at this time.

#### Custom Options
In this example, there are 2 layout tasks:  
1) Multiplay Layouts will read jade layouts from `views/layouts-dev`, extract information about all css and js files used in them, copy css files from `public-dev/css` to `public/css` and js files from `public-dev/js` to `public/js`, but only those used in jade layouts. Plus it will copy this jade layout from `views/layouts-dev` to `views/layouts`.  
2) Multiply Layouts will read jade layouts from `views/layouts-prod`, replace all css links and js sources to `/cssDir/layout-filename.min.css` and `/jsDir/layout-filename.min.js` respectively, plus minify css and js files for each layout separately.  

```js
grunt.initConfig({
  multiply_layouts: {
    options: {
          staticSrc: 'public-dev',
          staticDst: 'public',
          cssDir: 'css',
          jsDir: 'js'
    },
    layouts: {[{
          src: 'views/layouts-dev',
          dst: 'views/layouts',
          mode: 'dev'
    }, {
          src: 'views/layouts-prod',
          dst: 'views/layouts',
          mode: 'prod'
    }]},
  },
});
```

#### How `prod` mode modifies layouts?
Here's simple example. Taking one template from above example, task will replace only css and js files that are in cssDir and jsDir respectively

Source `views/layouts-prod/main-layout.jade`
```jade
doctype html
html

  head
    meta(charset='utf-8')
    meta(name='viewport', content='width=device-width')
    link(href='img/mainicon.png', rel='icon')
    link(rel='stylesheet', href='css/main.css')
    link(rel='stylesheet', href='css/fonts.css')
    link(rel='stylesheet', href='css/text.css')
    link(rel='stylesheet', href='css/graduates.css')
    script(src='js/jquery-1.10.2.js')
    script(src='/js/lib/twitter_flight.js')
    script(src='js/component/preview-story-component.js')
    script(src='js/component/show-full-story-component.js')
    script(src='js/component/move-footer.js')
    script(src='js/init-graduates.js')
    link(href='http://fonts.googleapis.com/css?family=Roboto:300,500,400&subset=latin,cyrillic-ext,cyrillic', rel='stylesheet', type='text/css')
    block head

  body
    block content
```
Destination `views/layouts/main-layout.jade`
```jade
doctype html
html

  head
    meta(charset='utf-8')
    meta(name='viewport', content='width=device-width')
    link(href='img/mainicon.png', rel='icon')
    link(href='/css/main-layout.min.css', rel='stylesheet')
    script(src='/js/main-layout.min.js', type='text/javascript')
    link(href='http://fonts.googleapis.com/css?family=Roboto:300,500,400&subset=latin,cyrillic-ext,cyrillic', rel='stylesheet', type='text/css')
    block head

  body
    block content
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - First version, everything works fine but it's written like sh!t
