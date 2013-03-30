define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var eventBrokerMixin = require('./event-broker');


	var Model = Backbone.Model.extend({

		toggleAttr: function (name) {
			this.unary(name, function (value) {
				return !value;
			});
		},

		unary: function (name, operation) {
			var value = this.get(name);
			this.set(name, operation(value));
		}

	});

	_.extend(Model.prototype, eventBrokerMixin);

	return Model;
});