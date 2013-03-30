define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var eventBrokerMixin = require('./event-broker');
	var Model = require('./model');


	var Collection = Backbone.Collection.extend({
		model: Model
	});

	_.extend(Collection.prototype, eventBrokerMixin);

	return Collection;
});