(function() {
  var $, RatingDisplay, setup, setupDisplay;
  $ = jQuery;
  $.fn.extend({
    ratemate: function(options) {
      var opts;
      opts = $.extend({}, $.fn.ratemate.defaults, options);
      return this.length ? this.each(setup) : null;
    }
  });
  $.fn.ratemate.defaults = {};
  setup = function() {
    var el;
    el = $(this);
    if (el.is('input[type="number"]')) {
      return setupControl(el);
    } else if (el.is('meter')) {
      return setupDisplay(el);
    }
  };
  setupDisplay = function(el) {
    return new RatingDisplay(el);
  };
  RatingDisplay = function(el) {
    this.el = $(el);
    this.el.addClass('has_ratemate');
    this.buildCanvas();
    return this;
  };
  RatingDisplay.prototype.buildCanvas = function() {};
}).call(this);
