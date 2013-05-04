define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var Model = require('./model');
	var eventBrokerMixin = require('./event-broker');
	var listenerMixin = require('./listener');


	var Collection = Backbone.Collection.extend({
		model: Model,

		constructor: function () {
			Backbone.Collection.apply(this, arguments);

			// Декларативные слушатели
			this.delegateListeners();
		}

	});

	_.extend(Collection.prototype, eventBrokerMixin, listenerMixin);

	return Collection;
});