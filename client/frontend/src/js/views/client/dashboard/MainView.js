// Filename: src/js/views/client/dashboard/MainView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'models/stateModel',
    'models/ClientModel',
    'views/PageView',
    'views/client/dashboard/StoresView',
    'views/client/dashboard/RevenuesView',
    'text!templates/client/dashboard/MainTemplate.html'
    ], function ($, _, Backbone, router, stateModel, ClientModel, PageView, StoresView, RevenuesView, MainTemplate) {

	var MainView = PageView.extend({

		initialize: function () {
			this.model = new ClientModel();
			this.model.fetch({
				async: false
			});

			console.log(this.model);

			// select store model if not already selected
			this._selectFirstStoreModel();

			this._switchHeaderToClientView();

			this._render();
		},

		_render: function () {
			this.$el.html(MainTemplate);

			new StoresView({
				el: this.$('#clientStores'),
				collection: this.model.get('storesCollection')
			});

			new RevenuesView({
				el: this.$('#clientRevenues'),
				collection: this.model.get('storesCollection')
			});

			this.append();
		},

		_switchHeaderToClientView: function () {
			stateModel.set('isClientHeaderActive', true);
		},

		_selectFirstStoreModel: function () {
			var currentStoreModel = stateModel.get('storeModel');

			if (!currentStoreModel) {
				var storesCollection = this.model.get('storesCollection');

				currentStoreModel = storesCollection.first();

				// store models gets fetched on store alias change event
				stateModel.set('storeAlias', currentStoreModel.get('alias'));
			}

		}

	});

	return MainView;

});