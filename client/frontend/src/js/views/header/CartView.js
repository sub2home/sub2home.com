// Filename: src/js/views/header/CartView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'router',
	'models/stateModel',
	'models/cartModel',
	'text!templates/header/CartTemplate.html'
	], function ($, _, Backbone, router, stateModel, cartModel, CartTemplate) {

	var CartView = Backbone.View.extend({

		template: _.template(CartTemplate),

		events: {
			'click': 'goToTray'
		},

		initialize: function () {
			this.model = cartModel;

			this.render();

			this.model.on('change', this.render, this);
		},

		render: function () {

			var storeModel = stateModel.get('storeModel'),
				selectedDeliveryAreaModel = storeModel.getSelectedDeliveryAreaModel(),
				amount = this.model.getNumberOfOrderedItems(),
				json = {
					amount: amount,
					minimum: selectedDeliveryAreaModel.get('minimumValue'),
					total: this.model.getTotal()
				};

			this.$el.html(this.template(json));

			this.$el.toggleClass('filled', (amount > 0));
		},

		goToTray: function () {
			if (this.model.getNumberOfOrderedItems() > 0) {
				router.navigate('store/tablett', true);
			}
		}

	});

	return CartView;

});