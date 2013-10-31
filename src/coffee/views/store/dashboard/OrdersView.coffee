define [
  "jquery"
  "jqueryRotate"
  "underscore"
  "backbone"
  "services/notificationcenter"
  "collections/OrdersCollection"
  "views/store/dashboard/OrderView"
  "views/store/dashboard/CreditView"
  "text!templates/store/dashboard/NoOrdersTemplate.html"
], ($, jqueryRotate, _, Backbone, notificationcenter, OrdersCollection, OrderView, CreditView, NoOrdersTemplate) ->

  OrdersView = Backbone.View.extend

    $orderListing: null
    $ordersToday: null
    $olderOrders: null
    $search: null
    $refresh: null
    $loadMore: null
    $noOrders: null

    # pagination counter
    pageOffset: 0

    # search value for fetching
    search: ""
    autoRefreshInterval: null
    rotateInterval: null
    rotationDeg: 0
    searchTimeout: null
    isReady: true

    # needed to indicate when to load noOrders view
    hasOrders: false
    creditView: null
    events:
      "keyup #search": "_delayedSearch"
      "click #refresh": "_refresh"
      "click #loadMore": "_loadMore"
      "click #bMail": "_sendTestOrder"
      mousemove: "_resetAutoRefresh"
      "click #checkAllOrders": "_checkAllOrders"

    initialize: ->
      @_createCreditView()
      @collection = new OrdersCollection()
      @_cacheDom()
      @_fetchCollectionAndRender true
      @_startAutoRefresh()

    _createCreditView: ->
      @creditView = new CreditView(el: @$("#balanceOrder"))

    _cacheDom: ->
      @$orderListing = @$("#orderListing")
      @$ordersToday = @$("#ordersToday")
      @$olderOrders = @$("#olderOrders")
      @$search = @$("#search")
      @$refresh = @$("#refresh")
      @$loadMore = @$("#loadMore")
      @$noOrders = @$("#noOrders")

    _listenToCollection: ->
      @listenTo @collection, "add remove", @_render

    _startAutoRefresh: ->
      self = this
      @autoRefreshInterval = setInterval(->
        self._fetchCollectionAndRender true
      , 20000)

    _resetAutoRefresh: ->
      clearInterval @autoRefreshInterval
      @_startAutoRefresh()

    _fetchCollectionAndRender: (viewShouldBeResetted) ->
      self = this
      if @isReady
        @isReady = false
        @_startRotateRefresh()

        # reset page offset
        @pageOffset = 0  if viewShouldBeResetted
        @collection.fetch
          parse: true
          data: $.param(
            search: @search
            page: @pageOffset
          )
          success: (collection, receivedOrders) ->
            self._stopRotateRefresh()
            self._resetView()  if viewShouldBeResetted
            self._renderOrders()
            if receivedOrders.length is 0 or self.search
              self._hideLoadMore()
            else
              self._showLoadMore()
            if collection.length is 0 and not self.hasOrders
              self._showNoOrders()
            else
              self.hasOrders = true
              self._showOrders()
            self.isReady = true

          error: ->
            self._stopRotateRefresh()
            self._renderNoOrders()


    _showOrders: ->
      @$orderListing.show()
      @$noOrders.hide()

    _showNoOrders: ->
      @$orderListing.hide()

      # lazy load noOrders
      @_renderNoOrders()  if @$noOrders.is(":empty")
      @$noOrders.show()

    _renderOrders: ->
      _.each @collection.models, ((orderModel) ->
        @_renderOrder orderModel
      ), this

    _renderOrder: (orderModel) ->
      orderView = new OrderView(
        model: orderModel
        creditView: @creditView
      )
      if orderModel.wasCreatedToday()
        @$ordersToday.append orderView.el
      else
        @$olderOrders.append orderView.el

    _renderNoOrders: ->
      @$noOrders.html NoOrdersTemplate

    _delayedSearch: ->
      self = this
      clearTimeout @searchTimeout
      @searchTimeout = setTimeout(->
        self._search()
      , 300)

    _search: ->
      @search = @$search.val()
      @$olderOrders.addClass "opaque"  if @search
      @_hideLoadMore()
      @_fetchCollectionAndRender true

    _refresh: ->
      @_clearSearch()
      @_fetchCollectionAndRender true

    _loadMore: ->
      @pageOffset++
      @_clearSearch()
      @_fetchCollectionAndRender false

    _startRotateRefresh: ->

      # clean old interval
      clearInterval @rotateInterval
      $refresh = @$refresh
      self = this
      @rotateInterval = setInterval(->
        self.rotationDeg = (self.rotationDeg + 15) % 180
        $refresh.rotate self.rotationDeg
      , 20)

    _stopRotateRefresh: ->
      self = this

      # wait until rotation complete
      checkInterval = setInterval(->
        if self.rotationDeg is 0
          clearInterval self.rotateInterval
          clearInterval checkInterval
      , 10)

    _resetView: ->
      @$olderOrders.removeClass "opaque"
      @$ordersToday.empty()
      @$olderOrders.empty()

    _hideLoadMore: ->
      @$loadMore.fadeOut 100

    _showLoadMore: ->
      @$loadMore.fadeIn 100

    _clearSearch: ->
      @$search.val ""
      @search = ""

    _sendTestOrder: ->
      self = this
      $.ajax
        url: "stores/storeAlias/testorder"
        type: "post"
        success: ->
          notificationcenter.notify "views.store.dashboard.testOrder.success"
          self._fetchCollectionAndRender()

        error: ->
          notificationcenter.notify "views.store.dashboard.testOrder.error"


    _checkAllOrders: ->
      _.each @collection.models, (orderModel) ->
        orderModel.save isDelivered: true  unless orderModel.get("isDelivered")


    destroy: ->
      clearInterval @autoRefreshInterval
