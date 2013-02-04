// Filename: src/js/views/store/orders/RevenuesView.js
define([
	'jquery',
	'lib/jquery/jquery.overscroll',
	'underscore',
	'backbone',
	'text!templates/store/orders/RevenuesTemplate.html'
	], function ($, overscrollLib, _, Backbone, RevenuesTemplate) {

	var RevenuesView = Backbone.View.extend({

		template: _.template(RevenuesTemplate),

		initialize: function () {
			this.render();

			this.$el.overscroll();
		},

		render: function () {
			this.$el.html(this.template());
		}

	});

	return RevenuesView;

});