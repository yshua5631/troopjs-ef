define([ "../component/service", "when", "troopjs-utils/merge", "troopjs-utils/unique", "client-state", "client-tracking" ], function (Service, when, merge, unique, cs, ct) {
	"use strict";

	var UNDEFINED;
	var TOPICS = "topics";
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_CONCAT = ARRAY_PROTO.concat;
	var STATE = "state";
	var TRACKING = "tracking";

	return Service.extend(function RouteService(topics) {
		if (topics === UNDEFINED) {
			throw new Error("no topics provided");
		}

		this[TOPICS] = topics;
	}, {
		"displayName": "ef/tracking/service",

		"hub/tracking/track" : function (name, state, tracking) {
			var topics = this[TOPICS];

			// Get topic or default topic
			var topic = topics[name] || {};

			// Merge topic[STATE] and state
			state = merge.call({}, topic[STATE] || {}, state || {});
			// Concat topic[TRACKING] and tracking
			tracking = ARRAY_CONCAT.call(ARRAY_PROTO, topic[TRACKING] || [], tracking || []);
			// Filter tracking to only contain unique values
			unique.call(tracking, function (a, b) {
				return a === b;
			});

			// Put all state keys and value into cs (async)
			// Trigger all tracking events on ct (async)
			when
				.map(Object.keys(state), function (key) {
					return cs.put(key, state[key]);
				})
				.then(function () {
					return when.map(tracking, function (event) {
						return ct.trigger(event);
					});
				});
		}
	});
});