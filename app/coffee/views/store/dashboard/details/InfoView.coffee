define [
  "jquery"
  "underscore"
  "backbone"
  "moment"
  "views/store/dashboard/details/InfoListItemView"
  "text!templates/store/dashboard/details/InfoTemplate.html"
], ($, _, Backbone, moment, InfoListItemView, InfoTemplate) ->

  InfoView = Backbone.View.extend

    template: _.template(InfoTemplate)

    initialize: ->
      @_render()
      @_renderListItems()

    _render: ->
      addressModel = @model.get "addressModel"
      createdMoment = moment @model.get("createdDate")
      dueMoment = moment @model.get("dueDate")
      json =
        comment: @model.get "comment"
        total: @model.get "total"
        orderNumber: @model.getNumber()
        orderTime: createdMoment.format "HH:mm"
        orderDate: createdMoment.format "DD.MM.YYYY"
        dueTime: dueMoment.format "HH:mm"
        paymentMethod: @_getPaymentMethod()
        addressFirstName: addressModel.get "firstName"
        addressLastName: addressModel.get "lastName"
        addressStreet: addressModel.get "street"
        addressStreetNumber: addressModel.get "streetNumber"
        addressStreetAdditional: addressModel.get "streetAdditional"
        addressPostal: addressModel.get "postal"
        addressCity: addressModel.get "city"
        addressDistrict: addressModel.get "district"
        addressPhone: addressModel.get "phone"
        addressEmail: addressModel.get "email"

      @$el.html @template(json)

    _renderListItems: ->
      $list = @$(".orderedArticlesList")
      orderedItemsCollection = @model.get "orderedItemsCollection"
      orderedItemsCollection.each (orderedItemModel) ->
        itemView = new InfoListItemView model: orderedItemModel
        $list.append itemView.el

    _getPaymentMethod: ->
      switch @model.get "paymentMethod"
        when "cash"
          "Bar"
        when "ec"
          "EC"
