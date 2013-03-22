// Filename: src/js/views/store/tray/SubcardView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'notificationcenter',
    'models/cartModel',
    'text!templates/store/tray/SubcardTemplate.html'
    ], function ($, _, Backbone, notificationcenter, cartModel, SubcardTemplate) {

	var SubcardView = Backbone.View.extend({

		template: _.template(SubcardTemplate),

		events: {
			'click #selectImage': '_showFinder',
			'change #uploadImage': '_prepareImage'
		},

		initialize: function () {
			this._render();
		},

		_render: function () {

			var json = {};

			this.$el.html(this.template(json));

		},

		_showFinder: function () {
			this.$('#uploadImage').trigger('click');
		},

		_prepareImage: function (e) {

			// check if files available
			if (e.target.files.length > 0) {
				var file = e.target.files[0],
					self = this,
					reader = new FileReader();

				// Only process image files.
				if (!file.type.match('image.*')) {
					notificationcenter.notify('views.store.tray.subcard.invalidFileType');
					return;
				}

				// wait until image is encoded
				reader.onloadend = function (evt) {
					self._fetchSubcardCode(evt.target.result);
				};

				// Read in the image file as a data URL.
				reader.readAsDataURL(file);

			}
		},

		_fetchSubcardCode: function (baseUrl) {
			var orderModel = cartModel.get('orderModel');

			$.ajax({
				url: '/api/services/decode',
				data: JSON.stringify({
					image: baseUrl
				}),
				type: 'post',
				dataType: 'json',
				success: function (response) {
					orderModel.set('subcardCode', response.info);
					notificationcenter.notify('views.store.tray.subcard.success');
				},
				error: function () {
					notificationcenter.notify('views.store.tray.subcard.invalidImage');
				}
			});
		}

	});

	return SubcardView;

});