// Filename: src/js/views/store/dashboard/details/OrderedItemView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/store/dashboard/details/OrderedArticlesView',
    'text!templates/store/dashboard/details/OrderedItemTemplate.html'
    ], function ($, _, Backbone, OrderedArticlesView, OrderedItemTemplate) {

	var OrderedItemView = Backbone.View.extend({

		className: 'orderedItem',

		template: _.template(OrderedItemTemplate),

		initialize: function () {
			this._render();
		},

		_render: function () {
			var amount = this.model.get('amount'),
				json = {
					amount: amount,
					total: this.model.get('total') / amount,
					isMenu: false,
					menuTitle: 'Spar Menu'
				};

			this.$el.html(this.template(json));

			this._renderOrderedArticles();
		},

		_renderOrderedArticles: function () {
			new OrderedArticlesView({
				el: this.$('.orderedArticles'),
				collection: this.model.get('orderedArticlesCollection')
			});
		}

	});

	return OrderedItemView;

});