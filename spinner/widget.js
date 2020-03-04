define([ "../component/widget", "when/delay" ], function (Widget, delay) {
	var TASKS = "tasks";
	var SPINNING = "ets-spinning";
	var $ELEMENT = "$element";
	var DELAY_START = "delayStart";
	var DELAY_STOP = "delayStop";

	/**
	 * This spinner is to be used in an element basis.
	 */
	return Widget.extend(function () {
		this[TASKS] = 0;
	}, {
		// Show the spinner until the promise is done.
		spinning: function (promise) {
			var me = this;
			var $element = me[$ELEMENT];
			delay($element.data(DELAY_START)).then(function () {
				$element.toggleClass(SPINNING, ++me[TASKS] > 0);
			});

			delay($element.data(DELAY_STOP), promise).ensure(function () {
				$element.toggleClass(SPINNING, --me[TASKS] > 0);
			});
		},

		// Spinning upon the custom "task" DOM event.
		"dom/task": function ($event, task) {
			this.spinning(task);
		}
	});
});
