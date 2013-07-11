function TimeFrame(el) {
  this.$el = el;
  this.initialize();
}

TimeFrame.prototype = {
  initialize: function() {
    this.$el.select2({ minimumResultsForSearch: 20 });

    this.$el.on('change', function(e) {
      var chosen = $(this).find("option:selected").val();

      window.AppData.STEP = chosen;
      window.AppData.STEPS = (window.AppData.END_DATE - window.AppData.START_DATE)  / window.AppData.STEP;
    })
  },

  render: function() {}
}
