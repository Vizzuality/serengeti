var App = {
  animables: [], // list of objects need to be updated and rendered
  old_time: window.AppData.START_DATE,
  time: window.AppData.START_DATE,
  last_time: window.AppData.END_DATE,

  initialize: function(options) {
    var self = this;

    this.options = _.extend({}, options);

    // Map
    this.map = new Map();

    // Switch
    this.switch = new Switch($('.specie_select'));

    // Time frame
    this.time_frame = new TimeFrame($('.time_select'));

    // Date inputs
    this.date_inputs = new DateInputs($('.dates'));

    // ****
    // Map animated particled
    // ****

    // Slider
    this.slider = new Slider($('#slider'), {
      timeMin: window.AppData.START_DATE,
      timeRange: (window.AppData.END_DATE - window.AppData.START_DATE) * 1
    });

    this._initBindings();
    this._bindActions();
    
    this.animables.push(this.map, this.slider);
    this._tick = this._tick.bind(this);

    setTimeout(function() {
      requestAnimationFrame(self._tick);
    }, 1);
  },

  _initBindings: function() {
    var self = this;

    Events.on("resumeanimation", this._onResumeAnimation, this);
    Events.on("stopanimation", this._onStopAnimation, this);

    Events.on("changetime", function(time) {
      self.time = time >> 0;
    });

    Events.on("resettime", function(time) {
      self.time = window.AppData.START_DATE >> 0;
    });
  },

  _bindActions: function() {
    $('a.apply').click(function(e) {
      e.preventDefault();
      Events.trigger("resettime");
      Events.trigger("refresh");
    });

    $('a.animation').click(function(e) {
      e.preventDefault();
      if ($(this).hasClass('play')) {
        Events.trigger("stopanimation");
        $(this).removeClass('play').addClass('stop');
        $(this).text('PLAY');
      } else {
        Events.trigger("resumeanimation");
        $(this).removeClass('stop').addClass('play');
        $(this).text('STOP');
      }
    });
  },

  _tick: function() {
    var self = this;

    this.tick();

    if($.browser.safari) {
      // for some reason in safari when the animations is heavy the UI thread gets blocked
      // so we need to give some time to be able to get mouse events
      // thanks to iker jimenez (@navedelmisterio) for the inspiration
      setTimeout(function() {
        requestAnimationFrame(self._tick);
      }, 1);
    } else {
      requestAnimationFrame(self._tick);
    }
  },

  tick: function() {
    var animables = this.animables;
    var t0 = new Date().getTime();
    var dt = 0.001*(t0 - this.old_time);

    dt = dt* (window.AppData.STEP) *window.AppData.ANIMATION_SCALE;
    dt = Math.min( ( window.AppData.STEP ) * window.AppData.ANIMATION_SCALE, dt); // dont allow the time advance more than 15 mins
    this.old_time = t0;

    if(!stopped && !clicked){
      this.time += dt;

      if(this.time >= this.last_time) {
        Events.trigger("resettime");
      }

      for(var i = 0; i < animables.length; ++i) {
        var a = animables[i];

        a.set_time(this.time);
      }
    } else if(dragged) {
      for(var i = 0; i < animables.length; ++i) {
        var a = animables[i];

        a.set_time(this.time);
      }
    }
  }
};