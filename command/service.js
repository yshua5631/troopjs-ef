define([ "../component/service", "troopjs-utils/merge" ], function CommandServiceModule(Service, merge) {
	"use strict";

	var NAME = "name";
	var CONFIGURATION = "configuration";
	var CACHE = "cache";

	function command(data) {
		var me = this;
		var cache = me[CACHE];

		return me.publish("ajax", merge.call({}, me[CONFIGURATION], {
			data : JSON.stringify(data),
				processData : false
			}))
			.then(function doneAction(data) {
				cache.put(data);
				return data;
			});
	}

	return Service.extend(function CommandService(name, cache) {
		var me = this;

		if (!name) {
			throw new Error("no name provided");
		}

		if (!cache) {
			throw new Error("no cache provided");
		}

		me[NAME] = me.displayName = name;
		me[CACHE] = cache;
	}, {
		"displayName" : "ef/command/service",

		"sig/initialize" : function onInitialize() {
			var me = this;

			me.subscribe(me[NAME], command);
		},

		"sig/finalize" : function onFinalize() {
			var me = this;

			me.unsubscribe(me[NAME], command);
		}
	});
});
