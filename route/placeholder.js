define([ "../widget/placeholder" ], function RoutePlaceholderModule(Placeholder) {
	"use strict";

	var NULL = null;
	var ROUTE = "route";

	return Placeholder.extend(function RoutePlaceholderWidget($element, name) {
		this[ROUTE] = RegExp($element.data("route"));
	}, {
		"displayName" : "core/route/placeholder",

		"hub:memory/route" : function onRoute(topic, uri) {
			var me = this;
			var matches = me[ROUTE].exec(uri.path);

			if (matches !== NULL) {
				me.release.apply(me, matches.slice(1));
			}
			else {
				me.hold();
			}
		}
	});
});