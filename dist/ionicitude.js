"use strict";
/**
 * Defines the UnsupportedFeatureError classe.
 * This type of error is and should be used whenever the app tries to start an ARchitect World that request features not supported by the device running the app.
 * The requested features (reqFeatures) is a setting accessible in the wikitude.settings.js file.
 * @constructor
 */
function UnsupportedFeatureError() {
	var temp = Error.apply(this, arguments);
	temp.name = this.name = 'UnsupportedFeatureError';
	this.stack = temp.stack;
	if (temp.message) {
		this.message = temp.message;
	} else {
		this.message = "Worls loading error : Your device does not support one or several of it's requested features."
	}
}

//inherit prototype using ECMAScript 5 (IE 9+)
UnsupportedFeatureError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: UnsupportedFeatureError,
		writable: true,
		configurable: true
	}
});

;(function(){
"use strict";

/**
 * Defines the WikitudeModule for subsequent uses in AngularJS
 */
angular.module('IonicitudeModule', []);

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
	worldsRootFolder: 'wikitude-worlds',
	/**
	 * Each of this parameter property references a sub-folder inside your worldsRootFolder, that containx all the files managing a single ARchitect world experience.
	 * The name that you give to each property must be used when launching this ARchitect World by calling the launchAR() method of the Ionicitude service.
	 * For example, to launch the 'main' ARchitext World, you will call : launchAR('main').
	 * Each property must have it's own two properties : folder and file.
	 * The first one must be set to the folder's name containing the file for this World, where the second must be set to the HTML main file for this world.
	 * By default, the folder property value and the property name are the same, and the file value is 'index.html', but you're obviously free the change that.
	 * @type {Object}
	 */
	worldsFolders: {
		/**
		 * Defines the properties for the 'main' ARchitect World
		 * @type {Object}
		 */
		main: {
			/**
			 * Defines the name of the folder containing the 'main' ARchitect World files, inside the folder referenced by the 'worldsRootFolder' value.
			 * If not provided, the name of the parent property will be used.
			 * @type {String}
			 */
			folder: 'main',
			/**
			 * Defines the name of the HTML file that contains the bootstrap of the ARchitect World.
			 * If not provided, the name 'index' will be used (thus targeting an index.html file inside the 'folder' folder.
			 * @type {String}
			 */
			file: 'index'
		}
	}
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

	////////////////////

	function close() {
		plugin.get().close();
	}

	function hide() {
		plugin.get().hide();
	}
}

/**
 * Defines the main service of the Wikitude module.
 * This is the service that you will inject into your controllers in order to use the Wikitude cordova plugin functions.
 */
angular
	.module('IonicitudeModule')
	.factory('Ionicitude', Ionicitude);

/* @ngInject */
function Ionicitude($q, plugin, settings, protocol, lib) {
	/**
	 * This is a simple flag to prevent calling the initService() public method twice.
	 * @type {boolean}
	 */
	var initialized = false;

	/**
	 * Defines the service object that will be publicaly accessible when injecting the Ionicitude service.
	 * @type {Object}
	 */
	var service = {
		checkDevice: checkDevice,
		deviceSupportsFeatures: false,
		initService: initService,
		launchAR: launchAR,
		setup: setup
	};

	return service;

	////////////////////

	/**
	 * TODO : vérifier le commentaire
	 * Checks if the device supports the features needed by the ARchitect World.
	 * These features are set with the reqFeatures property of the Ionicitude service.
	 * The result of this check is available through the deviceSupportsFeatures property of the Ionicitude service
	 * for it to be used later (alerting the user that he's/she's device is not compatible, for instance).
	 * For conveniency, the result of the check is returned by the function.
	 */
	function checkDevice() {
		var q = $q.defer();
		plugin.get().isDeviceSupported(function (success) {
			service.deviceSupportsFeatures = true;
			q.resolve(success);
		}, function (error) {
			service.deviceSupportsFeatures = false;
			q.reject(error);
		}, settings.reqFeatures);
		return q.promise;
	}

	/**
	 * TODO : commenter la méthode
	 */
	function initService(settings) {
		console.log(settings);
		if (!initialized) {
			console.log('init service starting');
			initialized = true;
			var callback = executeActionCall;
			if (customCallback()) callback = settings.onUrlInvokeCallback;
			plugin.get().setOnUrlInvokeCallback(callback);
			doDeviceCheck() && checkDevice();
		}

		/**
		 * Checks if you defined a custom onUrlInvokeCallback in the initService function's 'settings' argument.
		 * @returns {boolean}
		 */
		function customCallback() {
			return settings && settings.hasOwnProperty('customCallback') && typeof settings.customCallback === 'function';
		}

		/**
		 * Checks if you defined in the initService function's 'settings' argument that the device checking should be done.
		 * @returns {boolean}
		 */
		function doDeviceCheck() {
			return !(settings && settings.hasOwnProperty('doDeviceCheck') && settings.doDeviceCheck === false);
		}
	}

	/**
	 * TODO : commenter cette méthode
	 */
	function launchAR(world_ref) {
		if (!world_ref) world_ref = 'main';
		if (settings.deviceSupportsFeatures) {
			var q = $q.defer();
			console.log('launch');
			plugin.get().loadARchitectWorld(function (success) {
				q.resolve(success);
			}, function (error) {
				q.reject(error);
			}, getWorldUrl(world_ref), settings.reqFeatures, settings.worldConfig);
			return q.promise;
		} else {
			throw new UnsupportedFeatureError();
		}
	}

	/**
	 * TODO : commenter la méthode
	 * @param settings
	 */
	function setup(settings) {
		//TODO : remplir la méthode. Elle doit permettre de modifier n'importe laquelle des valeurs du service settings.
	}

	////////////////////

	/**
	 * TODO : commenter cette méthode
	 * @param world_ref
	 */
	function getWorldUrl(world_ref) {
		// vérifier que la world_ref existe
		if (!settings.worldsFolders.hasOwnProperty(world_ref)) {
			throw new SyntaxError('Ionicitude Module : launchAR() : The argument\'s value (\'' + world_ref + '\')passed in launchAR doesn\'t match any property of the worldsFolders setting.');
		}
		var root = 'www/' + settings.worldsRootFolder;
		var folder = settings.worldsFolders[world_ref].folder ? settings.worldsFolders[world_ref].folder : world_ref;
		var file = (settings.worldsFolders[world_ref].file ? settings.worldsFolders[world_ref].file : 'index') + '.html';
		return root + '/' + folder + '/' + file;
	}

	/**
	 * TODO : vérifier le commentaire
	 * This function should be set, with the setOnUrlInvokeCallback method, as the callback function for the 'architectsdk://' call done by the Wikitude AR View.
	 * The string passed as the 'call' argument must be formatted as follow :
	 * 'architectsdk://name_of_the_function_to_execute[?json_object_containging_any_function_parameters]'
	 * Example :
	 * 'architectsdk://saveClient?{"firstName":"Foo","lastName":"Bar"}'
	 * This call will execute the saveClient function, passing in an object, containing a firstName and a lastName property, as the parameter.
	 * @param call A string starting with 'architectsdk://'.
	 */
	function executeActionCall(call) {
		var action = parseActionUrl(call);
		try {
			lib[action.funcName](action.parameters);
		} catch (e) {
			if (e instanceof TypeError) {
				throw new TypeError(action.funcName + 'is either undefined or not a function in the Ionicitude lib service.');
			} else {
				throw e;
			}
		}
	}

	/**
	 * TODO : vérifier le commentaire
	 * Parses an url starting with 'architectsdk://' and creates an action object.
	 * This object will have two properties : funcName and parameters containing, respectively,
	 * the name of the function that will be called by executeActionCall() and the parameters to this function, if provided.
	 *
	 * @param url
	 * @return {Object}
	 */
	function parseActionUrl(url) {
		if (url.substr(0, protocol.length) === protocol) {
			var action = {};
			var call = url.substr(protocol.length);
			var i = call.indexOf('?');
			if (i === -1) {
				action.funcName = call;
				action.parameters = null;
			} else {
				try {
					action.funcName = call.substr(0, i);
					var param_string = call.substr(i + 1);
					action.parameters = angular.fromJson(param_string);
				} catch (e) {
					if (e instanceof SyntaxError) {
						throw new SyntaxError('parseActionUrl() expects the substring following the \'?\' in the parameter string to be a valid JSON object. \'' + param_string + '\' given.');
					} else {
						throw e;
					}
				}
			}
			return action;
		} else {
			throw new SyntaxError('parseActionUrl() expects first parameter to be a string starting with \'' + protocol + '\'.');
		}
	}
}
})();