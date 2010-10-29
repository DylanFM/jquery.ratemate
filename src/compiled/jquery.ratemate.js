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
    return new RatingDisplay(el, el.attr('value'));
  };
  RatingDisplay = function(el, _arg) {
    this.rating = _arg;
    this.el = $(el);
    if (!(this.el.hasClass('has_ratemate'))) {
      this.el.addClass('has_ratemate');
      this.mate = $('<div class="ratemate"></div>');
      this.el.after(this.mate);
      this.buildCanvas();
    }
    return this;
  };
  RatingDisplay.prototype.buildCanvas = function() {
    this.canvas = Raphael(this.mate.get()[0], 110, 30);
    return this.attackCanvas();
  };
  RatingDisplay.prototype.attackCanvas = function() {
    var _ref, _result, i, star, star1, star2, star3, star4, star5;
    star = {
      path: "M15.999,22.77l-8.884,6.454l3.396-10.44l-8.882-6.454l10.979,0.002l2.918-8.977l0.476-1.458l3.39,10.433h10.982l-8.886,6.454l3.397,10.443L15.999,22.77L15.999,22.77z",
      attr: {
        stroke: '#ecc000',
        scale: '.5,.5'
      }
    };
    star1 = this.canvas.path(star.path).attr(star.attr);
    star2 = star1.clone().translate(20, 0);
    star3 = star2.clone().translate(20, 0);
    star4 = star3.clone().translate(20, 0);
    star5 = star4.clone().translate(20, 0);
    this.stars = [star1, star2, star3, star4, star5];
    _result = []; _ref = this.rating;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      _result.push(this.stars[i].attr({
        fill: '125-#ecc000-#fffbcf'
      }));
    }
    return _result;
  };
}).call(this);
