define [
  "underscore"
  "backbone"
  "models/ArticleModel"
  "models/MenuUpgradeModel"
  "models/MenuBundleModel"
  "models/MenuComponentBlockModel"
], (_, Backbone, ArticleModel, MenuUpgradeModel, MenuBundleModel, MenuComponentBlockModel) ->

  OrderedArticleModel = Backbone.Model.extend

    defaults:

      # ordered item which this belongs to
      orderedItemModel: null

      # selected article model (may be predetermined)
      articleModel: null

      # only contained by a base article
      menuUpgradeModel: null

      # not contained by a base article
      menuComponentBlockModel: null

      # needed for info in store.selection
      menuBundleModel: null

    initialize: ->

      # listen for current and further article models
      @on "change:articleModel", (->
        previousArticleModel = @previous("articleModel")
        articleModel = @get("articleModel")

        # initalize total of ordered item model by firing priceChanged event
        @trigger "priceChanged"

        # remove old listener
        previousArticleModel.off "change:total"  if previousArticleModel

        # bind new listener
        articleModel.on "change:total", (->
          @trigger "priceChanged"
        ), this
      ), this

    toJSON: ->
      attributes = _.clone(@attributes)
      attributes.articleModel = attributes.articleModel.toJSON()  if @get("articleModel")
      attributes.menuUpgradeModel = attributes.menuUpgradeModel.toJSON()  if @get("menuUpgradeModel")
      attributes.menuBundleModel = attributes.menuBundleModel.toJSON()  if @get("menuBundleModel")
      attributes.menuComponentBlockModel = attributes.menuComponentBlockModel.toJSON()  if @get("menuComponentBlockModel")
      delete attributes.orderedItemModel

      attributes

    parse: (response) ->
      if response.hasOwnProperty("articleModel") and response.articleModel isnt null
        response.articleModel = new ArticleModel response.articleModel, parse: true
      if response.hasOwnProperty("menuUpgradeModel") and response.menuUpgradeModel isnt null
        response.menuUpgradeModel = new MenuUpgradeModel response.menuUpgradeModel, parse: true
      if response.hasOwnProperty("menuComponentBlockModel") and response.menuComponentBlockModel isnt null
        response.menuComponentBlockModel = new MenuComponentBlockModel response.menuComponentBlockModel, parse: true
      if response.hasOwnProperty("menuBundleModel") and response.menuBundleModel isnt null
        response.menuBundleModel = new MenuBundleModel response.menuBundleModel, parse: true
      response

    isMenuUpgradeBase: ->
      @get("menuComponentBlockModel") is null and @get("articleModel") isnt null

    hasBeenUpgraded: ->
      @get("menuUpgradeModel") isnt null

    isComplete: ->
      return true  unless @get("articleModel") and @get("articleModel").get("ingredientCategoriesCollection")
      isComplete = true
      @get("articleModel").get("ingredientCategoriesCollection").each (ingredientCategoryModel) ->
        isComplete = false  unless ingredientCategoryModel.isComplete()
      isComplete

