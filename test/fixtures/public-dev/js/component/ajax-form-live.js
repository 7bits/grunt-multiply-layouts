(function() {
  'use strict';

  window.ajaxFormLive = flight.component(window.ajaxFormMixinData, window.ajaxFormLiveMixinData, window.ajaxFormMixinUI,
    window.withLoaderMixin, window.imagePreviewMixinUI, function() {

    this.getFormMessages = function(serverResponse) {
      return {
        'errors': serverResponse.errors,
        'successMsg': serverResponse.successMessage,
        'errorMsg': serverResponse.errorMessage
      };
    };

    this.submitHandler = function(e, data) {
//      if (data.successMessage && data.successMessage !== '') {
//        this.trigger('clear-form', {});
//      }
      if (data.successMessage && data.successMessage !== '' && data.redirectUrl) {
        window.location = data.redirectUrl;
      }
    };

    this.after('initialize', function() {
      this.on('form-submitted', this.submitHandler);
    });
  });

}).call(this);
