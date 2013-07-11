

function Map(options) {
  this.map = null;
  this.dinamycLayer = null;
  this.options = options;
  this.previous_time = new Date().getTime();

  this.init();
}

Map.prototype = {
  init: function(done) {
    var self = this;

    window.Vis = cartodb.createVis('map', 'http://aliburchard.cartodb.com/api/v2/viz/478cff38-e976-11e2-bd16-576d7b21a2e9/viz.json').done(function(vis, layers) {
      self.map = vis.getNativeMap();

      self.dinamycLayer = new L.TimeLayer({
        start_date: window.AppData.START_DATE,
        end_date: window.AppData.END_DATE
      });

      self.map.addLayer(self.dinamycLayer);
      self._tick = self._tick.bind(self);
      self.previous_time = new Date().getTime();

      requestAnimationFrame(self._tick);

      cartodb.createLayer(
        self.map,
        'http://aliburchard.cartodb.com/api/v2/viz/66bdc0fa-ea47-11e2-aa4b-e57f5a8df689/viz.json'
      ).addTo(self.map)

    });

    Events.on("resettime", function() {
      if(self.dinamycLayer) {
        self.dinamycLayer.set_time(window.AppData.START_DATE);
      }
    });

    Events.on("refresh", function() {
      self._resetDinamycLayer();
    });
  },

  _resetDinamycLayer: function() {
    this.map.removeLayer(this.dinamycLayer);
    
    this.dinamycLayer = new L.TimeLayer({
      start_date: window.AppData.START_DATE,
      end_date: window.AppData.END_DATE
    });

    this.map.addLayer(this.dinamycLayer);
  },

  _tick: function() {
    var self = this;

    var now = new Date().getTime();
    var delta =  0.001*(now - this.previous_time);
    this.previous_time = now;

    if(this.dinamycLayer && !stopped && !clicked) {
      delta = Math.min(0.03, delta);
      this.dinamycLayer._render(delta);

      setTimeout(function() {
        requestAnimationFrame(self._tick);
      }, 1);
    }
  },

  play: function() {
    requestAnimationFrame(this._tick);
  },

  set_time: function(t) {
    if(this.dinamycLayer && (dragged)) {
      this.dinamycLayer.set_time(t);
    }
  }
}
