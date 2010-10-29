$ = jQuery
  
# Now we'll have a $(...).ratemate() function
$.fn.extend
  ratemate: (options) ->
    # Merge the default options with the supplied ones
    opts = $.extend {}, $.fn.ratemate.defaults, options
    # If we are working on elements
    if this.length
      # Set up the ratemate
      this.each setup

# These are the default options for ratemate
$.fn.ratemate.defaults = {}

# The first thing run on a ratemate element, just starts things off
setup = ->
  el = $ this
  # We only want to work on meter or input elements
  # Let's find out if we're just displaying a rating or providing a control
  if el.is 'input[type="number"]'
    # We're providing a control
    setupControl(el)
  else if el.is 'meter'
    # We're just displaying the rating shown in the meter element
    setupDisplay(el)
  # If the element is not what we're after, don't do anything

# Only used for setting up a display ratemate
setupDisplay = (el) ->
  # In display mode we're reading values from a meter element and displaying them in the rating canvas
  new RatingDisplay el, el.attr('value')

##################################################
##################################################

# This is the rating display
# It's a Raphaël canvas with starts showing the rating
class RatingDisplay

  constructor: (el, @rating) ->
    # Let's keep a jQuery object in here
    @el = $ el
    # Add a class to show this is going on
    @el.addClass 'has_ratemate'
    # We're going to put the display in a sibling
    @mate = $ '<div class="ratemate"></div>'
    # Insert it after the element
    @el.after @mate
    # Let's do the important stuff now...
    @buildCanvas()

  # More convenient
  getMate: ->
    # Just gets the DOM element
    @mate.get()[0]

  # This is just going to call a couple of methods responsible for setting this up
  buildCanvas: ->
    # First of all, we need a canvas
    @createCanvas()
    # Paint the picture
    @attackCanvas()

  # Init the Raphaël canvas in the element
  createCanvas: ->
    # We want a Raphaël canvas containing stars whose characteristics show the rating
    @canvas = Raphael @getMate(), 400, 70

  # We want to put stars in the canvas to show the rating
  attackCanvas: ->
    # This path string is a star from Dmitri's icons
    star = "M15.999,22.77l-8.884,6.454l3.396-10.44l-8.882-6.454l10.979,0.002l2.918-8.977l0.476-1.458l3.39,10.433h10.982l-8.886,6.454l3.397,10.443L15.999,22.77L15.999,22.77z"
    # Let's add a start and paint a border
    @canvas.path(star).attr
      stroke: '#ecc000'

