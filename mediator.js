define(function (require) {
	'use strict';

	var Backbone = require('backbone');


	var mediator = {};
	mediator.subscribe   = mediator.sub   = Backbone.Events.on;
	mediator.unsubscribe = mediator.unsub = Backbone.Events.off;
	mediator.publish     = mediator.pub   = Backbone.Events.trigger;

	return mediator;
});


