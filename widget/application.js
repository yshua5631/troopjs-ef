define([ "troopjs-browser/application/widget", "../component/ef" ], function EFApplicationWidgetModule(Application, EF) {
	"use strict";

	return Application.extend(EF, {
		displayName : "ef/widget/application"
	});
});