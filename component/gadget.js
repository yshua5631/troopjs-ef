define([ "troopjs-core/component/gadget", "./ef" ], function EFGadgetModule(Gadget, EF) {
	"use strict";

	return Gadget.extend(EF, {
		displayName : "ef/gadget"
	});
});