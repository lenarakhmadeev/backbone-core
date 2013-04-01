define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var eventBrokerMixin = require('./event-broker');


	var View = Backbone.View.extend({

		constructor: function (options) {
			Backbone.View.apply(this, arguments);

			// Рендер после инитиализации
			this.autoRender = true;

			// Приватный массив сабвью
			this._subviews = [];

			this.autoRender = 'autoRender' in options
				? options.autoRender
				: this.autoRender;

			if (this.autoRender) {
				this.render()
			}
		},

		/**
		 * Возвращает данные, необходимые для рендера
		 *
		 * @returns Object
		 */
		serialize: function () {
			if (this.model) {
				return this.model.toJSON();
			}

			if (this.collection) {
				return { collection: this.collection.toJSON() };
			}

			return {};
		},

		/**
		 * Возвращает отрендереный шаблон
		 */
		renderTemplate: function () {
			if (this.template) {
				var data = this.serialize();
				return this.template(data);
			} else {
				return '';
			}
		},

		/**
		 * Выполняет наиболее общий случай рендера
		 */
		render: function () {
			this.clear();

			// Рендерим шаблон в HTML
			var tplHtml = this.renderTemplate();
			this.$el.html(tplHtml);

			// Запускаем _render,
			// который может быть определен в потомках
			// и несет особую логику рендера
			if (_.isFunction(this._render)) {
				this._render.apply(this, arguments);
			}

			// Перепривязываем события DOM, которые определены декларативно
			this.undelegateEvents();
			this.delegateEvents();

			// Так принято в Backbone
			return this;
		},

		/**
		 * Перегрузить!!!
		 * Особая логика для рендера
		 *
		 * @private
		 */
		_render: function () {

		},

		/**
		 * Очищает DOM элемент
		 */
		clear: function () {
			this.$el.children().remove();
			this.$el.empty();
		},

		/**
		 * Shortcut для добавления подвью в конец
		 * view OR selector, view
		 */
		append: function (selector, view) {
			if (!(selector && view)) {
				view = selector;
				selector = this.$el;
			}

			return this.mixinView(selector, view, 'append');
		},

		replace: function (selector, view) {
			return this.mixinView(selector, view, 'replaceWith');
		},

		mixinView: function (selector, view, action) {
			if (_.isString(selector)) {
				selector = this.$(selector);
			}

			this.addSubview(view);

			return selector[action](view.el);
		},

		addSubview: function (view) {
			this._subviews.push(view);
		},

		removeSubview: function (view) {
			var pos;
			while ((pos = this._subviews.indexOf(view)) !== -1) {
				this._subviews.splice(pos, 1);
			}
		},

		dispose: function () {
			if (this.disposed) {
				return;
			}

			// Flag.
			this.disposed = true;

			var i;

			// Dispose subviews
			for (i = 0; i < this._subviews.length; i++) {
				this._subviews[i].dispose()
			}

			// Unbind handlers of global events.
			this.unsubscribeAllEvents();

			// Unbind all referenced handlers.
			this.stopListening();

			// Remove all event handlers on this module.
			this.off();

			// Remove the topmost element from DOM. This also removes all event
			// handlers from the element and all its children.
			this.$el.remove();

			// Remove element references, options,
			// model/collection references and subview lists.
			var properties = [
				'el',
				'$el',
				'options',
				'model',
				'collection',
				'_subviews',
				'_callbacks'
			];

			var prop;
			for (i = 0; i < properties.length; i++) {
				prop = properties[i];
				delete this[prop];
			}

			// You’re frozen when your heart’s not open.
			if (Object.freeze) {
				Object.freeze(this);
			}
		}

	});

	_.extend(View.prototype, eventBrokerMixin);

	return View;
});