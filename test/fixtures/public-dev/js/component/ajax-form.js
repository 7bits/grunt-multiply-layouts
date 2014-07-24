(function() {
  'use strict';

  window.ajaxForm = flight.component(window.ajaxFormMixinData, window.ajaxFormMixinUI, window.withLoaderMixin, function() {
    this.getFormMessages = function(serverResponse) {
      return {
        'errors': serverResponse.errors,
        'successMsg': serverResponse.successMessage,
        'errorMsg': serverResponse.errorMessage
      };
    };
    this.submitHandler = function(e, data) {
      if (data.successMessage && data.successMessage !== '' && data.redirectUrl) {
        return window.location = data.redirectUrl;
      }
    };
    return this.after('initialize', function() {
      return this.on('form-submitted', this.submitHandler);
    });
  });

}).call(this);
