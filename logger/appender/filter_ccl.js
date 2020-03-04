define([ "../../component/gadget" ], function FilterCCLAppenderModule(Gadget) {
	var ENABLED = "enabled";
	var VARIABLE = "variable";
	var APPENDER = "appender";
	var PROMISE = "promise";
	var RESOLVE = "resolve";

	return Gadget.extend(function FilterCCLAppender(variable, appender) {
		var me = this;

		me[VARIABLE] = variable;
		me[APPENDER] = appender;
		me[PROMISE] = me.task(function (resolve) {
			me[RESOLVE] = resolve;
		});
	}, {
		"sig/start": function () {
			var me = this;

			return me[PROMISE].then(function () {
				return me
					.query("ccl!'" + me[VARIABLE] + "'")
					.spread(function (ccl) {
						me[ENABLED] = !!(ccl.value === "true");
						return me[APPENDER].start();
					});
			});
		},

		"sig/stop": function () {
			return this[APPENDER].stop();
		},

		"append": function() {
			var me = this;
			var appender = me[APPENDER];

			if (me[ENABLED]) {
				appender.append.apply(appender, arguments);
			}

			return me;
		},

		"hub:memory/context": function (context) {
			this[RESOLVE](context);
		}
	});
});