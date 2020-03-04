define([ "troopjs-core/component/service", "./ef" ], function EFServiceModule(Service, EF) {
	"use strict";

	return Service.extend(EF, {
		displayName : "ef/service"
	});
});