/**
 * Defines a lib service. This is where you can define custom functions that will be called from the AR View.
 */
angular
	.module('IonicitudeModule')
	.service('lib', lib);

/* @ngInject */
function lib(plugin) {

	// This is where your custom functions go

	this.close = close;
	this.hide = hide;
	this.show = show;
	this.setLocation = setLocation;

	////////////////////

	function close() {
		plugin.get().close();
	}

	function hide() {
		plugin.get().hide();
	}

	function show() {
		plugin.get().show();
	}
}
