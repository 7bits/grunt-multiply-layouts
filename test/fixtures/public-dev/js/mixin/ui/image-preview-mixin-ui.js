(function() {
  'use strict';

  window.imagePreviewMixinUI = function() {

    this.defaultAttrs({
      fileInputSelector: "input[type='file']",
      imagePreviewSelector: "data-image-preview"
    });

    this.drawPreview = function(e, data) {
      var that = this;
      var input = e.target;
      var imagePreviewSelector = $(input).attr(this.attr.imagePreviewSelector);
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          that.$node.find(imagePreviewSelector)
            .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
      }
      else {
        var img = input.value;
        that.$node.find(imagePreviewSelector).attr('src', img);
      }
    };

    this.clearImagePreview = function(e, data) {
      var input = this.select('fileInputSelector');
      var imagePreviewSelector = $(input).attr(this.attr.imagePreviewSelector);
      $(imagePreviewSelector).attr('src', '');
    };

    this.after('initialize', function() {
      this.on('change', {fileInputSelector: this.drawPreview});
      this.on('clear-form', this.clearImagePreview);
    });
  };

}).call(this);
