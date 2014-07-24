'use strict';

window.previewStoryComponent = flight.component(
function() {
    this.after('initialize', function() {
        this.on('click', function () {
            this.trigger("click-preview-story", this.$node.data());
        })
    });
});
