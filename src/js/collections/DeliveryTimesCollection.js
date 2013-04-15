define([
    'underscore',
    'backbone',
    'models/DeliveryTimeModel'
    ], function (_, Backbone, DeliveryTimeModel) {

	var DeliveryTimesCollection = Backbone.Collection.extend({

		model: DeliveryTimeModel,

		getNextDeliveryTimeModel: function () {
			var now = new Date(),
				dayOfWeek = now.getDay(),
				filteredDeliveryTimeModels;

			for (var i = 0; i < 7; i++) {

				filteredDeliveryTimeModels = this._getFilteredDeliveryTimeModels(dayOfWeek, i === 0);

				if (filteredDeliveryTimeModels.length > 0) {
					return filteredDeliveryTimeModels[0];
				}

				dayOfWeek = (dayOfWeek + 1) % 7;
			}
		},

		_getFilteredDeliveryTimeModels: function (dayOfWeek, shouldRespectStartTime) {

			var now = new Date(),
				totalMinutesOfNow = now.getMinutes() + now.getHours() * 60;

			var filteredDeliveryTimeModels = this.filter(function (deliveryTimeModel) {

				if (shouldRespectStartTime) { // today
					return deliveryTimeModel.get('dayOfWeek') === dayOfWeek && deliveryTimeModel.get('startMinutes') > totalMinutesOfNow;
				} else {
					return deliveryTimeModel.get('dayOfWeek') === dayOfWeek;
				}

			});

			return _.sortBy(filteredDeliveryTimeModels, function (deliveryTimeModel) {
				deliveryTimeModel.get('startMinutes');
			});

		}

	});

	return DeliveryTimesCollection;
});