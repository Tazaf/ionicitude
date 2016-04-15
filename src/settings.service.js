/**
 * Defines the default settings of the Wikitude service.
 * You can change any of those settings using the settings() method of the Wikitude service.
 * @type {Object}
 */
var settings = {
	// TODO : commenter la propriété selon la doc de Wikitude.
	worldConfig: {camera_position: 'back'},
	/**
	 * Defines which features your AR app need the device to support.
	 * For now, only two features are available in the cordova WikitudePlugin.
	 * The first one is 'geo' and is used for any ARchitect World that wants to rely on the user's location.
	 * The second is '2dtracking' and is used for any ARchitect World that wants to use image recognition and image tracking.
	 * More information : http://www.wikitude.com/developer/documentation/phonegap.
	 * @type {Array}
	 */
	reqFeatures: ['geo', '2dtracking'],
	/**
	 * Defines where in your app are stored all your ARchitect World folders.
	 * By default, a wikitude-worlds folder is created at the root of your app but you can easily change that by giving this parameter your custom path.
	 * Example : if you want to store your worlds folder in a myWorlds folder inside www, change the value to 'www/myWorlds'.
	 * @type {String}
	 */
	worldsRootFolder: 'wikitude-worlds'
};

/**
 * Defines a value service named 'settings' that can be used to access or change any of the service's settings.
 */
angular
	.module('IonicitudeModule')
	.value('settings', settings);

/**
 * Defines the value of the url protocol used by Wikitude to call the app from within the AR View.
 * This value SHOULD NOT be altered in anyway (hence the use of constant()...) since it's an internal Wikitude setting.
 */
angular
	.module('IonicitudeModule')
	.constant('protocol', 'architectsdk://');
