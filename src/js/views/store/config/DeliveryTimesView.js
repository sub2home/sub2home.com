define([
    'jquery',
    'underscore',
    'backbone',
    'notificationcenter',
    'models/DeliveryTimeModel',
    'collections/DeliveryTimesCollection',
    'views/store/config/DeliveryTimeView'
    ], function ($, _, Backbone, notificationcenter, DeliveryTimeModel, DeliveryTimesCollection, DeliveryTimeView) {

	var DeliveryTimesView = Backbone.View.extend({
		events: {
			'click .bAdd': '_addDeliveryTime'
		},

		initialize: function () {
			this._render();
		},

		_render: function () {
			_.each(this.collection.models, function (deliveryTimeModel) {
				this._renderDeliveryTime(deliveryTimeModel);
			}, this);
		},

		_renderDeliveryTime: function (deliveryTimeModel) {
			var deliveryTimeView = new DeliveryTimeView({
				model: deliveryTimeModel
			});

			var $matchingBusinessDay = this.$('.businessDay[data-day="' + deliveryTimeModel.get('dayOfWeek') + '"]'),
				$openingHours = $matchingBusinessDay.find('.openingHours');

			$openingHours.append(deliveryTimeView.el);
		},

		_addDeliveryTime: function (e) {
			var dayOfWeek = $(e.target).parents('.businessDay').first().attr('data-day'),
				self = this;

			this.collection.create({
				dayOfWeek: dayOfWeek
			}, {
				validate: false,
				success: function (deliveryTimeModel) {
					notificationcenter.notify('views.store.config.deliveryTime.add.success');
					self._renderDeliveryTime(deliveryTimeModel);
				},
				error: function () {
					notificationcenter.notify('views.store.config.deliveryTime.add.error');
				}
			});
		}

	});

	return DeliveryTimesView;

});