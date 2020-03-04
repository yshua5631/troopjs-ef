define([ "troopjs-browser/component/widget", "./ef" ], function EFWidgetModule(Widget, EF) {
	"use strict";

	return Widget.extend(EF, {
		displayName : "ef/widget"
	});
});