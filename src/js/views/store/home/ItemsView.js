// Filename: src/js/views/store/home/ItemsView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/store/home/ItemView'
	], function ($, _, Backbone, ItemView) {

	var ItemsView = Backbone.View.extend({

		initialize: function () {
			this.collection.groupItems();
			this.render();
		},

		render: function () {
			_.each(this.collection.models, function (itemModel) {
				if (!itemModel.get('isAttached')) {
					this.renderItem(itemModel);
				}
			}, this);
		},

		renderItem: function (itemModel) {

			var itemView = new ItemView({
				model: itemModel
			});

			this.$el.append(itemView.el);

		}

	});

	return ItemsView;

});