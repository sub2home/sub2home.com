// Filename: src/js/views/store/dashboard/revenues/RevenueView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'notificationcenter',
    'text!templates/store/dashboard/revenues/RevenueTemplate.html'
    ], function ($, _, Backbone, moment, notificationcenter, RevenueTemplate) {

	var RevenueView = Backbone.View.extend({

		template: _.template(RevenueTemplate),

		events: {
			'click i': '_download',
			'mouseenter': '_tooltip'
		},

		className: 'turnover',

		isValidMonth: false,

		initialize: function () {
			this._validateMonth();
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
		},

		_validateMonth: function () {
			var now = new Date(),
				currentTotalNumberOfMonths = now.getFullYear() * 12 + now.getMonth() + 1;

			this.isValidMonth = (this.model.get('timeSpan') !== currentTotalNumberOfMonths);
		},

		_download: function () {

			if (this.isValidMonth) {

				var path = '/files/invoices/',
					self = this,
					invoiceFile = path + this.model.get('invoiceDocumentName'),
					attachmentFile = path + this.model.get('attachmentDocumentName');

				if (this._fileExists(invoiceFile)) {
					window.location.href = invoiceFile;
				}

				// wait until first file downloaded
				setTimeout(function () {
					if (self._fileExists(attachmentFile)) {
						window.location.href = attachmentFile;
					}
				}, 2000);

			}

		},

		_fileExists: function (url) {

			var http = new XMLHttpRequest();

			http.open('HEAD', url, false);
			http.send();

			return http.status != 404;

		},

		_tooltip: function () {

			if (this.isValidMonth) {

				var offset = this.$el.offset();
				notificationcenter.tooltip('jo', offset.top + 125, offset.left + 110);

			}
		}

	});

	return RevenueView;

});