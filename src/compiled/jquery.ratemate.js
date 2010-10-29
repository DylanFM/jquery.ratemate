(function() {
  var $, setup;
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
    return console.log("Setting up");
  };
}).call(this);
