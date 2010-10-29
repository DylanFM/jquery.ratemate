$ = jQuery
  
$.fn.extend
  ratemate: (options) ->
    opts = $.extend {}, $.fn.ratemate.defaults, options
    if this.length
      this.each setup

$.fn.ratemate.defaults = {}

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

setupDisplay = (el) ->
  # In display mode we're reading values from a meter element and displaying them in the rating canvas
  new RatingDisplay el


# This is the rating display
# It's a Raphaël canvas with starts showing the rating
class RatingDisplay

  constructor: (el) ->
    # Let's keep a jQuery object in here
    @el = $ el
    # Add a class to show this is going on
    @el.addClass 'has_ratemate'
    # Let's do the important stuff now...
    @buildCanvas()

  buildCanvas: ->
    # So, we have a meter element
    # We want to replace it with a Raphaël canvas containing stars whose characteristics show the meter's value
