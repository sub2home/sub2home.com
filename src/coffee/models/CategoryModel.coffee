define ["underscore", "backbone", "collections/ArticlesCollection", "collections/ItemsCollection"], (_, Backbone, ArticlesCollection, ItemsCollection) ->

  CategoryModel = Backbone.Model.extend

    defaults:
      itemsCollection: null
      smallImage: ""
      icon: ""

    parse: (response) ->
      response.itemsCollection = new ItemsCollection(response.itemsCollection)  if response.hasOwnProperty("itemsCollection")
      response.articlesCollection = new ArticlesCollection(response.articlesCollection)  if response.hasOwnProperty("articlesCollection")
      response