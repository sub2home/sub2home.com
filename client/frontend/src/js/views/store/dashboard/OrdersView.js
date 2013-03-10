// Filename: src/js/views/store/dashboard/OrdersView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/OrdersCollection',
    'views/store/dashboard/OrderView',
    'text!templates/store/dashboard/NoOrdersTemplate.html'
    ], function ($, _, Backbone, OrdersCollection, OrderView, NoOrdersTemplate) {

	$.fn.extend({
		rotate: function (deg) {
			var $this = $(this);

			$this.css({
				'-webkit-transform': 'rotate(' + deg + 'deg)',
				'-moz-transform': 'rotate(' + deg + 'deg)',
				'-ms-transform': 'rotate(' + deg + 'deg)',
				'-o-transform': 'rotate(' + deg + 'deg)',
				'transform': 'rotate(' + deg + 'deg)'
			});
		}
	});

	var OrdersView = Backbone.View.extend({

		$ordersToday: null,
		$olderOrders: null,
		$search: null,
		$refresh: null,
		$loadMore: null,
		$noOrders: null,

		// pagination counter
		page: 0,

		// search value for fetching
		search: '',

		rotateInterval: null,

		searchTimeout: null,

		isReady: true,

		rotationDeg: 0,

		events: {
			'keyup #search': '_delayedSearch',
			'click #refresh': '_refresh',
			'click #loadMore': '_loadMore'
		},

		initialize: function () {

			this.collection = new OrdersCollection();

			this._cacheDom();
			this._fetchCollection();

		},

		_cacheDom: function () {
			this.$ordersToday = this.$('.ordersToday');
			this.$olderOrders = this.$('.olderOrders');
			this.$search = this.$('#search');
			this.$refresh = this.$('#refresh');
			this.$loadMore = this.$('#loadMore');
			this.$noOrders = this.$('#noOrders');
		},

		_listenToCollection: function () {
			this.listenTo(this.collection, 'add remove', this._render);
		},

		_fetchCollection: function () {

			var self = this;

			if (this.isReady) {

				this.isReady = false;

				this._startRotateRefresh();

				this.collection.fetch({

					parse: true,

					data: $.param({
						search: this.search,
						page: this.page
					}),

					success: function (collection, receivedOrders) {
						self.isReady = true;
						self._stopRotateRefresh();
						self._renderOrders();

						if (receivedOrders.length === 0) {
							self._hideLoadMore();
						} else {
							self._showLoadMore();
						}

						if (collection.length === 0) {
							self._renderNoOrders();
						}
					},

					error: function () {
						self._stopRotateRefresh();
						self._renderNoOrders();
					}

				});

			}

		},

		_renderOrders: function () {
			_.each(this.collection.models, function (orderModel) {
				this._renderOrder(orderModel);
			}, this);
		},

		_renderOrder: function (orderModel) {
			var orderView = new OrderView({
				model: orderModel
			});

			if (orderModel.wasCreatedToday()) {
				this.$ordersToday.append(orderView.el);
			} else {
				this.$olderOrders.append(orderView.el);
			}

		},

		_renderNoOrders: function () {
			this.$noOrders.html(NoOrdersTemplate);
		},

		_delayedSearch: function () {
			var self = this;
			clearTimeout(this.searchTimeout);
			this.searchTimeout = setTimeout(function () {
				self._search();
			}, 300);
		},

		_search: function () {

			this.search = this.$search.val();

			this._resetView();

			if (this.search) {
				this.$olderOrders.addClass('opaque');
			}

			this._hideLoadMore();
			this._fetchCollection();
		},

		_refresh: function () {
			this._clearSearch();
			this._resetView();
			this._fetchCollection();
		},

		_loadMore: function () {
			this.page++;
			this._clearSearch();
			this._fetchCollection();
		},

		_startRotateRefresh: function () {

			var $refresh = this.$refresh,
				self = this;

			this.rotateInterval = setInterval(function () {
				self.rotationDeg = (self.rotationDeg + 15) % 180;
				$refresh.rotate(self.rotationDeg);
			}, 20);
		},

		_stopRotateRefresh: function () {

			var self = this;

			// wait until rotation complete
			var checkInterval = setInterval(function () {
				if (self.rotationDeg === 0) {
					clearInterval(self.rotateInterval);
					clearInterval(checkInterval);
				}
			}, 10);
		},

		_resetView: function () {
			this.page = 0;
			this.$olderOrders.removeClass('opaque');
			this.$ordersToday.empty();
			this.$olderOrders.empty();
			this.$noOrders.empty();
		},

		_hideLoadMore: function () {
			this.$loadMore.fadeOut(100);
		},

		_showLoadMore: function () {
			this.$loadMore.fadeIn(100);
		},

		_clearSearch: function () {
			this.$search.val('');
			this.search = '';
		}

	});

	return OrdersView;

});