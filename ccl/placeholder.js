define([ "../widget/placeholder" ], function CCLPlaceholderModule(Placeholder) {
	"use strict";

	var CCL = "ccl";
	var VALUE = "value";

	return Placeholder.extend(function CCLPlaceholderWidget($element) {
		this[CCL] = $element.data(CCL);
	}, {
		"displayName" : "ef/ccl/placeholder",

		"hub:memory/context" : function onContext() {
			var me = this;

			me.query("ccl!\"" + me[CCL] + "\"").spread(function doneQuery(ccl) {
				if (ccl && VALUE in ccl && ccl[VALUE].toLowerCase() === "true") {
					me.release();
				}
				else {
					me.hold();
				}
			});
		}
	});
});
