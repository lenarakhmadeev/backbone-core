define(function (require) {
	'use strict';

	var listener = {
		delegateListeners: function () {
			if (!this.listen) {
				return;
			}

			// Walk all `listen` hashes in the prototype chain.
			for (var key in this.listen) {
				var method = this.listen[key];
				if (typeof method !== 'function') {
					method = this[method];
				}

				if (typeof method !== 'function') {
					var errorText = 'View#delegateListeners: ' + key + 'must be function';
					throw new Error(errorText);
				}

				this.delegateListener(key, method);
			}
		},


		/*

		 listens:
		 '@model change:lol change:gool': 'smth'
		 '@smth event': ->

		 'sub event': ''
		 'event name'

		 */

		delegateListener: function (key, callback) {
			var eventName, parts = key.split(' ');

			if (parts[0] === 'sub') {
				eventName = this._sliceEventName(parts);
				this.subscribeEvent(eventName, callback);
			} else if (parts[0][0] === '@') {
				var propName = parts[0].slice(1);
				var target = propName ? this[propName] : this;
				eventName = this._sliceEventName(parts);
				this.listenTo(target, eventName, callback);
			} else {
				this.on(key, callback, this);
			}
		},


		_sliceEventName: function (parts) {
			return parts.slice(1).join(' ');
		}

	};

	return listener;
});