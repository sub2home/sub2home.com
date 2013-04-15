// Filename: src/js/collections/MenuBundlesCollection.js
define([
    'underscore',
    'backbone',
    'models/MenuBundleModel'
    ], function (_, Backbone, MenuBundleModel) {

	var MenuBundlesCollection = Backbone.Collection.extend({

		model: MenuBundleModel,

		url: function() {
			return 'stores/storeAlias/menubundles';
		}

	});

	return MenuBundlesCollection;
});