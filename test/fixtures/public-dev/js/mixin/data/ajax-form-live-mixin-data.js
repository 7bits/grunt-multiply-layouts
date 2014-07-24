(function() {
  'use strict';

  window.ajaxFormLiveMixinData = function() {
    var that;

    this.defaultAttrs({
      inputSelector: "input[type!='file']",
      inputFileSelector: "input[type='file']",
      selectSelector: "select",
      textareaSelector: "textarea",
      fieldOut: "_fieldout",
      deleteSelector: "button[name='delete']",
      deleteUrl: "data-url"
    });

    this.verifyForm = function(e, data) {
      var $form, ajaxUrl, formData;
      $form = that.$node.find('form');

      // If there are CKEDITOR somewhere, looking for associated textarea and synchronize it
      // Works correctly only with one instance
      var ckName;
      if (e.editor != null) {
        var ckSelector = "#" + e.editor.name;
        ckName = $(ckSelector).attr("name");
        $(ckSelector).val(CKEDITOR.instances[ckName].getData());
      }

      // Now we can serialize form
      formData = $form.serialize();

      // If it's file input, fill it with something if it's presented
      var filled = "filled";
      var fileInputs = that.$node.find('input[type="file"]');
      if (fileInputs.length != null && fileInputs.length > 0) {
        for (var i=0; i<fileInputs.length; i++) {
          if ((fileInputs[i].files && fileInputs[i].files[0])){
            formData += "&" + fileInputs.eq(i).attr("name") + "=" + filled;
          }
        }
      }

      // If there are CKEDITOR somewhere, filling last input name in case it's undefined
      var inputName;
      if (e.target) {
        inputName = $(e.target).attr("name");
      } else {
        inputName = ckName;
      }

      formData += "&" + that.attr.fieldOut + "=" + inputName;
      ajaxUrl = $form.data('ajax-check-url');
      $(document).trigger('clear-all-form-messages');
      return $.ajax(ajaxUrl, {
        type: 'POST',
        data: formData,
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {
          that.trigger('ui-show-messages', {errorMessage: textStatus + "(" + errorThrown + ")"});
        },
        success: function(data, textStatus, jqXHR) {
          if(data.errorMessage) {
            that.trigger('ui-show-messages', data);
          }
        }
      });
    };

    this.deleteEntity = function(e, data) {
      var url = $(e.target).attr(this.attr.deleteUrl);
      $(document).trigger('show-confirm-modal', url);
    };

    return this.after('initialize', function() {
      that = this;
      var textareaId = this.select('textareaSelector').attr('id');
      // CKEDITOR event catching
      CKEDITOR.instances[textareaId].on('blur', this.verifyForm);
      // For file upload forms
      this.on('change', {inputFileSelector: this.verifyForm});
      // For any form inputs
      this.on('focusout', {
        inputSelector: this.verifyForm,
        selectSelector: this.verifyForm,
        textareaSelector: this.verifyForm
      });
      this.on('click', {deleteSelector: this.deleteEntity});
    });
  };

}).call(this);
