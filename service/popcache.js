define([
	"module",
	"../component/service",
	"jquery"
], function CacheFillerService(module, EFService, $) {
	"use strict";

	/**
	 * Try out all possible ways to populate troop cache. Used for pre-fill data cache before any query that
	 * eliminates network requests.
	 *
	 * **Note:** This widget is only a back-port just for troopjs 2.x, deprecated in favor of {@link contrib-browser.service.popcache}.
	 * @deprecated
	 */
	var CACHE = "cache";

	return EFService.extend(function CacheFillerService(cache) {
		if (!cache) {
			throw new Error("no cache provided");
		}
		this[CACHE] = cache;
	}, {
		"displayName": "ef/data/popcache",
		"sig/start": function onStart() {
			var cache = this[CACHE];
			$("script[type='application/json'][data-query]").each(function(i, el) {
				cache.put(JSON.parse($(el).html()));
			});
		}
	});
});
