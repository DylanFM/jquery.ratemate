$ = jQuery
  
# Now we'll have a $(...).ratemate() function
$.fn.extend
  ratemate: (opts) ->

    # If we are working on elements
    if this.length
      this.each ->

        el = $ this

        # Read the attributes and use them as options, but override with passed options
        attrs =
          max: el.attr('max')
          min: el.attr('min')
          value: el.attr('value')

        opts = $.extend {}, attrs, opts

        # Let's find out if we're just displaying a rating or providing a control
        if el.is 'input[type="text"],input[type="number"],input[type="range"]'

          # In control mode we'll be displaying the rating but also allowing the user to set the rating via the stars
          el.data 'ratemate', new RatingControl el, opts

        else if el.is 'meter'

          # In display mode we're reading values from a meter element and displaying them in the rating canvas
          el.data 'ratemate', new RatingDisplay el, opts

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
      @setupCanvas()

  defaults:
    max: 5
    width: 160
    height: 32
    drawSymbol: ->
      # this is the canvas
      @path 'M15.999,22.77l-8.884,6.454l3.396-10.44l-8.882-6.454l10.979,0.002l2.918-8.977l0.476-1.458l3.39,10.433h10.982l-8.886,6.454l3.397,10.443L15.999,22.77L15.999,22.77z'
    symbol_width: 32 #At a 1:1 scale, the star's width is 32px
    stroke: '#ecc000'
    fill: '125-#ecc000-#fffbcf'

  # Add a custom method to the Raphaël canvas to draw the symbol
  # We're also creating a namespace for other ratemate custom methods
  makeStarMethod: ->
    unless Raphael.fn.ratemate?
      Raphael.fn.ratemate =
        symbol: @opts.drawSymbol

  setRating: (value) ->
    # Set it in this class
    @rating = parseInt value, 10
    # Set it on the element
    @el.val @rating

  # This is just going to call a couple of methods responsible for setting this up
  setupCanvas: ->
    # Setup the ability to attack
    @makeStarMethod()
    # We want a Raphaël canvas containing stars whose characteristics show the rating
    @canvas = Raphael @mate.get()[0], @opts.width, @opts.height
    # Paint the picture
    @attackCanvas()

  # We want to put stars in the canvas to show the rating
  attackCanvas: ->

    # Let's work out what the container needs
    star_width =  @opts.width/@opts.max
    scale = star_width/@opts.symbol_width

    # Create the stars
    @stars = []
    @rects = [] # The rects sit above the stars to create a larger hover area 

    for i in [0...@opts.max]

      # Create the star
      star = @canvas.ratemate.symbol()
      # Style it
      star.attr
        stroke: @opts.stroke
      # Scale to fit
      star.scale scale, scale, 0, 0
      # Position it
      star.translate i * star_width, 0

      # OK, hovering and clicking the stars isn't so user friendly let's make larger targets that sit above the stars
      # TODO: only add when controllable
      rect = @canvas.rect i * star_width, 0, star_width, star_width
      rect.attr
        fill: '#fff'
        opacity: 0

      @rects.push rect
      @stars.push star

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
        fill: @opts.fill


  flashStar: (key) ->

    star = @stars[key]
    if star?
      star.animate { opacity: 0 }, 100, ->
        star.animate { opacity: 1 }, 100

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

      do (val, rect) =>

        # When a star is clicked
        rect.click (e) =>
          # Set the rating
          @setRating val
          # Flash the star
          @flashStar (val - 1)
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

