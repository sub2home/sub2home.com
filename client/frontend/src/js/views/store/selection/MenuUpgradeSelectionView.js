// Filename: src/js/views/store/selection/MenuUpgradeSelectionView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/store/selection/info/menuUpgradeSelection/InfoView',
    'views/store/selection/SelectionView',
    'views/store/selection/stage/menuUpgradeSelection/MenuUpgradesView'
    ], function ($, _, Backbone, InfoView, SelectionView, MenuUpgradesView) {

	var MenuUpgradeSelectionView = SelectionView.extend({

		stageViewClass: MenuUpgradesView,

		infoViewClass: InfoView,

		prepare: function () {

			var articleModel = this.model.get('articleModel');


			if (this.model.isMenuUpgradeBase() && articleModel.get('allowsMenuUpgrades')) {

				var menuUpgradesCollection = articleModel.get('menuUpgradesCollection');

				if (menuUpgradesCollection && menuUpgradesCollection.length > 0) {

					this.active = true;

					this.timelineItemsCollection.add({
						phrase: 'Waehle ein Menu Upgrade',
						menuUpgradeSelection: true,
						icon: 'iMenuUpgrade',
						image: '../../../img/static/common/menu_upgrade.png'
					});


					this._listenForSelection();

				}

			}

		},

		_listenForSelection: function () {

			var baseOrderedArticleModel = this.model,
				orderedItemModel = this.model.get('orderedItemModel');

			// listen for new menu upgrade selection
			baseOrderedArticleModel.on('change:menuUpgradeModel', function () {
				if (baseOrderedArticleModel.get('menuUpgradeModel')) {
					this._selectMenuUpgrade(baseOrderedArticleModel.get('menuUpgradeModel'));
				}
			}, this);

		},

		_selectMenuUpgrade: function (menuUpgradeModel) {

			var orderedArticlesCollection = this.model.collection,
				orderedItemModel = this.model.get('orderedItemModel'),
				menuComponentBlocksCollection = menuUpgradeModel.get('menuComponentBlocksCollection');

			// remove ordered articles belonging to an old menu upgrade
			orderedItemModel.reduceOrderedArticles();

			// create new ordered articles for each menu component block
			_.each(menuComponentBlocksCollection.models, function (menuComponentBlockModel) {

				orderedArticlesCollection.add({
					menuComponentBlockModel: menuComponentBlockModel,
					orderedItemModel: orderedItemModel
				});

			});

		}

	});

	return MenuUpgradeSelectionView;

});