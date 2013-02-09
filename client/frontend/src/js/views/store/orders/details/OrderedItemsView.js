// Filename: src/js/views/store/orders/details/OrderedItemsView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/store/orders/details/OrderedItemView'
	], function ($, _, Backbone, OrderedItemView) {

	var OrderedItemsView = Backbone.View.extend({

		initialize: function () {
			this.render();
		},

		render: function () {
			_.each(this.collection.models, function (orderedItemModel) {
				this.renderOrderedItem(orderedItemModel);
			}, this);
		},

		renderOrderedItem: function (orderedItemModel) {
			var orderedItemView = new OrderedItemView({
				model: orderedItemModel
			});

			this.$el.append(orderedItemView.el);
		}

	});

	return OrderedItemsView;

});