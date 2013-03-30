define(function (require) {
	'use strict';

	var Backbone = require('backbone');
	var _ = require('underscore');
	var eventBrokerMixin = require('./event-broker');


	var View = Backbone.View.extend({

		/**
		 * Рендер после инитиализации
		 */
		autoRender: false,

		constructor: function (options) {
			Backbone.View.apply(this, arguments);

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

			return selector[action](view.el);
		}

	});

	_.extend(View.prototype, eventBrokerMixin);

	return View;
});