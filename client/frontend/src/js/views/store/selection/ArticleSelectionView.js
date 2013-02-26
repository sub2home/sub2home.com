// Filename: src/js/views/store/selection/ArticleSelectionView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/TimelineItemModel',
	'views/store/selection/info/articleSelection/InfoView',
	'views/store/selection/SelectionView',
	'views/store/selection/stage/articleSelection/MenuComponentOptionsView'
	], function ($, _, Backbone, TimelineItemModel, InfoView, SelectionView, MenuComponentOptionsView) {

	var ArticleSelectionView = SelectionView.extend({

		/*
		 * this.$el = $('.main')
		 *
		 * this.model = orderedArticle
		 */

		className: 'articleSelection',

		stageViewClass: MenuComponentOptionsView,

		infoViewClass: InfoView,

		prepare: function () {

			var timelineItemModel = new TimelineItemModel(),
				menuComponentBlockModel = this.model.get('menuComponentBlockModel');


			if (menuComponentBlockModel) {
				this.active = true;

				console.log(menuComponentBlockModel);

				timelineItemModel.set({
					isLocked: true,
					icon: menuComponentBlockModel.get('icon'),
					image: menuComponentBlockModel.get('imageSmall'),
					phrase: 'Waehle deinen Artikel'
				});

				this._listenForArticleSelection();
			} else {
				// just symbolizes base article
				timelineItemModel.set('isDisabled', true);
			}


			this.timelineItemsCollection.add(timelineItemModel);

		},

		_listenForArticleSelection: function () {
			var orderedArticleModel = this.model,
				menuComponentBlockModel = orderedArticleModel.get('menuComponentBlockModel'),
				menuComponentOptionsCollection = menuComponentBlockModel.get('menuComponentOptionsCollection'),
				timelineItemsCollection = this.timelineItemsCollection,
				timelineItemModel, menuComponentOptionArticlesCollection;

			_.each(menuComponentOptionsCollection.models, function (menuComponentOptionModel) {
				menuComponentOptionArticlesCollection = menuComponentOptionModel.get('menuComponentOptionArticlesCollection');

				_.each(menuComponentOptionArticlesCollection.models, function (menuComponentOptionArticleModel) {
					menuComponentOptionArticleModel.on('change:isSelected', function () {

						if (menuComponentOptionArticleModel.get('isSelected')) {
							timelineItemModel = timelineItemsCollection.first();
							timelineItemModel.set('isLocked', false);
							orderedArticleModel.trigger('articleModelWasSelected');
						}

					});
				});
			});
		}

	});

	return ArticleSelectionView;

});