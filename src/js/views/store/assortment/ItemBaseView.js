// Filename: src/js/views/store/assortment/ItemBaseView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'notificationcenter'
    ], function ($, _, Backbone, notificationcenter, ArticleTemplate) {

	var ItemBaseView = Backbone.View.extend({

		className: '',

		events: {
			'click .bEye': '_toggleIsActive',
			'focusout input': '_updateCustomPrice',
			'click .bReset': '_resetCustomPrice'
		},

		template: null,

		initialize: function () {
			this._render();

			this.model.on('renderAgain', this._render, this);
		},

		_render: function () {
			var json = {
				title: this.model.get('title'),
				price: this.model.get('customPrice'),
				info: this.model.get('info'),
				isActive: this.model.get('isActive'),
				buyed: this.model.get('buyed'),
				image: this.model.get('smallImage'),
				priceDiffers: this.model.get('customPrice') !== this.model.get('price')
			};

			this.$el.html(this.template(json));

			this.$el.toggleClass('inactive', !this.model.get('isActive'));

		},

		_toggleIsActive: function () {
			var itemModel = this.model,
				$eye = this.$('.bEye'),
				$el = this.$el,
				isActive = !this.model.get('isActive');


			itemModel.set('isActive', isActive);
			itemModel.save({}, {
				success: function () {
					$eye.toggleClass('open', isActive);
					$el.toggleClass('inactive', !isActive);

					if (isActive) {
						notificationcenter.notify('views.store.assortment.items.success.isActive');
					} else {
						notificationcenter.notify('views.store.assortment.items.success.isNotActive');
					}
				},
				error: function () {
					notificationcenter.notify('views.store.assortment.items.error');
					itemModel.set('isActive', !isActive);
				}
			});
		},

		_updateCustomPrice: function () {
			var $input = this.$('.pricetag input'),
				customPrice = parseFloat($input.val()),
				self = this;

			this.model.set('customPrice', customPrice);
			this.model.save({}, {
				success: function () {
					notificationcenter.notify('Preis geaendert');

					// rerender for reset button
					self._render();
				},
				error: function () {
					notificationcenter.notify('views.store.assortment.items.error');
				}
			});
		},

		_resetCustomPrice: function () {
			var $input = this.$('.pricetag input');

			$input.val(this.model.get('price'));
			this._updateCustomPrice();
		}

	});

	return ItemBaseView;

});