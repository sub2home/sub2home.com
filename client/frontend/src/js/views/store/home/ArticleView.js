define([
	'jquery',
	'underscore',
	'backbone',
	'router',
	'models/stateModel',
	'text!templates/store/home/ArticleTemplate.html'
	], function ($, _, Backbone, router, stateModel, ArticleTemplate) {

	var ArticleView = Backbone.View.extend({

		events: {
			'click': 'takeArticle'
		},

		template: _.template(ArticleTemplate),

		initialize: function () {
			this.render();
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass('article');
		},

		takeArticle: function () {
			if (this.model.get('allowsIngredients')) {
				router.navigate('store/theke/artikel/' + this.model.get('id'), true);
			} else {
				alert('Warenkorb yo!');
			}
		}

	});

	return ArticleView;

});