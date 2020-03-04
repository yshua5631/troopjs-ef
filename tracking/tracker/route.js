define([ "../../component/service", "troopjs-utils/merge" ], function (Service, merge) {
	"use strict";

	var UNDEFINED;
	var TOPICS = "topics";
	var PATH = "path";
	var ROUTE = "route";
	var STATE = "state";
	var TRACKING = "tracking";

	return Service.extend(function RouteService(topics) {
		if (topics === UNDEFINED) {
			throw new Error("no topics provided");
		}

		this[TOPICS] = topics;
	}, {
		"displayName" : "ef/tracking/tracker/route",

		"hub:memory/route" : function (uri) {
			var me = this;
			var topics = me[TOPICS];
			var path = PATH in uri
				? uri[PATH].toString()
				: "";

			Object
				.keys(topics)
				.forEach(function (name) {
					var topic = topics[name];
					var matches;

					// Get or default route, state and tracking
					var route = topic[ROUTE];
					var state = merge.call({}, topic[STATE] || {});
					var tracking = topic[TRACKING] || [];

					// If the route matches capture matches
					if (route && (matches = route.exec(path))) {
						Object
							.keys(state)
							.forEach(function (key) {
								// Replace value with matches (if possible)
								state[key] = state[key].replace(/\$(\d+)/g, function (original, token) {
									return matches[token] || original;
								});
							});

						// Publish tracking
						me.publish("tracking/track", name, state, tracking);
					}
				});
		}
	});
});