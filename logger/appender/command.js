define([ "../../component/gadget", "troopjs-utils/merge" ], function CommandAppenderModule(Gadget, merge) {
	var ARRAY_PUSH = Array.prototype.push;
	var LENGTH = "length";
	var BATCHES = "batches";
	var INTERVAL = "interval";
	var UA = navigator.userAgent;

	// Added UA and window location as extra log payload.
	function augment(obj) {
		return merge.call({
			"href": window.location.href,
			"browser": UA
		}, obj);
	}

	return Gadget.extend(function CommandAppender() {
		this[BATCHES] = [];
	}, {
		"sig/start": function () {
			var me = this;

			if (!(INTERVAL in me)) {
				me[INTERVAL] = setInterval(function batchInterval() {
					if (me[BATCHES][LENGTH] === 0) {
						return;
					}

					var batches = me[BATCHES];
					me[BATCHES] = [];

					me.publish("school/logger/Log", {
						"logParam": batches
					});
				}, 200);
			}
		},

		"sig/stop": function () {
			var me = this;

			function tryStop() {
				if (me[BATCHES][LENGTH] === 0) {
					if (INTERVAL in me) {
						clearInterval(me[INTERVAL]);

						delete me[INTERVAL];
					}
				}
				else {
					setTimeout(tryStop, 200);
				}
			}

			tryStop();
		},

		"append": function(obj) {
			ARRAY_PUSH.call(this[BATCHES], augment(obj));
		}
	});
});
