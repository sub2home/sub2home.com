define ["jquery", "underscore", "backbone", "services/router", "services/notificationcenter", "models/stateModel", "models/clientModel", "models/authentificationModel", "text!templates/header/ClientTemplate.html"], ($, _, Backbone, router, notificationcenter, stateModel, clientModel, authentificationModel, ClientTemplate) ->

  $.objectOfArray = (a) ->
    c = $()
    for x of a
      c = c.add(a[x])
    c

  ClientView = Backbone.View.extend

    # cached dom
    $buttonLogout: null
    $buttonClientDashboard: null
    $buttonClientConfig: null
    $buttonStoreDashboard: null
    $buttonStoreAssortment: null
    $buttonStoreConfig: null
    $allButtons: null
    $currentIcon: null
    $title: null
    animationTime: 150
    events:
      "click #bSignout": "_logout"
      "click #bStoreConfig": "_navigateToStoreConfig"
      "click #bClientConfig": "_navigateToClientConfig"
      "click #bStoreAssortment": "_navigateToStoreAssortment"
      "click #bStoreDashboard": "_navigateToStoreDashboard"
      "click #bClientDashboard": "_navigateToClientDashboard"
      "mouseenter #bSignout": "_tooltipLogout"
      "mouseenter #bStoreConfig": "_tooltipForStoreConfig"
      "mouseenter #bClientConfig": "_tooltipForClientConfig"
      "mouseenter #bStoreAssortment": "_tooltipForStoreAssortment"
      "mouseenter #bStoreDashboard": "_tooltipForStoreDashboard"
      "mouseenter #bClientDashboard": "_tooltipForClientDashboard"
      "mouseleave .iBtn": "_dismissTooltip"

    initialize: ->
      @_render()
      @_enableTooltips()
      @_listenToCurrentRoute()

    _render: ->
      @$el.html ClientTemplate
      @_cacheDom()
      @_selectViewFromCurrentRoute()

    _enableTooltips: ->

    _cacheDom: ->
      @$buttonLogout = @$("#bSignout")
      @$buttonClientDashboard = @$("#bClientDashboard")
      @$buttonClientConfig = @$("#bClientConfig")
      @$buttonStoreDashboard = @$("#bStoreDashboard")
      @$buttonStoreAssortment = @$("#bStoreAssortment")
      @$buttonStoreConfig = @$("#bStoreConfig")
      @$allButtons = @$("#clientAreaNavigation .iBtn").not(@$buttonLogout)
      @$currentIcon = @$("#currentIcon")
      @$title = @$("#currentInfo span")

    _listenToCurrentRoute: ->
      stateModel.on "change:currentRoute", @_selectViewFromCurrentRoute, this

    _selectViewFromCurrentRoute: ->
      currentRoute = stateModel.get("currentRoute")
      switch currentRoute
        when "client.dashboard"
          @_showClientDashboard()
        when "client.config"
          @_showClientConfig()
        when "store.dashboard"
          @_showStoreDashboard()
        when "store.assortment"
          @_showStoreAssortment()
        when "store.config"
          @_showStoreConfig()
        else
          @_showStoreGlobal()  if stateModel.doesStoreExist()

    _showClientDashboard: ->
      $neededButtons = @$buttonClientConfig
      $unneededButtons = @$allButtons.not($neededButtons)
      title = clientModel.getName() + "'s sub2home"
      @$allButtons.removeClass "active"
      @$title.text title
      @$currentIcon.removeClass "storeIcon"
      @$currentIcon.addClass "clientIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _showClientConfig: ->
      $neededButtons = @$buttonClientDashboard
      $unneededButtons = @$allButtons.not($neededButtons)
      title = clientModel.getName() + "'s sub2home"
      @$allButtons.removeClass "active"
      @$title.text title
      @$currentIcon.removeClass "storeIcon"
      @$currentIcon.addClass "clientIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _showStoreDashboard: ->
      $neededButtons = $.objectOfArray([@$buttonClientDashboard, @$buttonStoreConfig, @$buttonStoreAssortment, @$buttonStoreDashboard])
      $unneededButtons = @$allButtons.not($neededButtons)
      storeModel = stateModel.get("storeModel")
      title = "Dashboard: " + storeModel.get("title")
      @$allButtons.removeClass "active"
      @$buttonStoreDashboard.addClass "active"
      @$title.text title
      @$currentIcon.removeClass "clientIcon"
      @$currentIcon.addClass "storeIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _showStoreAssortment: ->
      $neededButtons = $.objectOfArray([@$buttonClientDashboard, @$buttonStoreConfig, @$buttonStoreAssortment, @$buttonStoreDashboard])
      $unneededButtons = @$allButtons.not($neededButtons)
      storeModel = stateModel.get("storeModel")
      title = "Sortiment: " + storeModel.get("title")
      @$allButtons.removeClass "active"
      @$buttonStoreAssortment.addClass "active"
      @$title.text title
      @$currentIcon.removeClass "clientIcon"
      @$currentIcon.addClass "storeIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _showStoreConfig: ->
      $neededButtons = $.objectOfArray([@$buttonClientDashboard, @$buttonStoreConfig, @$buttonStoreAssortment, @$buttonStoreDashboard])
      $unneededButtons = @$allButtons.not($neededButtons)
      storeModel = stateModel.get("storeModel")
      title = "Einstellungen: " + storeModel.get("title")
      @$allButtons.removeClass "active"
      @$buttonStoreConfig.addClass "active"
      @$title.text title
      @$currentIcon.removeClass "clientIcon"
      @$currentIcon.addClass "storeIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _showStoreGlobal: ->
      $neededButtons = $.objectOfArray([@$buttonClientDashboard, @$buttonStoreConfig, @$buttonStoreAssortment, @$buttonStoreDashboard])
      $unneededButtons = @$allButtons.not($neededButtons)
      storeModel = stateModel.get("storeModel")
      title = storeModel.get("title")
      @$allButtons.removeClass "active"
      @$title.text title
      @$currentIcon.removeClass "clientIcon"
      @$currentIcon.addClass "storeIcon"
      $unneededButtons.fadeOut @animationTime
      $neededButtons.delay(@animationTime + 10).fadeIn @animationTime + 50

    _logout: ->
      logoutSucceded = authentificationModel.logout()
      router.navigate "/", true  if logoutSucceded and stateModel.currentRouteIsClientRelated()

    _navigateToStoreConfig: ->
      router.navigate "store/einstellungen", true

    _navigateToStoreAssortment: ->
      router.navigate "store/sortiment", true

    _navigateToStoreDashboard: ->
      router.navigate "store/dashboard", true

    _navigateToClientDashboard: ->
      router.navigate "dashboard", true

    _navigateToClientConfig: ->
      router.navigate "einstellungen", true

    remove: ->
      stateModel.off "change:currentRoute", @_selectViewFromCurrentRoute, this

    _tooltipLogout: ->
      offset = @$buttonLogout.offset()
      notificationcenter.tooltip "views.header.logout", offset.top + 64, offset.left + 34

    _tooltipForStoreConfig: ->
      offset = @$buttonStoreConfig.offset()
      notificationcenter.tooltip "views.header.store.config", offset.top + 64, offset.left + 24

    _tooltipForStoreAssortment: ->
      offset = @$buttonStoreAssortment.offset()
      notificationcenter.tooltip "views.header.store.assortment", offset.top + 64, offset.left + 24

    _tooltipForStoreDashboard: ->
      offset = @$buttonStoreDashboard.offset()
      notificationcenter.tooltip "views.header.store.dashboard", offset.top + 64, offset.left + 23

    _tooltipForClientDashboard: ->
      offset = @$buttonClientDashboard.offset()
      notificationcenter.tooltip "views.header.client.dashboard", offset.top + 64, offset.left + 34

    _tooltipForClientConfig: ->
      offset = @$buttonClientConfig.offset()
      notificationcenter.tooltip "views.header.client.config", offset.top + 64, offset.left + 34

    _dismissTooltip: ->
      notificationcenter.hideTooltip()