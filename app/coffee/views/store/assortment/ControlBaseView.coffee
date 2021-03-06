define [
  "jquery"
  "underscore"
  "backbone"
  "services/notificationcenter"
  "text!templates/store/assortment/ControlTemplate.html"
], ($, _, Backbone, notificationcenter, ControlTemplate) ->

  ControlBaseView = Backbone.View.extend

    template: ControlTemplate
    numberOfCurrentRequests: 0
    numberOfItems: 0
    $loader: null
    $loadbar: null

    events:
      "click .bReset": "_resetAll"

    initialize: ->
      @_render()
      @_cacheDom()
      @_enableTooltips()

      # since collection is loaded async the number has to be calculated on complete
      @listenTo @collection, "sync", @_countItems

    _render: ->
      @$el.html @template

    _enableTooltips: ->
      notificationcenter.tooltip(@$(".bReset"))

    _countItems: ->

    _resetAll: ->

    _cacheDom: ->
      @$loader = @options.$loader
      @$loadbar = @$loader.find("#loadbar")

    _updateModel: (model, changedAttributes) ->
      self = this
      @numberOfCurrentRequests++
      model.save changedAttributes,
        success: ->
          self.numberOfCurrentRequests--
          self._updateLoadBar()
          model.trigger "renderAgain"


    _updateLoadBar: ->
      progress = 1 - @numberOfCurrentRequests / @numberOfItems
      relativeWidth = progress * 100 + "%"
      if progress < 1
        @$loader.fadeIn()
      else
        @$loader.fadeOut()
      @$loadbar.width relativeWidth

    destroy: ->
      @stopListening()

