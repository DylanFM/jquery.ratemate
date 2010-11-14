(function() {
  var $, RatingControl, RatingDisplay;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  }, __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  $ = jQuery;
  $.fn.extend({
    ratemate: function(opts) {
      return this.length ? this.each(function() {
        var el;
        el = $(this);
        if (el.is('input[type="number"]')) {
          return el.data('ratemate', new RatingControl(el, opts));
        } else if (el.is('meter')) {
          return el.data('ratemate', new RatingDisplay(el, opts));
        }
      }) : null;
    }
  });
  RatingDisplay = function(el, opts) {
    this.el = $(el);
    this.opts = $.extend({}, this.defaults, opts);
    if (!(this.el.hasClass('has_ratemate'))) {
      this.setRating(this.el.attr('value'));
      this.el.addClass('has_ratemate');
      this.mate = $('<div class="ratemate"></div>');
      this.el.after(this.mate);
      this.setupCanvas();
    }
    return this;
  };
  RatingDisplay.prototype.defaults = {
    max: 5,
    width: 160,
    height: 32,
    drawSymbol: function() {
      return this.path('M15.999,22.77l-8.884,6.454l3.396-10.44l-8.882-6.454l10.979,0.002l2.918-8.977l0.476-1.458l3.39,10.433h10.982l-8.886,6.454l3.397,10.443L15.999,22.77L15.999,22.77z');
    },
    symbol_width: 32,
    stroke: '#ecc000',
    fill: '125-#ecc000-#fffbcf'
  };
  RatingDisplay.prototype.makeStarMethod = function() {
    var _ref;
    return !(typeof (_ref = Raphael.fn.ratemate) !== "undefined" && _ref !== null) ? (Raphael.fn.ratemate = {
      symbol: this.opts.drawSymbol
    }) : null;
  };
  RatingDisplay.prototype.setRating = function(value) {
    this.rating = parseInt(value, 10);
    return this.el.attr('value', this.rating);
  };
  RatingDisplay.prototype.setupCanvas = function() {
    this.makeStarMethod();
    this.canvas = Raphael(this.mate.get()[0], this.opts.width, this.opts.height);
    return this.attackCanvas();
  };
  RatingDisplay.prototype.attackCanvas = function() {
    var _ref, i, rect, scale, star, star_width;
    star_width = this.opts.width / this.opts.max;
    scale = star_width / this.opts.symbol_width;
    this.stars = [];
    this.rects = [];
    _ref = this.opts.max;
    for (i = 0; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      star = this.canvas.ratemate.symbol();
      star.attr({
        stroke: this.opts.stroke
      });
      star.scale(scale, scale);
      star.translate(i * star_width, 0);
      rect = this.canvas.rect(i * star_width, 0, star_width, star_width);
      rect.attr({
        fill: '#fff',
        opacity: 0
      });
      this.rects.push(rect);
      this.stars.push(star);
    }
    return this.showRating();
  };
  RatingDisplay.prototype.clear = function() {
    var _i, _len, _ref, _result, star;
    _result = []; _ref = this.stars;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      star = _ref[_i];
      _result.push(star.attr({
        fill: 'none'
      }));
    }
    return _result;
  };
  RatingDisplay.prototype.showRating = function(rating) {
    var _result, i;
    rating = rating || this.rating;
    this.clear();
    _result = [];
    for (i = 0; (0 <= rating ? i < rating : i > rating); (0 <= rating ? i += 1 : i -= 1)) {
      _result.push(this.stars[i].attr({
        fill: this.opts.fill
      }));
    }
    return _result;
  };
  RatingControl = function(el, opts) {
    RatingControl.__super__.constructor.call(this, el, opts);
    this.makeControllable();
    return this;
  };
  __extends(RatingControl, RatingDisplay);
  RatingControl.prototype.makeControllable = function() {
    var _i, _ref, _result, i;
    this.mate.addClass('control');
    _result = []; _ref = this.rects.length;
    for (_i = 0; (0 <= _ref ? _i < _ref : _i > _ref); (0 <= _ref ? _i += 1 : _i -= 1)) {
      (function() {
        var rect, val;
        var i = _i;
        return _result.push((function() {
          rect = this.rects[i];
          val = i + 1;
          rect.click(__bind(function(e) {
            this.setRating(val);
            return this.showRating();
          }, this));
          rect.mouseover(__bind(function(e) {
            return this.showRating(val);
          }, this));
          return rect.mouseout(__bind(function(e) {
            return this.rating ? this.showRating() : this.clear();
          }, this));
        }).call(this));
      }).call(this);
    }
    return _result;
  };
}).call(this);
