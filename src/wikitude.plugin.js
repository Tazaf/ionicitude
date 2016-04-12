/**
 * Defines an angular service that should be used to access the Wikitude cordova plugin.
 * You shouldn't need to inject this particular service into your controllers. You can, though.
 */
angular
	.module('IonicitudeModule')
	.service('plugin', plugin);

function plugin() {
	var plugin = undefined;

	this.get = getPlugin;

	////////////////////

	/**
	 * This function should be used to retrieve the Wikitude plugin in order to access and/or execute any of it's built-in functions.
	 * It follows the Singleton pattern in that it either load the plugin and returns it if it's the first time it's called,
	 * or return the already loaded plugin for each subsequent call.
	 * @returns {WikitudePlugin} The cordova Wikitude plugin
	 */
	function getPlugin() {
		if (!plugin) {
			plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
		}
		return plugin;
	}
}
