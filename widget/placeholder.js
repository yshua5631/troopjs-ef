/*!
 * TroopJS widget/placeholder component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*global define:true */
define([ "../component/widget", "troopjs-browser/loom/config", "troopjs-browser/loom/weave", "troopjs-browser/loom/unweave", "when" ], function WidgetPlaceholderModule(Widget, config, weave, unweave, when) {
	/*jshint strict:false, laxbreak:true */

	var HOLDING = "holding";
	var $ELEMENT = "$element";
	var TARGET = "target";

	function release(/* arg, arg, arg*/) {
		var me = this;
		var $element = me[$ELEMENT];

		// We're already holding something, resolve with me[HOLDING]
		if (HOLDING in me) {
			return when.resolve(me[HOLDING]);
		}
		else {
			// Set weave attribute to me[TARGET]
			$element.attr(config.weave, me[TARGET]);

			return weave
				// Weave (passing arguments)
				.apply($element, arguments)
				// We're only interested in the first woven element - spread
				.spread(function (widgets) {
					// Store first widget as HOLDING
					var widget = me[HOLDING] = widgets[0];

					// Trigger element released event
					$element.triggerHandler("released", [ widget ]);

					// Return widget
					return widget;
				});
		}
	}

	function hold() {
		var me = this;
		var widget;
		var $element = me[$ELEMENT];

		// Check that we are holding
		if (HOLDING in me) {
			// Get what we're holding
			widget = me[HOLDING];

			// Cleanup
			delete me[HOLDING];

			// Set unweave attribute to widget
			$element.attr(config.unweave, widget);

			return unweave
				// Unweave (passing arguments)
				.apply($element, arguments)
				// Wait for it
				.then(function () {
					// Trigger element held event
					$element.triggerHandler("held", [ widget ]);
				});
		}
		else {
			return when.resolve();
		}

		return me;
	}

	return Widget.extend(function WidgetPlaceholder($element, name, target) {
		this[TARGET] = target;
	}, {
		displayName : "troopjs-ef/widget/placeholder",

		"sig/finalize" : function finalize() {
			return this.hold();
		},

		release : release,
		hold : hold
	});
});