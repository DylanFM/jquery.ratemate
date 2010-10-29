$ = jQuery
  
$.fn.extend
  ratemate: (options) ->
    opts = $.extend {}, $.fn.ratemate.defaults, options
    if this.length
      this.each setup

$.fn.ratemate.defaults = {}

setup = ->
  console.log "Setting up"

