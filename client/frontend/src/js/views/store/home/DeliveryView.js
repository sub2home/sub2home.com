// Filename: src/js/views/store/config/AddressView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/stateModel',
    'text!templates/store/home/DeliveryTemplate.html'
    ], function ($, _, Backbone, stateModel, DeliveryTemplate) {

	var AddressView = Backbone.View.extend({

		template: _.template(DeliveryTemplate),

		events: {
			'click #currentDeliveryArea.editable': '_showAllDeliveryAreas',
			'click #deliveryAreas span': '_selectDeliveryArea'
		},

		initialize: function () {
			this._render();
		},

		_render: function () {
			var storeModel = stateModel.get('storeModel'),
				selectedDeliveryAreaModel = storeModel.getSelectedDeliveryAreaModel(),
				area = selectedDeliveryAreaModel.get('district');

			if (!area) {
				area = selectedDeliveryAreaModel.get('city');
			}

			var json = {
				area: area,
				postal: selectedDeliveryAreaModel.get('postal'),
				minimumDuration: selectedDeliveryAreaModel.get('minimumDuration')
			};

			this.$el.html(this.template(json));

			this._checkIfEditable();

			this._renderDeliveryAreas();
		},

		_checkIfEditable: function () {
			var storeModel = stateModel.get('storeModel'),
				deliveryAreasCollection = storeModel.get('deliveryAreasCollection'),
				selectedDeliveryAreaModel = storeModel.getSelectedDeliveryAreaModel(),
				numberOfDeliveryAreasWithSamePostal = deliveryAreasCollection.where({
					postal: selectedDeliveryAreaModel.get('postal')
				}).length;

			if (numberOfDeliveryAreasWithSamePostal > 1) {
				this.$('#currentDeliveryArea').addClass('editable');
			}

		},

		_renderDeliveryAreas: function () {
			var storeModel = stateModel.get('storeModel'),
				selectedDeliveryAreaModel = storeModel.getSelectedDeliveryAreaModel(),
				deliveryAreasCollection = storeModel.get('deliveryAreasCollection'),
				matchingDeliveryAreaModels = deliveryAreasCollection.where({
					postal: selectedDeliveryAreaModel.get('postal')
				}),
				$deliveryAreas = this.$('#deliveryAreas'),
				$deliveryArea;

			_.each(matchingDeliveryAreaModels, function (deliveryAreaModel) {
				$deliveryArea = $('<span>').text(deliveryAreaModel.get('district'));

				if (deliveryAreaModel.get('isSelected')) {
					$deliveryArea.addClass('selected');
				}

				$deliveryAreas.append($deliveryArea);
			});
		},

		_selectDeliveryArea: function (e) {
			var storeModel = stateModel.get('storeModel'),
				deliveryAreasCollection = storeModel.get('deliveryAreasCollection'),
				currentDeliveryArea = storeModel.getSelectedDeliveryAreaModel(),
				$currentDeliveryAreaInList = this.$('#deliveryAreas .selected'),
				$currentDeliveryAreaInHeader = this.$('#currentDeliveryArea span'),
				$currentDeliveryDurationInHeader = this.$('#minimumDuration'),
				$newDeliveryArea = $(e.target),
				newDeliveryArea = $newDeliveryArea.text();

			if (newDeliveryArea !== currentDeliveryArea.get('district')) {

				// unmark old deliveryArea
				currentDeliveryArea.set({
					isSelected: false
				}, {
					silent: true
				});

				// mark new delivery area as selected
				_.each(deliveryAreasCollection.models, function (deliveryAreaModel) {
					if (deliveryAreaModel.get('district') === newDeliveryArea) {

						deliveryAreaModel.set('isSelected', true);

						// write back header
						$currentDeliveryAreaInHeader.text(newDeliveryArea);
						$currentDeliveryDurationInHeader.text(deliveryAreaModel.get('minimumDuration'));

						return;
					}
				});

				// toggle selected class
				$currentDeliveryAreaInList.removeClass('selected');
				$newDeliveryArea.addClass('selected');

			}

			// slide up
			this._hideAllDeliveryAreas();
		},

		_showAllDeliveryAreas: function () {
			var $deliveryAreas = this.$('#deliveryAreas'),
				$el = this.$el;

			$el.animate({
				top: 35
			}, 200);

			$deliveryAreas.delay(120).fadeIn(150);

		},

		_hideAllDeliveryAreas: function () {
			var $deliveryAreas = this.$('#deliveryAreas'),
				$el = this.$el;

			$deliveryAreas.fadeOut(200);

			$el.delay(120).animate({
				top: 96
			}, 200);

		}

	});

	return AddressView;

});