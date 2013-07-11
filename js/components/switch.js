function Switch(el) {
  this.$el = el;

  this.dynamicEnabled = false;

  this.initialize();
}

Switch.prototype = {
  initialize: function() {
    var self = this;

    this.$el.select2({ minimumResultsForSearch: 20 });

    this.$el.on('change', function(e) {
      var chosen = $(this).val();
      window.AppData.SPECIE = chosen.toLowerCase();
      self._changeImage(chosen);
      // Event.trigger('refresh');
    });
  },

  render: function() {},
  
  _changeImage: function(specie) {
    var $el = this.$el.closest('div').find('span.image');
    $el
      .removeAttr('class')
      .addClass('image ' + specie);
  }
}
