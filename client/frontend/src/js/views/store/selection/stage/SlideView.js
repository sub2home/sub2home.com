// Filename: src/js/views/store/selection/stage/SlideView.js
define([
	'jquery',
	'underscore',
	'backbone'
	], function ($, _, Backbone) {

	var SlideView = Backbone.View.extend({

		className: 'slide',

		// cache window
		$window: $(window),

		initialize: function () {

			var self = this;

			this.render();

			this.afterInitialize();

			this.$el.parent().bind('align', function () {
				self._alignView();
			});

		},

		_alignView: function () {
			// center vertical
			var wrappedHeight = this.$el.parent().height(),
				totalHeight = this.$el[0].scrollHeight;

			if (totalHeight < wrappedHeight) {
				this.$el.css({
					paddingTop: (wrappedHeight - totalHeight) / 2
				});
			}

			// adjust width
			this.adjustWidth();
		},

		adjustWidth: function () {
			this.$el.width(this.$window.width());
		},

		afterInitialize: function () {},

		render: function () {

			// wrap this.$el
			var $el = $('<div>').addClass(this.className).appendTo(this.$el);
			this.$el = $el;

			this.$el.width(this.$window.width());

		}


	});

	return SlideView;

});