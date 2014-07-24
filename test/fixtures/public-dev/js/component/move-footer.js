(function() {
  'use strict';

  window.moveFooter = flight.component(function() {

    this.moveFooterUp = function(e, data) {
      this.$node.css('top', '');
    };

    this.moveFooterDown = function(e, data) {
      var that = this;
      // Holy shit but it's the only way it works correctly in chrome
      setTimeout(function(){
        that.$node.offset({top: $(document).height() - that.$node.outerHeight()});
      }, 500);
    };

    return this.after('initialize', function() {
      var footerUpSelector = $(this.$node.data('footer-up-selector'));
      this.on(footerUpSelector, 'click', this.moveFooterUp);
      var footerDownSelector = $(this.$node.data('footer-down-selector'));
      this.on(footerDownSelector, 'click', this.moveFooterDown);
    });
  });

}).call(this);