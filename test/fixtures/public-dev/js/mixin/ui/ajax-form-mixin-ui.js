(function() {
  'use strict';

  /*
  
    UI mixin for forms which are submitted via ajax.
  
    Each field should have wrapper with 'js-field-wrap' class and container with class 'js-field-error' inside this wrapper.
    General error message will be displayed in container with class 'js-error-msg'.
    General success message will be displayed in container with class 'js-success-msg'.
  
    Mixin listens 'clear-all-form-messages' event and remove all success and error messages in consequence of it.
    Mixin listens 'ui-show-messages' event and show all success and error messages from event data.
  
    Your component should define getFormMessages() function which returns object with messages extracted from server response.
  
    Example
    this.getFormMessages = (serverResponse) ->
      {
        'errors': serverResponse.formResult.errors,
        'successMsg': serverResponse.formResult.successMessage,
        'errorMsg': serverResponse.formResult.errorMessage
      };
  
    Error for specific field will be displayed in container with class '.js-' + field_name_from_server_response + '-error-wrap'.
  */

  window.ajaxFormMixinUI = function() {

    this.defaultAttrs({
      filedErrorWrapSelector: '.js-field-error',
      successMsgWrapSelector: '.js-success-msg',
      errorMsgWrapSelector: '.js-error-msg',
      fieldWrapSelector: '.js-field-wrap',
      withErrorsClass: 'has-error'
    });

    this.showFormMessages = function(e, data) {
      var formMessages;
      formMessages = this.getFormMessages(data);
      this.showErrors(formMessages['errors']);
      this.showSuccessMsg(formMessages['successMsg']);
      return this.showErrorMsg(formMessages['errorMsg']);
    };

    this.showSuccessMsg = function(msg) {
      this.select('successMsgWrapSelector').html(msg);
      if (msg && msg !== '') {
        return this.select('successMsgWrapSelector').show();
      } else {
        return this.select('successMsgWrapSelector').hide();
      }
    };

    this.showErrorMsg = function(msg) {
      this.select('errorMsgWrapSelector').html(msg);
      if (msg && msg !== '') {
        return this.select('errorMsgWrapSelector').show();
      } else {
        return this.select('errorMsgWrapSelector').hide();
      }
    };

    this.showErrors = function(formErrors) {
      var name, text, that, _results;
      this.select('filedErrorWrapSelector').html('');
      this.select('fieldWrapSelector').removeClass(this.attr.withErrorsClass);
      that = this;
      _results = [];
      for (name in formErrors) {
        text = formErrors[name];
        that.$node.find('.js-' + name + '-error-wrap').html(text);
        _results.push(that.$node.find('.js-' + name + '-error-wrap').parents(that.attr.fieldWrapSelector).addClass(that.attr.withErrorsClass));
      }
      return _results;
    };

    this.hideAllFormMessages = function(e, data) {
      this.select('filedErrorWrapSelector').html('');
      this.select('successMsgWrapSelector').hide();
      this.select('errorMsgWrapSelector').hide();
      return this.select('fieldWrapSelector').removeClass(this.attr.withErrorsClass);
    };

    this.clearForm = function(e, data) {
      var $form = this.$node.find('form');
      $form.find('input').val("");
      $form.find('textarea').val("");
      $form.find('select').prop('selectedIndex', 0);
      // Clear CKEDITOR
      var ckeditors = CKEDITOR.instances;
      var ckInstances = Object.keys(ckeditors);
      for (var i=0; i<ckInstances.length; i++) {
        ckeditors[ckInstances[i]].setData('', function(){return;})
      }
    };

    return this.after('initialize', function() {
      this.on('ui-show-messages', this.showFormMessages);
      this.on('clear-form', this.clearForm);
      this.on(document, 'clear-all-form-messages', this.hideAllFormMessages);
      return this.hideAllFormMessages();
    });
  };

}).call(this);
