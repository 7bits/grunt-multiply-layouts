(function() {
  'use strict';

  /*
    Mixin for ajax loading indicator.
    You should wrap reloaded page area into  div with 'ajax-wrapper' class.
    Also place div with 'loader' class near this area. Add to this div classes 'transparent' and 'without-height',
    if you want to hide loader by default.
    So your component must trigger 'hide-loader' and 'show-loader' events.
  */

  window.withLoaderMixin = function() {
    this.defaultAttrs({
      loaderSelector: '.loader',
      hiddenLoaderClass: 'transparent',
      withoutHeightLoaderClass: 'without-height'
    });
    this.hideLoader = function() {
      this.select('loaderSelector').addClass(this.attr.hiddenLoaderClass);
      return this.select('loaderSelector').addClass(this.attr.withoutHeightLoaderClass);
    };
    this.showLoader = function() {
      this.select('loaderSelector').removeClass(this.attr.withoutHeightLoaderClass);
      return this.select('loaderSelector').removeClass(this.attr.hiddenLoaderClass);
    };
    return this.after('initialize', function() {
      this.on('hide-loader', this.hideLoader);
      return this.on('show-loader', this.showLoader);
    });
  };

}).call(this);
