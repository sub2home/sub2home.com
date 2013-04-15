// Filename: src/js/views/client/dashboard/RevenueView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'text!templates/client/dashboard/RevenueTemplate.html'
    ], function ($, _, Backbone, moment, RevenueTemplate) {

	var RevenueView = Backbone.View.extend({

		template: _.template(RevenueTemplate),

		className: 'clientMonthlyTurnover',

		initialize: function () {
			this._render();
		},

		_render: function () {
			var invoiceMoment = moment([this.model.getTimeSpanYear(), this.model.getTimeSpanMonth() - 1]); // - 1 because moment counts month from 0

			var json = {
				total: parseInt(this.model.get('total'), 10),
				month: invoiceMoment.format('MMM'),
				year: invoiceMoment.format('YYYY')
			};

			this.$el.html(this.template(json));
		}


	});

	return RevenueView;

});