(function() {
  'use strict';

  window.confirmModal = flight.component(function() {
    this.defaultAttrs({
      successBtnSelector: ".js-success-btn"
    });
    this.showConfirmModal = function(e, data) {
      e.preventDefault();
      this.$node.modal('show');
      return this.select('successBtnSelector').attr('href', data);
    };
    return this.after('initialize', function() {
      return this.on(document, 'show-confirm-modal', this.showConfirmModal);
    });
  });

}).call(this);