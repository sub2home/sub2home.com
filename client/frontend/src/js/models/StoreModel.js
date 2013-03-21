// Filename: src/js/models/StoreModel.js
define([
    'underscore',
    'backbone',
    'notificationcenter',
    'models/AddressModel',
    'collections/DeliveryAreasCollection',
    'collections/DeliveryTimesCollection',
    'collections/InvoicesCollection'
    ], function (_, Backbone, notificationcenter, AddressModel, DeliveryAreasCollection, DeliveryTimesCollection, InvoicesCollection) {

	var StoreModel = Backbone.Model.extend({

		defaults: {
			title: '',
			alias: '',

			// payment methods
			allowsPaymentCash: false,
			allowsPaymentEc: false,
			allowsPaymentPaypal: false,

			orderEmail: '',

			deliveryAreasCollection: null,
			deliveryTimesCollection: null,
			invoicesCollection: null,
			addressModel: null,

			number: 0,

			// needed in client.dashboard
			numberOfUndoneOrders: 0
		},

		idAttribute: 'alias',

		urlRoot: '/api/frontend/stores/',

		initialize: function () {

			// listen for changes in delivery areas/times collection
			this.on('change:deliveryAreasCollection', function () {
				this._listenForDeliveryAreasCollectionChanges();
			}, this);

			this.on('change:deliveryTimesCollection', function () {
				this._listenForDeliveryTimesCollectionChanges();
			}, this);

			// throw errors
			this.on('invalid', function (model, error) {
				notificationcenter.notify('models.storeModel.invalid', {
					error: error
				});
			});

			this._listenForDeliveryAreasCollectionChanges();
			this._listenForDeliveryTimesCollectionChanges();

		},

		toJSON: function () {

			var attributes = _.clone(this.attributes);

			if (attributes.hasOwnProperty('addressModel') && attributes.addressModel) {
				attributes.addressModel = attributes.addressModel.toJSON();
			}

			if (attributes.hasOwnProperty('deliveryAreasCollection') && attributes.deliveryAreasCollection) {
				attributes.deliveryAreasCollection = attributes.deliveryAreasCollection.toJSON();
			}

			if (attributes.hasOwnProperty('deliveryTimesCollection') && attributes.deliveryTimesCollection) {
				attributes.deliveryTimesCollection = attributes.deliveryTimesCollection.toJSON();
			}

			if (attributes.hasOwnProperty('invoicesCollection') && attributes.invoicesCollection) {
				attributes.invoicesCollection = attributes.invoicesCollection.toJSON();
			}

			return attributes;

		},

		parse: function (response) {

			if (response) {

				if (response.hasOwnProperty('addressModel')) {
					response.addressModel = new AddressModel(response.addressModel);
				}

				if (response.hasOwnProperty('deliveryAreasCollection')) {
					response.deliveryAreasCollection = new DeliveryAreasCollection(response.deliveryAreasCollection);
				}

				if (response.hasOwnProperty('deliveryTimesCollection')) {
					response.deliveryTimesCollection = new DeliveryTimesCollection(response.deliveryTimesCollection);
				}

				if (response.hasOwnProperty('invoicesCollection') && response.invoicesCollection) {
					response.invoicesCollection = new InvoicesCollection(response.invoicesCollection);
				}

				return response;

			}
		},

		validate: function (attributes) {

			if (!attributes.allowsPaymentPaypal && !attributes.allowsPaymentEc && !attributes.allowsPaymentCash) {
				return 'at least one payment method has to be selected';
			}

		},


		isDelivering: function () {
			var isDelivering = false;

			this.get('deliveryTimesCollection').each(function (deliveryTimeModel) {
				if (deliveryTimeModel.checkIfNow()) {
					isDelivering = true;
					return;
				}
			});

			return isDelivering;
		},

		getMinimumValue: function () {
			var selectedDeliveryAreaModel = this.getSelectedDeliveryAreaModel();

			return selectedDeliveryAreaModel.get('minimumValue');
		},

		getMinimumDuration: function () {
			var selectedDeliveryAreaModel = this.getSelectedDeliveryAreaModel();

			return selectedDeliveryAreaModel.get('minimumDuration');
		},

		getSelectedDeliveryAreaModel: function () {
			var deliveryAreasCollection = this.get('deliveryAreasCollection'),
				selectedDeliveryAreaModel = deliveryAreasCollection.find(function (deliveryAreaModel) {
					return deliveryAreaModel.get('isSelected');
				});

			// lazy select delivery area after it got parsed from server
			// and thus the customer didn't selected a delivery area
			if (selectedDeliveryAreaModel) {
				return selectedDeliveryAreaModel;
			} else {
				return deliveryAreasCollection.first().set('isSelected', true);
			}

		},

		getValidDueDate: function (options) {
			var now = new Date();

			// prepare options
			options = options || {};

			// prepare variables
			var checkOnly = options.minutesToAdd !== undefined,
				dateWasGiven = options.dueDate !== undefined,
				minutesToAdd = options.minutesToAdd || 0,
				dueDate = options.dueDate || now;

			// add minutes
			var dueDate = this._addMinutesToDate(dueDate, minutesToAdd);

			// check if due date respects minimum duration
			var spareMinutes = Math.ceil((dueDate - now) / 60000) - 1,
				minimumDuration = this.getMinimumDuration();

			if (spareMinutes < minimumDuration) {
				if (checkOnly) {
					return null;
				}

				dueDate = this._addMinutesToDate(dueDate, minimumDuration - spareMinutes);
			}

			var dueDateCouldBeFound = false,
				contemporaryDayOfWeek = now.getDay(),
				contemporaryTotalMinutes = now.getMinutes() + now.getHours() * 60,
				totalMinutesOfDueDate = dueDate.getMinutes() + dueDate.getHours() * 60,
				deliveryTimesCollection = this.get('deliveryTimesCollection'),
				contemporaryDeliveryTimeModels = deliveryTimesCollection.filter(function (deliveryTimeModel) {
					return deliveryTimeModel.get('dayOfWeek') === contemporaryDayOfWeek && deliveryTimeModel.get('endMinutes') >= totalMinutesOfDueDate;
				});

			// find delivery time model with smallest start minutes
			var nextDeliveryTimeModel;

			_.each(contemporaryDeliveryTimeModels, function (deliveryTimeModel) {
				if (!nextDeliveryTimeModel || nextDeliveryTimeModel.get('startMinutes') > deliveryTimeModel.get('startMinutes')) {
					nextDeliveryTimeModel = deliveryTimeModel;
				}
			});


			if (nextDeliveryTimeModel) {

				// check if due date still matches delivery time model
				if (nextDeliveryTimeModel.get('endMinutes') < totalMinutesOfDueDate) {
					// try again and reset given duedate
					return this.getValidDueDate();
				}

				// increase due date so it matches a delivery time if its to small
				if (nextDeliveryTimeModel.get('startMinutes') > totalMinutesOfDueDate) {

					// needed to check if changes would be valid
					if (checkOnly) {
						return null;
					}

					dueDate = this._addMinutesToDate(dueDate, nextDeliveryTimeModel.get('startMinutes') - totalMinutesOfDueDate);
				}

				return dueDate;

			} else {
				return null;
			}

		},

		_listenForDeliveryAreasCollectionChanges: function () {
			var deliveryAreasCollection = this.get('deliveryAreasCollection');

			if (deliveryAreasCollection) {
				deliveryAreasCollection.on('add remove change', function () {
					this.trigger('change');
				}, this);
			}
		},

		_listenForDeliveryTimesCollectionChanges: function () {
			var deliveryTimesCollection = this.get('deliveryTimesCollection');

			if (deliveryTimesCollection) {
				deliveryTimesCollection.on('add remove change', function () {
					this.trigger('change');
				}, this);
			}
		},

		_addMinutesToDate: function (date, minutes) {
			return new Date(date.getTime() + minutes * 60000);
		}

	});

	return StoreModel;

});