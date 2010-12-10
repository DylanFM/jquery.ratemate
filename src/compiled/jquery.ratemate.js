(function() {
  var $, RatingControl, RatingDisplay;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  $.fn.extend({
    ratemate: function(opts) {
      if (this.length) {
        return this.each(function() {
          var el;
          el = $(this);
          if (el.is('input[type="number"],input[type="range"]')) {
            return el.data('ratemate', new RatingControl(el, opts));
          } else if (el.is('meter')) {
            return el.data('ratemate', new RatingDisplay(el, opts));
          }
        });
      }
    }
  });
  RatingDisplay = function() {
    function RatingDisplay(el, opts) {
      this.el = $(el);
      this.opts = $.extend({}, this.defaults, opts);
      if (!this.el.hasClass('has_ratemate')) {
        this.setRating(this.el.attr('value'));
        this.el.addClass('has_ratemate');
        this.mate = $('<div class="ratemate"></div>');
        this.el.after(this.mate);
        this.setupCanvas();
      }
    }
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
      if (Raphael.fn.ratemate == null) {
        return Raphael.fn.ratemate = {
          symbol: this.opts.drawSymbol
        };
      }
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
      var i, rect, scale, star, star_width, _ref;
      star_width = this.opts.width / this.opts.max;
      scale = star_width / this.opts.symbol_width;
      this.stars = [];
      this.rects = [];
      for (i = 0, _ref = this.opts.max; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
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
      var star, _i, _len, _ref, _results;
      _ref = this.stars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        star = _ref[_i];
        _results.push(star.attr({
          fill: 'none'
        }));
      }
      return _results;
    };
    RatingDisplay.prototype.showRating = function(rating) {
      var i, _results;
      rating = rating || this.rating;
      this.clear();
      _results = [];
      for (i = 0; (0 <= rating ? i < rating : i > rating); (0 <= rating ? i += 1 : i -= 1)) {
        _results.push(this.stars[i].attr({
          fill: this.opts.fill
        }));
      }
      return _results;
    };
    return RatingDisplay;
  }();
  RatingControl = function() {
    function RatingControl(el, opts) {
      RatingControl.__super__.constructor.call(this, el, opts);
      this.makeControllable();
    }
    __extends(RatingControl, RatingDisplay);
    RatingControl.prototype.makeControllable = function() {
      var _fn, _ref, _results;
      this.mate.addClass('control');
      _fn = function(i) {
        var rect, val;
        rect = this.rects[i];
        val = i + 1;
        rect.click(__bind(function(e) {
          this.setRating(val);
          return this.showRating();
        }, this));
        rect.mouseover(__bind(function(e) {
          return this.showRating(val);
        }, this));
        return _results.push(rect.mouseout(__bind(function(e) {
          if (this.rating) {
            return this.showRating();
          } else {
            return this.clear();
          }
        }, this)));
      };
      _results = [];
      for (i = 0, _ref = this.rects.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        _fn.call(this, i);
      }
      return _results;
    };
    return RatingControl;
  }();
}).call(this);
