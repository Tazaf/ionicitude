/**
 * Defines the main service of Ionicitude.
 * This is the service that you will inject into your controllers in order to use the Wikitude cordova plugin functions and the service functions.
 */
angular
	.module('ionicitude-module')
	.factory('Ionicitude', Ionicitude);

/* @ngInject */
function Ionicitude($q, $log) {
	/**
	 * Defines the service object that will be publicly accessible when injecting the Ionicitude service.
	 * @type {Object}
	 */
	var service = {
		// Properties
		deviceSupportsFeatures: false,
		// Methods
		checkDevice: checkDeviceFn,
		requestAccess: requestAccessFn,
		getSDKBuildInformation: getSDKBuildInformationFn,
		getSDKVersion: getSDKVersionFn,
		init: initFn,
		launchAR: launchArFn,
		addAction: addActionFn,
		listLibActions: listLibActionsFn,
		captureScreen: captureScreenFn,
		ready: readyFn,
		// Wikitude Core API wrapper. Will be set by init()
		close: null,
		hide: null,
		show: null,
		callJavaScript: null,
		setLocation: null,
		setErrorHandler: null,
		setDeviceSensorsNeedCalibrationHandler: null,
		setDeviceSensorsFinishedCalibrationHandler: null,
		setBackButtonCallback: null,
		openAppSettings: null
	};

	/**
	 * This is a simple flag to prevent calling the init() public method twice.
	 * @type {boolean}
	 */
	var initialized = false;

	/**
	 * Defines the value of the url protocol used by Wikitude to call the app from within the AR View.
	 * This value MUST NOT be altered in any way since it's an internal Wikitude mechanism.
	 * @type {String}
	 */
	var protocol = 'architectsdk://';

	/**
	 * This will store the WikitudePlugin for subsequent uses, after a call to getPlugin().
	 */
	var plugin;

	/**
	 * This is where all the custom Actions that can be called from within an AR View will be stored at runtime, using the addAction() method.
	 * @type {Object}
	 */
	var lib = {};

	/**
	 * This is where any request made with the ready() function while Ionicitude is not fully initialized will be stored, waiting to be executed.
	 * @type {Array}
	 */
	var requestsQueue = [];

	/**
	 * Defines the default settings of the Wikitude service.
	 * Each of these settings can be defined when calling the init() method.
	 * @type {Object}
	 */
	var settings = {
		/**
		 * Additionnals world load config.
		 * For now, there's only one such setting available for the Wikitude plugin : camera_position.
		 */
		worldLoadConfig: { camera_position: 'back' },
		/**
		 * Defines which features your AR app needs the device to support.
		 * For now, only two features are available in the cordova WikitudePlugin.
		 * The first one is 'geo' and is used for any ARchitect World that wants to rely on the user's location.
		 * The second is '2d_tracking' and is used for any ARchitect World that wants to use image recognition and image tracking.
		 * More information : http://www.wikitude.com/developer/documentation/phonegap.
		 * @type {Array}
		 */
		reqFeatures: ['geo', '2d_tracking'],
		/**
		 * Defines where in your app are stored all your ARchitect World folders.
		 * This folder should contain sub-folders, one for each of your AR World.
		 * @type {String}
		 */
		worldsRootFolder: 'wikitude-worlds'
	};

	return service;

	//////////////////// PUBLIC SERVICE METHODS ////////////////////

	/**
	 * Gets the current SDK build information, as an object.
	 * This is an asynchronous function that returns a promise, containing the current SDK build information.
	 * Note that the promise will never be rejected.
	 * @return {Promise} A Promise of an object.
	 */
	function getSDKBuildInformationFn() {
		return $q(function (resolve) {
			plugin.getSDKBuildInformation(function success(data) {
				resolve(data);
			});
		});
	}

	/**
	 * Gets the Wikitude SDK current version.
	 * This is an asynchronous function that returns a promise, containing the current SDK Version.
	 * Note that the promise will never be rejected.
	 * @return {Promise} A Promise of an SDK Version.
	 */
	function getSDKVersionFn() {
		return $q(function (resolve) {
			plugin.getSDKVersion(function success(data) {
				resolve(data);
			});
		});
	}

	/**
	 * This function can be used at anytime to ask the user for access permission.
	 * The requested permissions depends upon the value of settings.reqFeatures.
	 * The app will always ask for camera access (since it can't function at all without it).
	 * The geolocation permission will be asked only if the settings.reqFeatures array contains the 'geo' string.
	 * When the user accept all the request, the returned Promise's value will be an "OK" string.
	 * If the user denied any request, or all of them, the returned Promise's value will be an object with a 'developerDescription'
	 * and 'userDescription' properties, detailling in a String which permissions have been rejected. 
	 * @return {Promise} A Promise of granted accesses or denied accesses.
	 */
	function requestAccessFn() {
		$log.info('requesting access for', settings.reqFeatures);
		return $q(function (resolve, reject) {
			plugin.requestAccess(function success(data) {
				$log.debug('requestAccess - success', data);
				resolve(data);
			}, function error(data) {
				$log.error('requestAccess - error', data);
				reject(data);
			}, settings.reqFeatures);
		});
	}

	/**
	 * Should be used when wanting to call any sensitive Ionicitude's method - like launchAR() - while not being sure if the plugin will be fully initialized
	 * by the time its method is called.
	 * Since Ionicitude.init() is asynchronous when performing the device check, your AR World could be launch before the initialization process is fully resolved,
	 * causing an UnsupportedFeatureError to be falsly raised.
	 * The parameter must be a function that should encapsulate the code you want to execute. Much like $ionicPlatform.ready() function.
	 * @param {Function} request An anonymous function encapsulating the code to execute when Ionicitude's plugin is completely initialized.
	 */
	function readyFn(request) {
		if (initialized && angular.isFunction(request)) request();
		else requestsQueue.push(request);
	}

	/**
	 * Debug method that returns a list of the current Actions that you added using the addAction() method.
	 */
	function listLibActionsFn() {
		$log.debug(Object.getOwnPropertyNames(lib));
		return Object.getOwnPropertyNames(lib);
	}

	/**
	 * Allows the user to take a screenshot with the app, while being in an AR view.
	 * This is just a wrapper aroune the Wikitude Plugin method, that uses promises instead of callback.
	 * See Wikitude documentation for more information: http://www.wikitude.com/external/doc/documentation/latest/phonegap/referencephonegap.html#capturescreen.
	 * @param withUI A boolean indicating whether the screenshot should take the UI into account
	 * @param fileName If given, the screenshot will be saved in the device storage. If not, the screenshot will be saved in the device picture galery
	 * @returns {Promise} A promise of a screen captured.
	 */
	function captureScreenFn(withUI, fileName) {
		if (typeof withUI !== 'boolean') throw new TypeError('Ionicitude - captureScreen() expects first parameter to be of type \'boolean\', \'' + typeof withUI + '\' given.');
		if (fileName !== null && typeof fileName !== 'string') throw new TypeError('Ionicitude - captureScreen() expects second parameter to be \'null\' or of type \'string\', \'' + typeof fileName + '\' given.');
		var q = $q.defer();
		plugin.captureScreen(function (success) {
			q.resolve(success);
		}, function (error) {
			q.reject(error);
		}, withUI, fileName);
		return q.promise;
	}

	/**
	 * Adds an Action to the Ionicitude Action Library that can then be triggered by an AR View, with a 'document.location' statement.
	 * You can add an action by either passing a name and an anonymous callback, or just a named callback.
	 * The Ionicitude Service is returned so that you can chain calls to addAction().
	 * @param {string|function} nameOrFunction The name of the function to add if it's a string, or the function to add if it's a named function.
	 * @param {null|function}callback The function to add, if the first argument is a String.
	 * @return {Object} The Ionicitude service
	 * @throws TypeError
	 * @throws SyntaxError
	 */
	function addActionFn(nameOrFunction, callback) {
		if (angular.isString(nameOrFunction)) {
			if (!callback) throw new TypeError('Ionicitude - addAction() expects a second argument if first argument is of type \'string\'.');
			if (typeof callback !== 'function') throw new TypeError('Ionicitude - addAction() expects second argument to only be of type \'function\', \'' + typeof callback + '\' given.');
			checkUsedName(nameOrFunction);
			lib[nameOrFunction] = callback;
		} else if (angular.isFunction(nameOrFunction)) {
			var name = nameOrFunction.name;
			if (!name) throw new TypeError('Ionicitude - addAction() do not accept anonymous function as first argument. Please, try passing a named function instead.');
			checkUsedName(name);
			lib[name] = nameOrFunction;
		} else {
			throw new TypeError('Ionicitude - addAction() expects first argument to be only of type \'string\' or \'function\', \'' + typeof nameOrFunction + '\' given');
		}
		return service;

		/**
		 * Checks if the desired name for this new Action has already been registered or is already used in Ionicitude library.
		 * @param name
		 */
		function checkUsedName(name) {
			if (lib.hasOwnProperty(name)) throw new SyntaxError('Ionicitude - addAction() - The name \'' + name + '\' has already been added or is a reserved Ionicitude name.');
		}
	}

	/**
	 * Checks if the device supports the features needed by the AR World.
	 * The result of this check is available through the deviceSupportsFeatures property of the Ionicitude service
	 * for it to be used later (alerting the user that he's/she's device is not compatible, for instance).
	 * @return {Promise} A promise of a check result.
	 */
	function checkDeviceFn() {
		$log.info('checking device');
		var q = $q.defer();
		plugin.isDeviceSupported(function (success) {
			$log.log(success);
			service.deviceSupportsFeatures = true;
			q.resolve(success);
		}, function (error) {
			$log.error(error);
			service.deviceSupportsFeatures = false;
			q.reject(error);
		}, settings.reqFeatures);
		return q.promise;
	}

	/**
	 * Initializes the Ionicitude service, then returns a promise. If resolved, this promise returns the service.
	 * You can pass an object argument to this method to change it's default behavior or change some of Ionicitude's default settings.
	 * This object can have the following properties :
	 * - customCallback: A function that you want to set as your app's Custom Handling Mechanism (CHM). If not provided, the Ionicitude's CHM will be used.
	 * - doDeviceCheck: Default TRUE. Pass FALSE to skip the checkDevice() method call. If you do, you'll need to manually call the method later on.
	 * - reqFeatures: An array of strings indicating which features are required by your app. Can be 'geo', '2d_tracking' or both.
	 * - worldLoadConfig: An object of additionnals world load settings.
	 * - worldsRootFolder: A string that references your app's folder in which your AR Worlds' folders are stored.
	 * @param params An object to alter the init behavior or change default settings.
	 * @returns {Promise} A promise of the initialization.
	 */
	function initFn(params) {
		return $q(function (resolve, reject) {
			if (!initialized) {
				$log.info('init service starting');
				loadPlugin()
					.then(setWrappers)
					.then(setCallback)
					.then(function () {
						if (doDeviceCheck()) {
							return checkDeviceFn();
						} else {
							return $log.info('check skipped due to init settings');
						}
					})
					.then(handleSettings)
					.then(function () {
						initialized = true;
					})
					.then(handleQueue)
					.then(function () {
						$log.info('end of initialization');
						resolve(service);
					})
					.catch(function (error) {
						reject(error)
					});
			} else {
				reject('Ionicitude has already been initialized !')
			}
		});

		/**
		 * Sets the callback for any document.location request from the AR.
		 * If you provide a value for the customCallback param, it will be set here.
		 */
		function setCallback() {
			var callback = executeActionCall;
			if (customCallback()) callback = params.customCallback;
			plugin.setOnUrlInvokeCallback(callback);
		}

		/**
		 * Sets any of the parameter to the value that you provided in the param object, if any.
		 */
		function handleSettings() {
			if (reqFeatures()) settings.reqFeatures = params.reqFeatures;
			if (worldLoadConfig()) settings.worldLoadConfig = params.worldLoadConfig;
			if (worldsRootFolder()) settings.worldsRootFolder = params.worldsRootFolder;
		}

		/**
		 * Checks if you defined a custom onUrlInvokeCallback in the init function's 'params' argument.
		 * @returns {boolean}
		 */
		function customCallback() {
			return params && params.hasOwnProperty('customCallback') && angular.isFunction(params.customCallback);
		}

		/**
		 * Checks if you defined in the init function's 'params' argument that the device checking should be done.
		 * @returns {boolean}
		 */
		function doDeviceCheck() {
			return !(params && params.hasOwnProperty('doDeviceCheck') && params.doDeviceCheck === false);
		}

		/**
		 * Checks if you defined custom required features in the 'params' argument to check the device against.
		 * @returns {boolean}
		 */
		function reqFeatures() {
			return params && params.hasOwnProperty('reqFeatures') && angular.isArray(params.reqFeatures);
		}

		/**
		 * Checks if you defined custom world load configuration in the 'params' argument
		 * @returns {boolean}
		 */
		function worldLoadConfig() {
			return params && params.hasOwnProperty('worldLoadConfig') && angular.isObject(params.worldLoadConfig);
		}

		/**
		 * Checks if you defined a custom worlds directory name in the 'params' argument
		 * @returns {boolean}
		 */
		function worldsRootFolder() {
			return params && params.hasOwnProperty('worldsRootFolder') && angular.isString(params.worldsRootFolder);
		}
	}

	/**
	 * Tries to launch the requested AR World, based on the given 'world_ref' and returns a promise of a launch.
	 * If you try to launch an AR World that requests features not supported by the device, an UnsupportedFeatureError will be thrown.
	 * @param world_ref The name of an existing folder inside worldsRootFolder, from which to launch an AR World.
	 * @return {Function} A promise of a launch.
	 * @throws UnsupportedFeatureError If the device does not support any feature requested by the AR World
	 */
	function launchArFn(world_ref) {
		if (!world_ref) world_ref = 'main';
		if (service.deviceSupportsFeatures) {
			var q = $q.defer();
			$log.info('launch');
			plugin.loadARchitectWorld(function (success) {
				q.resolve(success);
			}, function (error) {
				q.reject(error);
			}, getWorldUrl(world_ref), settings.reqFeatures, settings.worldLoadConfig);
			return q.promise;
		} else {
			throw new UnsupportedFeatureError();
		}
	}

	//////////////////// PRIVATE SERVICE METHODS ////////////////////

	/**
	 * Executes any request in the requestQueue, in the order they were stored, then reset the requestQueue
	 */
	function handleQueue() {
		requestsQueue.forEach(function (request) {
			angular.isFunction(request) && request();
		});
		requestsQueue = [];
	}

	/**
	 * Returns the correct path to the HTML file that should be loaded by the launching AR World, based on the given 'world_ref'.
	 * @param world_ref
	 */
	function getWorldUrl(world_ref) {
		return 'www/' + settings.worldsRootFolder + '/' + world_ref + '/index.html';
	}

	/**
	 * Should be set, with the setOnUrlInvokeCallback method, as the callback function for the 'architectsdk://' call done by the Wikitude AR View.
	 * The string passed as the 'call' argument must be formatted as follow :
	 * 'architectsdk://name_of_the_function_to_execute[?json_object_containging_the_function_arguments]'
	 * Example :
	 * 'architectsdk://saveClient?{"firstName":"Foo","lastName":"Bar"}'
	 * This call will execute the saveClient function, passing in an object, containing a firstName and a lastName property, as the second argument.
	 * The desired function will receive the Wikitude plugin as its first argument. This way, you can call any of the Wikitude plugin API functions (close() for example) from within your custom function.
	 * @param call A string starting with 'architectsdk://' indicating what function the AR View wants to call and, if needed, what argument the function should receive.
	 */
	function executeActionCall(call) {
		var action = parseActionUrl(call);
		$log.debug(call, action);
		if (!lib.hasOwnProperty(action.funcName) || typeof lib[action.funcName] !== 'function') throw new TypeError('\'' + action.funcName + '\' is either undefined or not a function in the Ionicitude service.');
		lib[action.funcName](plugin, action.parameters);
	}

	/**
	 * Parses an url starting with 'architectsdk://' and creates an action object.
	 * This object will have two properties : funcName and parameters containing, respectively,
	 * the name of the function that will be called by executeActionCall() and the parameters to this function, if provided.
	 * @param url
	 * @return {Object}
	 */
	function parseActionUrl(url) {
		url = decodeURI(url);
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

	/**
	 * Loads the Wikitude plugin in the private 'plugin' variable.
	 */
	function loadPlugin() {
		return $q(function (resolve, reject) {
			if (!plugin) {
				plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
				resolve('Plugin is loaded.');
			} else
				reject('Plugin already loaded !');
		})
	}

	/**
	 * Sets Ionicitude's wrapper methods with the one from the Wikitude Plugin.
	 */
	function setWrappers() {
		service.close = plugin.close;
		service.hide = plugin.hide;
		service.show = plugin.show;
		service.callJavaScript = plugin.callJavaScript;
		service.setLocation = plugin.setLocation;
		service.setErrorHandler = plugin.setErrorHandler;
		service.setDeviceSensorsNeedCalibrationHandler = plugin.setDeviceSensorsNeedCalibrationHandler;
		service.setDeviceSensorsFinishedCalibrationHandler = plugin.setDeviceSensorsFinishedCalibrationHandler;
		service.setBackButtonCallback = plugin.setBackButtonCallback;
		service.openAppSettings = plugin.openAppSettings;
	}
}
