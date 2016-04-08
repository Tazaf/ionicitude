(function () {
	'use strict';

	/**
	 * Defines a lib service. This is where you can define custom functions that will be called from the AR View.
	 */
	angular
		.module('WikitudeModule')
		.service('lib', lib);

	lib.$inject = ['plugin'];

	function lib(plugin) {

		// This is where your custom functions go

		this.close = close;
		this.hide = hide;

		////////////////////

		function close() {
			plugin.get().close();
		}

		function hide() {
			plugin.get().hide();
		}
	}
})();
