(function() {
  'use strict';

  window.sidebarTabs = flight.component(function() {

    this.defaultAttrs({
      tabMenuItemSelector: ".list-group-item",
      activeMenuItemClass: 'active'
    });

    this.menuItemClickHandler = function(e, data) {
      var menuItem;
      menuItem = $(data.el);
      this.select('tabMenuItemSelector').removeClass(this.attr.activeMenuItemClass);
      menuItem.addClass(this.attr.activeMenuItemClass);
    };

    return this.after('initialize', function() {
      return this.on('click', {
        tabMenuItemSelector: this.menuItemClickHandler
      });
    });
  });

}).call(this);
