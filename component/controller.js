define([ "troopjs-browser/mvc/controller/widget", "./ef" ], function EFWidgetModule(Controller, EF) {
	"use strict";

	return Controller.extend(EF, {
		displayName : "ef/controller"
	});
});
