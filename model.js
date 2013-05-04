define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var eventBrokerMixin = require('./event-broker');
	var listenerMixin = require('./listener');


	var Model = Backbone.Model.extend({

		constructor: function () {
			Backbone.Model.apply(this, arguments);

			// Декларативные слушатели
			this.delegateListeners();
		},

		toggleAttr: function (name) {
			this.unary(name, function (value) {
				return !value;
			});
		},

		unary: function (name, operation) {
			var value = this.get(name);
			this.set(name, operation(value));
		},

		dispose: function () {
			// todo: Закончить
			return;
			if (this.disposed) return;

			// Finished.
			this.disposed = true;

			// Unbind all global event handlers.
			this.unsubscribeAllEvents();

			// Unbind all referenced handlers.
			this.stopListening();

			// Remove all event handlers on this module.
			this.off();


			// Remove the collection reference, internal attribute hashes
			// and event handlers.
				var properties = [
					'collection',
					'attributes', 'changed',
					'_escapedAttributes', '_previousAttributes',
					'_silent', '_pending',
					'_callbacks'
				];

//			delete this[prop] for prop in properties
		}

	});

	_.extend(Model.prototype, eventBrokerMixin, listenerMixin);

	return Model;
});