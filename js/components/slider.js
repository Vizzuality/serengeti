function Slider(el, options) {
  var self = this;

  this.$el = el;
  this.$slider_container = $("#slider_wrapper");

  this.options = {
    timeMin: options.timeMin,
    timeRange: options.timeRange
  };

  this.valueStop = 0;
  this.initialize();
}

Slider.prototype = {
  initialize: function() {
    this.$el.slider();
    this._initBindings();
  },

  _initBindings: function() {
    var self = this;
    Events.on("resumeanimation", this._onResumeAnimation, this);
    Events.on("stopanimation", this._onStopAnimation, this);
    Events.on("refresh", this.updateRanges, this);
    Events.on("resettime", function() {
      self.updateHour(self.options.timeMin);
    });

    Events.on("clickhandle", function(val) {
      clicked = true;
      valueStart = val;

      $(document).on("mousemove", function() {
        dragged = true;
      });
    });

    $(document).on("mouseup", function() {
      if(clicked) {
        self.valueStop = self.$el.slider("value");

        dragged = false;
        clicked = false;

        App.map.play();

        $(this).off('mousemove');
      }
    });

    this.$el
      .on("slide", function(event, ui) {
        self._onSlideStart(ui.value);
      })
      .on("slidestop", function(event, ui) {
        self._onSlideStop(ui.value);
      })
      .find("a")
        .on("mousedown", function() {
          Events.trigger("clickhandle", self.$el.slider("value"));
        })
        .on("click", function() {
          if(valueStart === self.valueStop) {
            if(!stopped) {
              Events.trigger("stopanimation");
            } else {
              Events.trigger("resumeanimation");
            }
          }
        });
  },

  _onSlideStart: function(pos) {
    var time = this.posToTime(pos);

    Events.trigger("changetime", time);

    this.updateHour(time);
  },

  _onSlideStop: function(pos) {
    var time = this.posToTime(pos);

    this.$el.slider("value", pos);

    Events.trigger("changetime", time);

    this.updateHour(time);
  },

  _onResumeAnimation: function() {
    stopped = false;

    $(".ui-slider-handle").removeClass("stopped");

    App.map.play();
  },

  _onStopAnimation: function() {
    stopped = true;

    $(".ui-slider-handle").addClass("stopped");
  },

  updateRanges: function() {
    this.options = {
      timeMin: window.AppData.START_DATE,
      timeRange: (window.AppData.END_DATE - window.AppData.START_DATE) * 1
    }
  },

  updateHour: function(time) {
    var timeUpdated = new Date(time*1000);

    var hours = timeUpdated.getHours();
    var minutes = timeUpdated.getMinutes();
    var date = timeUpdated.getDate();
    var month = timeUpdated.getMonth() + 1;
    var year = timeUpdated.getFullYear();

    minutes = (minutes<10?'0':'') + minutes;

    $("span.current_date").html('<span>' + month + '/' + date + '/' + year + '</span> - ' + hours + ":" + minutes);
  },

  posToTime: function(pos) {
    return pos * this.options.timeRange / 100 + this.options.timeMin;
  },

  timeToPos: function(time) {
    return (time - this.options.timeMin) * 100 / this.options.timeRange;
  },

  set_time: function(time) {
    this.$el.slider("value", this.timeToPos(time));

    this.updateHour(time);
  }
}
