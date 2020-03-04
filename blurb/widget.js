define([ "../component/widget" ], function BlurbWidgetModule(Widget) {
	"use strict";

	var RE = /(?:\^(\w+)\^)/g;
	var PATTERNS = {
		"default" : RE
	};

	return Widget.extend({
		"sig/start" : function onStart() {
			var me = this;
			var $data = me.$element.data();


			// Query for blurb
			return me.query("blurb!" + $data.blurbId).spread(function doneQuery(blurb) {
				var pattern = $data.pattern;
				var values = $data.values;
				var translation = blurb.translation;

				if (translation && values) {
					pattern = pattern
						? PATTERNS[pattern] || RegExp(pattern, "g")
						: RE;

						translation = translation.replace(pattern, function (match, key, position, original) {
							return values[key] || key;
						});
				}

				// Set text, pass deferred
				return me.text(translation);
			});
		}
	});
});
