function DateInputs(el) {
  this.$el = el;
  this.initialize();
}

DateInputs.prototype = {
  initialize: function() {

    this.$el.find('input.start').datepicker({
      onSelect: function(date) {
        var start = new Date(date).getTime() / 1000;

        if (window.AppData.END_DATE > start && start != window.AppData.START_DATE) {
          window.AppData.START_DATE = start;
          window.AppData.STEPS = ((window.AppData.END_DATE - window.AppData.START_DATE)  / window.AppData.STEP) * 1;
        }
      }
    });

    this.$el.find('input.end').datepicker({
      onSelect: function(date) {
        var end = new Date(date).getTime() / 1000;

        if (window.AppData.START_DATE < end && end != window.AppData.END_DATE) {
          window.AppData.END_DATE = end;
          window.AppData.STEPS = ((window.AppData.END_DATE - window.AppData.START_DATE)  / window.AppData.STEP) * 1;
        }
      }
    });
  },

  render: function() {}
}
