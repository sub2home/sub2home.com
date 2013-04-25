// Filename: src/js/collections/OrderCollection.js
define([
    'underscore',
    'backbone',
    'models/OrderModel'
    ], function (_, Backbone, OrderModel) {

	var OrderCollection = Backbone.Collection.extend({

		model: OrderModel,

		comparator: function (orderModel) {
			return -(orderModel.id);
		},

		url: function () {
			return 'stores/storeAlias/orders';
		}

	});

	return OrderCollection;
});