// Filename: src/js/views/store/tray/DeliveryTimeView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'notificationcenter',
    'models/cartModel',
    'text!templates/store/tray/DeliveryTimeTemplate.html',
    'text!templates/store/tray/NoDeliveryTimeTemplate.html'
    ], function ($, _, Backbone, moment, notificationcenter, cartModel, DeliveryTimeTemplate, NoDeliveryTimeTemplate) {

	var DeliveryTimeView = Backbone.View.extend({

		template: _.template(DeliveryTimeTemplate),

		events: {
			'click #hours .iArrowUp.active': '_addHour',
			'click #hours .iArrowDown.active': '_substractHour',
			'click #minutes .iArrowUp.active': '_addMinute',
			'click #minutes .iArrowDown.active': '_substractMinute'
		},

		intervalTimer: null,

		initialize: function () {

			cartModel.validateDueDate();

			this._render();

			// keep due date in time
			this._initializeIntervalTimer();

			this._listenForDestory();
		},

		_render: function () {

			var dueDate = cartModel.getDueDate();

			if (dueDate) {

				dueMoment = moment(dueDate),
				json = {
					hoursAreMinimum: !this._isValidDueDateChange(-60),
					minutesAreMinimum: !this._isValidDueDateChange(-1),
					hoursAreMaximum: !this._isValidDueDateChange(60),
					minutesAreMaximum: !this._isValidDueDateChange(1),
					dueHours: dueMoment.format('HH'),
					dueMinutes: dueMoment.format('mm'),
					minimumDuration: cartModel.getMinimumDuration()
				};

				this.$el.html(this.template(json));

			} else {
				this.$el.html(NoDeliveryTimeTemplate);
			}

		},

		_initializeIntervalTimer: function () {
			var self = this;
			this.intervalTimer = setInterval(function () {

				cartModel.validateDueDate();
				self._render();

			}, 60000);
		},

		_addHour: function () {
			this._addMinutesToDueDate(60);
		},

		_substractHour: function () {
			this._addMinutesToDueDate(-60);
		},

		_addMinute: function () {
			this._addMinutesToDueDate(1);
		},

		_substractMinute: function () {
			this._addMinutesToDueDate(-1);
		},

		_isValidDueDateChange: function (minutesToAdd) {
			return cartModel.isValidDueDateChange(minutesToAdd);
		},

		_addMinutesToDueDate: function (minutesToAdd) {
			cartModel.changeDueDate(minutesToAdd);
			this._render();
		},

		_listenForDestory: function () {
			this.once('destroy', function () {
				clearInterval(this.intervalTimer);
			}, this);
		}

	});

	return DeliveryTimeView;

});