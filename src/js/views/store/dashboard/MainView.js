// Filename: src/js/views/store/dashboard/MainView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'models/stateModel',
    'views/PageView',
    'views/store/dashboard/OrdersView',
    'views/store/dashboard/revenues/RevenuesView',
    'text!templates/store/dashboard/MainTemplate.html'
    ], function ($, _, Backbone, router, stateModel, PageView, OrdersView, RevenuesView, MainTemplate) {

	"use strict";

	var MainView = PageView.extend({

		subViews: {
			ordersView: null
		},

		template: _.template(MainTemplate),

		initialize: function () {

			// for authentification reload the store model
			this.model = stateModel.get('storeModel');
			this.model.fetch({
				url: 'stores/storeAlias/auth', // use custom route
				async: false
			});

			// set page title
			this.pageTitle = 'Bestellungen&Umsätze ' + this.model.get('title') + ' - sub2home';

			// check if client is allowed to view this page
			if (stateModel.clientOwnsThisStore()) {
				this._render();
			} else {
				router.navigate('login', {
					trigger: true,
					replace: true
				});
			}

		},

		_render: function () {

			var json = {
				title: this.model.get('title')
			};

			this.$el.html(this.template(json));

			this._renderOrders();

			// needs to be appended first for overscroll to work
			this.append();

			this._renderRevenues();


		},

		_renderOrders: function () {
			this.subViews.ordersView = new OrdersView({
				el: this.$el
			});
		},

		_renderRevenues: function () {
			new RevenuesView({
				el: this.$('#revenuesNote'),
				collection: this.model.get('invoicesCollection')
			});
		}

	});

	return MainView;

});