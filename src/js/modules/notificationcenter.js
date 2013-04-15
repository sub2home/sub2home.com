// Filename: src/js/modules/notificationcenter.js
define([
    'notificationRepository',
    'tooltipRepository',
    'models/NotificationModel',
    'models/TooltipModel',
    'views/notifications/NotificationsView',
    'views/notifications/ToolTipsView'
    ], function (notificationRepository, tooltipRepository, NotificationModel, TooltipModel, NotificationsView, ToolTipsView) {

	var Notificationcenter = {

		notificationsView: null,
		tooltipsView: null,

		init: function () {
			this.notificationsView = new NotificationsView();
			this.tooltipsView = new ToolTipsView();
		},

		notify: function (alias, data) {

			data = data || {};

			var notificationModel = notificationRepository.getNotificationModel(alias, data);

			this.notificationsView.renderNotification(notificationModel);

		},

		tooltip: function (alias, top, left) {

			var tooltipModel = tooltipRepository.getTooltipModel(alias);

			this.tooltipsView.renderTooltip(tooltipModel, top, left);

		},

		hideTooltip: function () {
			this.tooltipsView.hideTooltip();
		},

		destroyAllNotifications: function () {
			this.notificationsView.destroyAllNotificationViews();
		}

	};

	return Notificationcenter;

});