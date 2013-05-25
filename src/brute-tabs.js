/*
 * brute-tabs
 * https://github.com/grassator/jquery-brute-tabs
 *
 * Copyright (c) 2013 Dmitriy Kubyshkin
 * Licensed under the MIT license.
 */
(function ($) {
	"use strict";

	/**
	 * Brute Tabs main class
	 * @param {jQuery} $el
	 * @param {object} options
	 * @constructor
	 */
	function BruteTabs ($el, options) {
		// Merging options into our object for easier access from outside
		// to our function like "formatter" or "wrap"
		$.extend(this, options);

		// Adding references to necessary elements
		this.$el = $el;
		this.$tabs = this.getValue('tabs');
		this.$panes = this.getValue('panes');

		this.bindEvents();
		
		// This check is useful for accordeon when you don't want any
		// pane to be ope by default
		var initialTab = this.getValue(initialTab);
		if(initialTab !== false && initialTab !== null) {
			this.change(initialTab);
		}
	}

	BruteTabs.prototype = {
		/**
		 * This is used for getting option values that can be either
		 * static (scalar types) or dynamic (functions)
		 * @param {string} key
		 * @returns {*}
		 */
		getValue: function(key) {
			if(typeof this[key] === 'function') {
				return this[key]();
			}
			return this[key];
		},
		
		/**
		 * Always returns jQuery chain for element for identifier from $collection
		 * @param  {jQuery} $collection
		 * @param  {*} identifier
		 * @return {jQuery}
		 */
		ensureCollectionElement: function($collection, identifier) {
			if(typeof identifier === 'number') {
				return $collection.eq(identifier);
			} else {
				return $collection.filter(identifier);
			}
		},
		
		/**
		 * Always returns function that accepts $element and applies some
		 * transition to it based on option
		 * @param  {*} option Option passed by the user
		 * @param  {string} direction 'show' or 'hide'
		 * @return {Function}
		 */
		ensureTransitionFunction: function(option, direction) {
			if('string' === typeof option) {
				return function($el, callback, init) {
					// When initializing we don't usually want any animation
					if(init) {
						$el[direction]();
						callback();
					} else {
						$el.stop()[option]('fast', callback);
					}
				};
			} else if(!option) {
				return function($el, callback) {
					callback();
				};
			} else if('function' === typeof option) {
				return option;
			} else {
				return function($el, callback) {
					$el[direction]();
					callback();
				};
			}
		},
		
		/**
		 * Main function for changing current tab
		 * @param  {*}   tab
		 * @param  {Function} callback
		 */
		change: function(tab, callback) {
			// Ensuring that callback is a function to simplify logic
			if(!$.isFunction(callback)) {
				callback = function() {};
			}
			
			var $tab = this.ensureCollectionElement(this.$tabs, tab),
				$pane = this.paneForTab($tab),
				showPane = this.ensureTransitionFunction(this.showPane, 'show'),
				hidePane = this.ensureTransitionFunction(this.hidePane, 'hide'),
				that = this,
				doShowPane = function(init) {
					that.$currentPane = $pane;
					showPane($pane, callback, init);
				};
			
			// If this is an initialization
			if(!this.$currentTab) {
				doShowPane(true);
			} else {
				this.deactivateTab(this.$currentTab);
				hidePane(this.$currentPane, doShowPane);
			}
			
			// Tab activation / deactivation doesn't use async chain because
			// in my opinion user needs to receive immediate feedback when
			// changing tabs
			this.activateTab($tab);
			this.$currentTab = $tab;
		},
		
		tabActivateHandler: function(e) {
			// Only activate tab when clicked with left mouse button
			if(e.which === 1){
				this.change(e.currentTarget);
			}
		},

		/**
		 * Bind all necessary event handlers
		 */
		bindEvents: function() {
			this.$tabs.on('click.' + this.baseName, $.proxy(this.tabActivateHandler, this));
		},

		/**
		 * If you need to destroy plugin instance, but keep original select,
		 * then you should call this method to avoid memory leaks
		 */
		destroy: function() {
			// Unbinding events to allow garbage collection
			this.$tabs.off('.' + this.baseName);
		}
	};

	/**
	 * Main initialization function for plugin.
	 * Also allows calling methods on already initialized instances
	 * @param {(string|object)=} options
	 * @returns {*}
	 */
	function bruteTabsPlugin (options) {
		if(typeof options !== 'string') {
			options = $.extend({}, bruteTabsPlugin.options, options);
		}

		/*jshint validthis: true */
		this.each(function () {
			var $this = $(this),
				data = $this.data(options.baseName);
			if (typeof options === 'string') {
				data[options].apply(data, [].slice.call(arguments, 1));
			} else if(!data) {
				$this.data(options.baseName, new BruteTabs($this, options));
			}
		});

		// Returning original collection for consistency
		return this;
	}

	/**
	 * Providing plugin class for outside usage (e.g. extension)
	 * @type {BruteTabs}
	 */
	bruteTabsPlugin.klass = BruteTabs;
	
	/**
	 * Highlights currently newly actived tab
	 * @param  {jQuery} $tab
	 */
	bruteTabsPlugin.activateTab = function($tab) {
		$tab.addClass(this.generateClassName('active'));
	};
	
	/**
	 * De-highlights currently previous tab
	 * @param  {jQuery} $tab
	 */
	bruteTabsPlugin.deactivateTab = function($tab) {
		$tab.removeClass(this.generateClassName('active'));
	};

	/**
	 * Finds tab buttons
	 * @return {jQuery}
	 */
	bruteTabsPlugin.tabs = function() {
		return this.$el.find('.' + this.generateClassName('buttons')).children();
	};
	
	/**
	 * Finds tab panes
	 * @return {jQuery}
	 */
	bruteTabsPlugin.panes = function() {
		return this.$el.find('.' + this.generateClassName('panes')).children();
	};
		
	/**
	 * Returns appropriate pane for tab. By default searches for pane
	 * with the same index as a tab
	 * @param  {jQuery} $tab
	 * @return {jQuery}
	 */
	bruteTabsPlugin.paneForTab = function($tab) {
		return this.$panes.eq(this.$tabs.index($tab));
	};

	/**
	 * Generates appropriate class name for plugin-generated element
	 * @param {string=} extra
	 * @param {boolean=} isModifier
	 * @returns {string}
	 */
	bruteTabsPlugin.generateClassName = function (extra, isModifier) {
		return this.getValue('baseName') + (extra ? '-' + extra : '');
	};

	/**
	 * Default options for a plugin
	 */
	bruteTabsPlugin.options = {
		baseName: 'brute-tabs',
		generateClassName: bruteTabsPlugin.generateClassName,
		paneForTab: bruteTabsPlugin.paneForTab,
		tabs: bruteTabsPlugin.tabs,
		panes: bruteTabsPlugin.panes,
		activateTab: bruteTabsPlugin.activateTab,
		deactivateTab: bruteTabsPlugin.deactivateTab,
		showPane: true,
		hidePane: true,
		initialTab: 0
	};

	// Providing our function as a jQuery plugin
	$.fn.bruteTabs = bruteTabsPlugin;

}(jQuery));
