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
