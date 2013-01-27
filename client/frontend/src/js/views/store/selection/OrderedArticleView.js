// Filename: src/js/views/store/selection/OrderedArticleView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/store/selection/ArticleSelectionView',
	'views/store/selection/IngredientsSelectionView',
	'views/store/selection/MenuUpgradeSelectionView'
	], function ($, _, Backbone, ArticleSelectionView, IngredientsSelectionView, MenuUpgradeSelectionView) {

	var OrderedArticleView = Backbone.View.extend({

		/*
		 * this.$el = $('.main')
		 *
		 * this.model = orderedArticle
		 */

		articleSelectionView: null,

		ingredientsSelectionView: null,

		menuUpgradeSelectionView: null,

		initialize: function () {
			this.render();

			// remove view if model was destoryed
			var self = this;
			this.model.bind('destroy', function () {
				self.remove();
			});

		},

		render: function () {

			this.renderArticleSelection();
			this.renderIngredientsSelection();
			this.renderMenuUpgradeSelection();

		},

		renderArticleSelection: function () {
			this.articleSelectionView = new ArticleSelectionView({
				model: this.model,
				el: this.$el
			});
		},

		renderIngredientsSelection: function () {
			this.ingredientsSelectionView = new IngredientsSelectionView({
				model: this.model,
				el: this.$el
			});
		},

		renderMenuUpgradeSelection: function () {
			this.menuUpgradeSelectionView = new MenuUpgradeSelectionView({
				model: this.model,
				el: this.$el
			});
		},

		remove: function () {

			this.articleSelectionView.remove();
			this.ingredientsSelectionView.remove();
			this.menuUpgradeSelectionView.remove();

		}

	});

	return OrderedArticleView;

});