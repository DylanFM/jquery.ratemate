$ = jQuery
  
# Now we'll have a $(...).ratemate() function
$.fn.extend
  ratemate: (opts) ->

    # If we are working on elements
    if this.length
      this.each ->

        el = $ this

        # Let's find out if we're just displaying a rating or providing a control
        if el.is 'input[type="number"]'

          # In control mode we'll be displaying the rating but also allowing the user to set the rating via the stars
          el.data 'ratemate', new RatingControl el, opts

        else if el.is 'meter'

          # In display mode we're reading values from a meter element and displaying them in the rating canvas
          el.data 'ratemate', new RatingDisplay el, opts

        # If the element is not a meter or input[type=number], don't do anything

##################################################
##################################################

# This is the rating display
# It's a Raphaël canvas with starts showing the rating
class RatingDisplay

  constructor: (el, opts) ->
    # Let's keep a jQuery object in here
    @el = $ el
    # Merge the default options with the supplied ones
    @opts = $.extend {}, @defaults, opts
    # Make sure this isn't ratemated already
    unless @el.hasClass 'has_ratemate'
      @setRating @el.attr 'value'
      # Add a class to show this is going on
      @el.addClass 'has_ratemate'
      # We're going to put the display in a sibling
      @mate = $ '<div class="ratemate"></div>'
      # Insert it after the element
      @el.after @mate
      # Let's do the important stuff now...
      @buildCanvas()

  defaults:
    width: 112
    height: 32

  setRating: (value) ->
    # Set it in this class
    @rating = parseInt value, 10
    # Set it on the element
    @el.attr 'value', @rating

  # This is just going to call a couple of methods responsible for setting this up
  buildCanvas: ->
    # We want a Raphaël canvas containing stars whose characteristics show the rating
    @canvas = Raphael @mate.get()[0], @opts.width, @opts.height 
    # Paint the picture
    @attackCanvas()

  # We want to put stars in the canvas to show the rating
  attackCanvas: ->
    # This path string is a star from Dmitri's icons, alongside default styles
    star = 
      path: "M15.999,22.77l-8.884,6.454l3.396-10.44l-8.882-6.454l10.979,0.002l2.918-8.977l0.476-1.458l3.39,10.433h10.982l-8.886,6.454l3.397,10.443L15.999,22.77L15.999,22.77z"
      attr:
        stroke: '#ecc000'
        scale: '.5,.5'

    # This isn't abstracted, but it works
    # We're just creating 5 stars and positioning them
    star1 = @canvas.path(star.path).attr(star.attr)
    star2 = star1.clone().translate 20, 0
    star3 = star2.clone().translate 20, 0
    star4 = star3.clone().translate 20, 0
    star5 = star4.clone().translate 20, 0
    # Now we're collecting them together in an array
    @stars = [star1, star2, star3, star4, star5]

    # OK, hovering and clicking the stars isn't so user friendly
    # let's make larger targets that sit above the stars
    rect_attrs = { fill: 'white', opacity: 0 }
    rect1 = @canvas.rect(6, 6, 20, 20).attr rect_attrs
    rect2 = @canvas.rect(26, 6, 20, 20).attr rect_attrs
    rect3 = @canvas.rect(46, 6, 20, 20).attr rect_attrs
    rect4 = @canvas.rect(66, 6, 20, 20).attr rect_attrs
    rect5 = @canvas.rect(86, 6, 20, 20).attr rect_attrs
    # Collect them together like the stars
    @rects = [rect1, rect2, rect3, rect4, rect5]

    # Now let's show it
    @showRating()

  # Clear the shown rating
  clear: ->
    for star in @stars
      star.attr
        fill: 'none'

  showRating: (rating) ->
    rating = rating or @rating
    # First, clear any current rating shown
    @clear()
    # We're grabbing the stars relevant to this rating using a range
    for i in [0...rating]
      # For active stars we'll style them
      @stars[i].attr
        fill: '125-#ecc000-#fffbcf'

##################################################

# The rating control extends the rating display and allows for controlling the value of the input

class RatingControl extends RatingDisplay

  constructor: (el, opts) ->
    super el, opts
    @makeControllable()

  # By clicking a star we're going to set the rating which will be reflected as the input's value
  makeControllable: ->

    # Track that this is a control as well as display
    @mate.addClass 'control'

    # Loop through the rects
    for i in [0...@rects.length]

      # Set the rect and val for use below
      rect = @rects[i]
      val = i + 1

      # When a star is clicked
      rect.click (e) =>
        # Set the rating
        @setRating val
        # and show it
        @showRating()

      # When a star is moused over
      rect.mouseover (e) =>
        # Show its value
        @showRating val

      # When a star is no longer moused over
      rect.mouseout (e) =>
        # If there's a rating, show the rating
        if @rating
          @showRating()
        # or clear the ratings
        else 
          @clear()

