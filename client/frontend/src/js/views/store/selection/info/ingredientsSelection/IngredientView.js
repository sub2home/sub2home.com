// Filename: src/js/views/store/selection/info/IngredientView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/store/selection/info/ingredientsSelection/IngredientTemplate.html'
	], function ($, _, Backbone, IngredientTemplate) {

	var IngredientView = Backbone.View.extend({

		className: 'ingredient',

		template: _.template(IngredientTemplate),

		events: {
			'click span': 'unselect'
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		unselect: function () {
			this.model.set('selected', false);
		}

	});

	return IngredientView;

});