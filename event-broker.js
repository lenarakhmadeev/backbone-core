define(function (require) {
	'use strict';

	// Add functionality to subscribe and publish to global
	// Publish/Subscribe events so they can be removed afterwards
	// when disposing the object.
	//
	// Mixin this object to add the subscriber capability to any object:
	// _(object).extend EventBroker
	// Or to a prototype of a class:
	// _(@prototype).extend EventBroker
	//
	// Since Backbone 0.9.2 this abstraction just serves the purpose
	// that a handler cannot be registered twice for the same event.
	var mediator = require('./mediator');


	var eventBroker = {

		subscribeEvent: function (type, handler) {
			if (typeof  type != 'string') {
				throw new TypeError('EventBroker//subscribeEvent: ' +
					'type argument must be a string');
			}

			if (typeof handler != 'function') {
				throw new TypeError('EventBroker//subscribeEvent: ' +
			'handler argument must be a function');
			}


			// Ensure that a handler isn’t registered twice
			mediator.unsubscribe(type, handler, this);

			// Register global handler, force context to the subscriber
			mediator.subscribe(type, handler, this);
		},

		unsubscribeEvent: function (type, handler) {
			if (typeof type != 'string') {
				throw new TypeError('EventBroker//unsubscribeEvent: ' +
					'type argument must be a string');
			}
			if (typeof handler != 'function') {
				throw new TypeError('EventBroker//unsubscribeEvent: ' +
					'handler argument must be a function');
			}

			// Remove global handler
			mediator.unsubscribe(type, handler);
		},

		// Unbind all global handlers
		unsubscribeAllEvents: function () {
			// Remove all handlers with a context of this subscriber
			mediator.unsubscribe(null, null, this);
		},


		publishEvent: function (type, args) {
			if (typeof type != 'string') {
				throw new TypeError('EventBroker//publishEvent: ' +
					'type argument must be a string');
			}

			// Publish global handler
			mediator.publish.apply(mediator, arguments);
		}

	};

	if (Object.freeze) {
		Object.freeze(eventBroker);
	}

	return eventBroker;
});




