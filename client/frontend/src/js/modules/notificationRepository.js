// Filename: src/js/modules/notificationRepository.js
define([
    'underscore',
    'models/NotificationModel'
    ], function (_, NotificationModel) {

	var NotificationRepository = {

		_items: {

			'default': {
				title: 'Hey',
				description: 'Das ist wohl eine nutzlose Notiz. Sie hat nämlich überhaupt keinen Zweck.',
				className: 'info'
			},


	// Global Notifications
	// --------------------


	// Invalid Address-Data

			'models.addressModel.invalid': {
				title: 'Falsche Adressdaten',
				description: 'Bitte geben Sie eine gültige Adresse an.',
				className: 'warning'
			},

	// Invalid Price-Data

			'models.articleModel.invalid': {
				title: 'Ungültiger Preis',
				description: 'Bitte geben Sie einen gültigen Preis ein.',
				className: 'warning'
			},

	// Invalid Bankaccount-Data

			'models.bankaccountModel.invalid': {
				title: 'Ungültige Bankverbindung',
				description: 'Bitte geben Sie eine gültige Bankverbindung an.',
				className: 'warning'
			},

	// Invalid Store-Data

			'models.storeModel.invalid': {
				title: 'Ungültige Daten',
				description: 'Bitte geben Sie gültige Daten an.',
				className: 'warning'
			},	

	// Invalid Delivery-Area

			'models.deliveryAreaModel.invalid': {
				title: 'Ungültiges Liefergebiet',
				description: 'Bitte geben Sie ein gültiges Liefergebiet an.',
				className: 'warning'
			},

	// Invalid Delivery-Time

			'models.deliveryTimeModel.invalid': {
				title: 'Ungültige Lieferzeit',
				description: 'Bitte geben Sie eine gültige Lieferzeit an',
				className: 'warning'
			},

	// Invalid Order-Data

			'models.orderModel.invalid': {
				title: 'Ungültige Bestellung',
				description: 'Entweder deine Notiz ist zu lang, oder deine Zahlmethode wird doch nicht unterstützt.',
				className: 'warning'
			},

	// Invalid Authenfication-Data

			'models.authentificationModel.tooManyErrors': {
				title: 'Zu viele Fehler',
				description: 'Probier es später nochmal.',
				className: 'warning'
			},

			'models.authentificationModel.dataWrong': {
				title: 'Nicht registiert',
				description: 'Diese Kundennummer ist nicht registriert. Vielleicht ein Tippfehler?',
				className: 'error'
			},
			

	// View-Related Notifications
	// --------------------------


	// header

			'views.header.cart.empty': {
				title: 'Dein Tablett ist leer',
				description: 'Noch ist nichts auf deinem Tablett. Das kannst du aber ändern.',
				className: 'info'
			},



	// client.config

			'views.client.config.address.success': {
				title: 'Adresse geändert',
				description: 'Ihre Adressdaten wurden erfolgreich aktualisiert.',
				className: 'success'
			},

			'views.client.config.address.error': {
				title: 'Adressänderung fehlgeschlagen',
				description: 'Ihre Adressdaten wurden nicht aktualisiert.',
				className: 'error'
			},

			'views.client.config.bankaccount.success': {
				title: 'Bankverbindung geändert',
				description: 'Ihre Kontodaten wurden erfolgreich aktualisiert.',
				className: 'success'
			},

			'views.client.config.bankaccount.error': {
				title: 'Änderung fehlgeschlagen',
				description: 'Ihre Kontodaten wurden nicht aktualisiert.',
				className: 'error'
			},

			'views.client.config.changePassword.oldPasswordWrong': {
				title: 'Falsches Passwort',
				description: 'Das ist leider nicht ihr altes Passwort.',
				className: 'warning'
			},

			'views.client.config.changePassword.invalidInput': {
				title: 'Unsicheres Passwort',
				description: 'Ihr neues Passwort muss mindestens 8 Zeichen haben.',
				className: 'warning'
			},



	// home.home

			'views.home.home.lookupLocation': {
				title: 'Einen Moment bitte',
				description: 'Dein Standort wird gerade ermittelt.',
				className: 'info'
			},

			'views.home.home.lookupFailed': {
				title: 'Hoppla, das ging schief',
				description: 'Wir konnten deinen Standort leider nicht ermitteln. Du kannst trotzdem einfach deine Postleitzahl eingeben.',
				className: 'warning'
			},

			'views.home.home.noStoresFound': {
				title: 'Kein Store in der Nähe',
				description: 'In deiner Nähe gibt es leider keinen Subway-Store, der über sub2home liefert.',
				className: 'error'
			},

			'views.home.home.selectStore': {
				title: 'Du hast die Wahl',
				description: 'In deiner Nähe befinden sich merhere Subway-Stores, such dir einfach einen aus.',
				className: 'info'
			},

			'views.home.home.selectDeliveryArea': {
				title: 'Noch etwas genauer',
				description: 'Um dir den richtigen Service bieten zu können, müssen wir noch etwas genauer wissen, wo du dich befindest. Das wars dann aber, versprochen.',
				className: 'info'
			},

			'views.home.home.storeNotInRange': {
				title: 'Sorry, zu weit weg',
				description: 'Du befindest dich außerhalb der Reichweite dieses Stores. Entscheide dich doch einfach für einen in deiner Nähe.',
				className: 'warning'
			},



	// store.assortment

			'views.store.assortment.articles.success.isActive': {
				title: 'Artikel aktiviert',
				description: 'Die gewählten Artikel sind jetzt im Store verfügbar.',
				className: 'success'
			},

			'views.store.assortment.articles.success.isNotActive': {
				title: 'Artikel deaktiviert',
				description: 'Die gewählten Artikel wurden aus Ihrem Sortiment entfernt.',
				className: 'success'
			},

			'views.store.assortment.articles.error': {
				title: 'Artikel unverändert',
				description: 'Die Änderung konnte nicht ausgeführt werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.assortment.articles.oneActiveArticleNeeded': {
				title: 'Mindestens 1 Artikel',
				description: 'Ihr Store muss mindestens einen Artikel anbieten.',
				className: 'warning'
			},



	// store.config

			'views.store.config.address.success': {
				title: 'Adresse aktualisiert',
				description: 'Ihre Adressdaten wurden erfolgreich geändert',
				className: 'success'
			},

			'views.store.config.address.error': {
				title: 'Adresse nicht aktualisiert',
				description: 'Ihre Adressdaten konnten nicht geändert werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.config.deliveryArea.add.error': {
				title: 'Hinzufügen fehlgeschlagen',
				description: 'Es konnte kein neues Liefergebiet hinzugefügt werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.config.deliveryTime.wrongTimeFormat': {
				title: 'Falsches Zeitformat',
				description: 'Vielleicht ein Tippfehler ? Sie müssen eine gültige Uhrzeit angeben.',
				className: 'warning'
			},

			'views.store.config.testOrder.success': {
				title: 'Testbestellung gesendet',
				description: 'Soeben wurde eine Testbestellung an die angegebene Email-Adresse versandt. Sie finden Sie außerdem in der Store-Übersicht.',
				className: 'success'
			},

			'views.store.config.testOrder.error': {
				title: 'Testbestellung nicht gesendet',
				description: 'Es konnte keine Testbestellung versendet werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.config.isOpen': {
				title: 'Store ist geöffnet',
				description: 'Ab sofort ist dieser Store geöffnet und für alle sub2home-Kunden sichtbar.',
				className: 'success'
			},

			'views.store.config.isClosed': {
				title: 'Store ist geschlossen',
				description: 'Ab sofort ist dieser Store geschlossen und für keinen sub2home-Kunden zugänglich. Durch erneuten Klick auf den Button öffnen Sie ihn wieder.',
				className: 'warning'
			},

			'views.store.config.isOpenError': {
				title: 'Store-Öffnung fehlgeschlagen',
				description: 'Der Store konnte nicht geöffnet werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.config.paymentMethods.success': {
				title: 'Zahlungsm. aktualisiert',
				description: 'Die Zahlungsmethoden für diesen Store wurden erfolgreich geändert.',
				className: 'success'
			},

			'views.store.config.paymentMethods.error.paypal': {
				title: 'Paypal-Fehler',
				description: 'PayPal konnte nicht aktiviert werden. Wenden Sie sich bitte an unseren Support',
				className: 'error'
			},

			'views.store.config.paymentMethods.error': {
				title: 'Änderung fehlgeschlagen',
				description: 'Die Zahlungsmethode konnte nicht aktualisiert werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},

			'views.store.config.paymentMethods.loadPaypal': {
				title: 'Einen Moment bitte.',
				description: 'Sie werden nun zu PayPal weitergeleitet.',
				className: 'info'
			},

			'views.store.config.info.success': {
				title: 'Bestell-Email aktualisiert',
				description: 'Die Email-Adresse für Bestellungen an diesen Store wurde erfolgreich geändert.',
				className: 'success'
			},

			'views.store.config.info.error': {
				title: 'Änderung fehlgeschlagen',
				description: 'Die Email-Adresse konnte nicht aktualisiert werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			},
	


	// store.home

			'views.store.home.addedOrderedItemToCart': {
				title: 'Ist auf dem Tablett',
				description: 'Du hast gerade einen Artikel auf dein Tablett gelegt. Natürlich nur bildlich.',
				className: 'sucess'
			},	



	// store.selection

			'views.store.selection.notReady': {
				title: 'Da fehlt noch was',
				description: 'Ein Schritt fehlt noch, um dein Sub aufs Tablett zu legen. Geh einfach nochmal zurück.',
				className: 'warning'
			},



	// store.selection

			'views.store.tray.minimumNotReached': {
				title: 'Mindestbestellwert',
				description: 'Du hast leider den Mindestbestellwert noch nicht erreicht. Frag deinen Magen, auf der Store-Seite werdet ihr euch einig.',
				className: 'warning'
			},

			'views.store.tray.orderFailed': {
				title: 'Das ging leider schief',
				description: 'Es tut uns leid, wir konnten deine Bestellung nicht abschicken. Dir bleibt aber immer noch die Möglichkeit, anzurufen. Ohne Schnickschnack, von Mensch zu Mensch. 094 580 34 95',
				className: 'error'
			},

			'views.store.tray.invalidDueTime': {
				title: 'Das ist zu früh',
				description: 'Wir sind schnell, aber nicht Iron Man. Bitte gedulde dich.',
				className: 'warning'
			},

			'views.store.tray.cartNowEmpty': {
				title: 'Dein Tablett ist leer',
				description: 'Du hast keinen Artikel mehr auf dem Tablett. Einfach Artikel wählen, um das wieder zu ändern.',
				className: 'info'
			},



	// store.dashboard

			'views.store.dashboard.testOrder.success': {
				title: 'Testbestellung gesendet',
				description: 'Soeben wurde eine Testbestellung an die hinterlegte Email-Adresse versandt.',
				className: 'success'
			},

			'views.store.dashboard.testOrder.error': {
				title: 'Testbestellung nicht gesendet',
				description: 'Es konnte keine Testbestellung versendet werden. Wenden Sie sich bitte an unseren Support.',
				className: 'error'
			}
		},

		getNotificationModel: function (alias, data) {
			var defaultItem = {
				title: alias
			},
			item = this._items[alias] || defaultItem;

			return new NotificationModel(item);
		}


	};

	return NotificationRepository;

});