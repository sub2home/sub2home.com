define [
  "jquery"
  "underscore"
  "backbone"
  "moment"
  "services/notificationcenter"
  "models/stateModel"
  "views/store/dashboard/details/OrderDetailsView"
  "text!templates/store/dashboard/OrderTemplate.html"
], ($, _, Backbone, moment, notificationcenter, stateModel, OrderDetailsView, OrderTemplate) ->

  OrderView = Backbone.View.extend

    template: _.template(OrderTemplate)
    className: "order"

    events:
      # 'click .orderHeader': '_toggleDetailsView',
      "click .orderStatus": "_toggleIsDelivered"
      "click .resendmail": "_resendMail"
      "click .alertOrder": "_addCredit"

    creditView: null

    initialize: ->
      @creditView = @options.creditView
      @_render()
      @_enableTooltips()
      @listenTo @model, "change", @_render

    _enableTooltips: ->
      notificationcenter.tooltip @$(".bMail")

    _render: ->
      orderModel = @model
      addressModel = orderModel.get("addressModel")
      dueDate = orderModel.get("dueDate")
      createdDate = orderModel.get("createdDate")
      createdMoment = moment(createdDate)
      dueMoment = moment(dueDate)
      dueTime = dueMoment.format("HH:mm")
      dateOrTime = @_getDateOrTime()
      total = orderModel.get("total")
      totalWithCredit = @_getTotalWithCredit()
      json =
        number: orderModel.getNumber()
        paymentMethodClass: @_getPaymentMethodClass()
        total: total
        totalWithCredit: totalWithCredit
        postal: addressModel.get("postal")
        city: addressModel.get("city")
        district: addressModel.get("district")
        dueTime: dueTime
        dateOrTime: dateOrTime
        isDelivered: orderModel.get("isDelivered")
        hasCredit: orderModel.hasCredit()

      @$el.html @template(json)
      @$el.addClass "balanced"  if totalWithCredit < total

    _toggleDetailsView: ->
      $orderContent = @$(".orderContent")
      @_renderDetailsView()  unless $orderContent.html().trim()
      $orderContent.toggle()

    _renderDetailsView: ->
      @model.fetch async: false
      new OrderDetailsView(
        el: @$(".orderContent")
        model: @model
      )

    _getDateOrTime: ->
      createdDate = @model.get("createdDate")
      createdMoment = moment(createdDate)
      if @model.wasCreatedToday()
        createdMoment.format "HH:mm"
      else
        createdMoment.format "DD.MM.YYYY"

    _getPaymentMethodClass: ->
      paymentMethod = @model.get("paymentMethod")
      paymentMethodClass = undefined
      switch paymentMethod
        when "paypal"
          paymentMethodClass = "bPaypal"
        when "cash"
          paymentMethodClass = "bCash"
        when "ec"
          paymentMethodClass = "bEC"
      paymentMethodClass

    _toggleIsDelivered: ->
      isDelivered = not @model.get("isDelivered")
      $isDelivered = @$(".orderStatus")
      @model.save
        isDelivered: isDelivered
      ,
        success: ->
          $isDelivered.toggleClass "delivered", isDelivered
          storeModel = stateModel.get("storeModel")
          storeModel.fetch
            url: "stores/storeAlias/auth" # use custom route

      false # prevent detail to toggle

    _resendMail: ->
      url = @model.url() + "/resendmail"
      $.ajax
        url: url
        type: "post"
        success: ->
          notificationcenter.notify "views.store.dashboard.resendMail.success"

        error: ->
          notificationcenter.notify "views.store.dashboard.resendMail.error"

      false # prevent detail to toggle

    _addCredit: ->
      unless @model.get("creditModel")
        @creditView.createForOrder @model

        # prevent detail to toggle
        false

    _getTotalWithCredit: ->
      totalWithCredit = @model.get("total")
      creditModel = @model.get("creditModel")
      totalWithCredit -= creditModel.get("total")  if creditModel and creditModel.get("isAccepted")
      totalWithCredit

