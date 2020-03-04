define([
	"module",
	"../component/service",
	"../command/service",
	"troopjs-core/net/uri",
	"poly/array",
	"poly/object"
], function EFConfigServiceModule(module, EFService, CommandService, URI) {
	"use strict";

	var CACHE = "cache";

	return EFService.extend(function ConfigService(cache) {
		if (!cache) {
			throw new Error("no cache provided");
		}
		this[CACHE] = cache;
	}, {
		displayName: "ef/service/config",
		"sig/start": function onStart() {
			var me = this;
			// Before querying anything, query the shared global context for C parameters.
			return me.query("context!current").spread(function(context) {
				return me.publish("registry/get", "data/query/service").spread(function(queryService) {
					if (!queryService) {
						throw new Error('Query service not found');
					}

					var config = queryService.configure();

					// Merge the configured URL query with C-parameters from the context.
					var url = URI(config.url);
					var cParams = context["values"];
					var query = url.query = URI.Query(url.query || {});
					query.c = Object.keys(cParams).map(function(key) {
						return key + "=" + cParams[key]["value"];
					}).join("|");

					queryService.configure({
						"url": url.toString()
					});
				});
			})
			.then(function() {
					// Get all components from registry
					return me.publish("registry/get").then(function(components) {
						// Iterate API endpoints
						return me.query("command!*").spread(function(command) {
							var commands = command["results"];
							Object.keys(commands).forEach(function(cmd) {
								var config = commands[cmd];
								// Map service name
								var service;
								// Find components matching the name
								var existing = components.filter(function(component) {
									return cmd === component.displayName;
								});

								// If there are command services that already exist, just re-configure.
								if (existing.length) {
									// Iterate
									existing.forEach(function(index, component) {
										// Configure
										component.configure(config);
									});
								}
								// Otherwise create, configure and start a new action service
								else {
									// Create new ActionService
									service = CommandService(cmd, me[CACHE]);
									// Configure
									service.configure(config);
									// Start
									service.start();
								}
							});
						});
					});
				});
		}
	});
});
