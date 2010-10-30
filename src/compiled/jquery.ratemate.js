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
    ratemate: function(options) {
      var opts;
      opts = $.extend({}, $.fn.ratemate.defaults, options);
      return this.length ? this.each(function() {
        var el;
        el = $(this);
        if (el.is('input[type="number"]')) {
          return el.data('ratemate', new RatingControl(el));
        } else if (el.is('meter')) {
          return el.data('ratemate', new RatingDisplay(el));
        }
      }) : null;
    }
  });
  $.fn.ratemate.defaults = {};
  RatingDisplay = function(el) {
    this.el = $(el);
    if (!(this.el.hasClass('has_ratemate'))) {
      this.setRating(this.el.attr('value'));
      this.el.addClass('has_ratemate');
      this.mate = $('<div class="ratemate"></div>');
      this.el.after(this.mate);
      this.buildCanvas();
    }
    return this;
  };
  RatingDisplay.prototype.setRating = function(value) {
    this.rating = parseInt(value, 10);
    return this.el.attr('value', this.rating);
  };
  RatingDisplay.prototype.buildCanvas = function() {
    this.canvas = Raphael(this.mate.get()[0], 110, 30);
    return this.attackCanvas();
  };
  RatingDisplay.prototype.attackCanvas = function() {
    var rect1, rect2, rect3, rect4, rect5, rect_attrs, star, star1, star2, star3, star4, star5;
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
    rect_attrs = {
      fill: 'white',
      opacity: 0
    };
    rect1 = this.canvas.rect(6, 6, 20, 20).attr(rect_attrs);
    rect2 = this.canvas.rect(26, 6, 20, 20).attr(rect_attrs);
    rect3 = this.canvas.rect(46, 6, 20, 20).attr(rect_attrs);
    rect4 = this.canvas.rect(66, 6, 20, 20).attr(rect_attrs);
    rect5 = this.canvas.rect(86, 6, 20, 20).attr(rect_attrs);
    this.rects = [rect1, rect2, rect3, rect4, rect5];
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
        fill: '125-#ecc000-#fffbcf'
      }));
    }
    return _result;
  };
  RatingControl = function(el) {
    RatingControl.__super__.constructor.call(this, el);
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
