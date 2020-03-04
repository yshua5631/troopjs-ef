define([ "./widget" ], function (Spinner) {

	/**
	 * This spinner is to be used in a page-wide manner.
	 */
	return Spinner.extend({
		// Spinning upon the "task" hub event.
		"hub/task": function (task) {
			this.spinning(task);
		}
	});
});
