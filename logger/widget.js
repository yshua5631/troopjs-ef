define([ "../component/widget" ], function LoggerWidgetModule(Widget) {
	var $ELEMENT = "$element";

	return Widget.extend({
		"sig/start" : function () {
			var me = this;

			var $window = me[$ELEMENT].get(0);
			var orgOnError = $window.onerror;
			$window.onerror = function (msg, source, lineNo) {
				me.error({
					"source": source,
					"lineNo": lineNo,
					"msg": msg
				});

				// If window.onerror has defined.
				orgOnError && orgOnError.apply(this, arguments);
			}
		},

		"sig/stop" : function () {
			this[$ELEMENT].get(0).onerror = null;
		}
	})
});