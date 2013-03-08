// Filename: src/js/views/client/dashboard/RevenuessView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'views/client/dashboard/RevenuesView',
    'text!templates/client/dashboard/RevenuesTemplate.html'
    ], function ($, _, Backbone, moment, RevenuesView, RevenuesTemplate) {

	var RevenuessView = Backbone.View.extend({

		template: _.template(RevenuesTemplate),

		initialize: function () {
			this._render();
		},

		_render: function () {
			var currentMoment = moment();

			var json = {
				totalOfCurrentYear: this._getTotalOfCurrentYear(),
				totalOfCurrentMonth: this._getTotalOfCurrentMonth(),
				currentMonth: currentMoment.format('MMMM'),
				currentYear: currentMoment.format('YYYY'),
				currentYearShort: currentMoment.format('YY')
			};

			this.$el.html(this.template(json));

			this._renderRevenues();
		},

		_renderRevenues: function () {

		},

		_getTotalOfCurrentYear: function () {
			var totalOfCurrentYear = 0,
				invoicesCollection;

			_.each(this.collection.models, function (storeModel) {
				invoicesCollection = storeModel.get('invoicesCollection');
				totalOfCurrentYear += invoicesCollection.getTotalOfCurrentYear();
			});

			return totalOfCurrentYear;
		},

		_getTotalOfCurrentMonth: function () {
			var totalOfCurrentMonth = 0,
				invoicesCollection;

			_.each(this.collection.models, function (storeModel) {
				invoicesCollection = storeModel.get('invoicesCollection');
				totalOfCurrentMonth += invoicesCollection.getTotalOfCurrentMonth();
			});

			return totalOfCurrentMonth;
		}


	});

	return RevenuessView;

});