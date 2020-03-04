define([ "troopjs-core/net/uri", "troopjs-core/logger/pubsub" ], function EFModule(URI, Logger) {
	"use strict";

	var ARRAY_PUSH = Array.prototype.push;

	return {
		"route" : function (uri) {
			if(!(uri instanceof URI)) {
				uri = URI(uri);
			}

			window.location.hash = uri;
		},

		"query" : function (query) {
			var me = this;
			var args = [ "query" ];

			// Append original arguments to args
			ARRAY_PUSH.apply(args, arguments);

			// Return publish wrapped in task
			return me.task(function (resolve) {
				resolve(me.publish.apply(me, args));
			});
		},

		"log" : Logger.log,
		"info" : Logger.info,
		"warn" : Logger.warn,
		"debug" : Logger.debug,
		"error" : Logger.error
	};
});