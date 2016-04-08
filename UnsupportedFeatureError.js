/**
 * Created by Mathias on 05.04.2016.
 */
'use strict';

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
    this.message = "Wikitude service : launchAR() : This ARchitect World can not be loaded as your device does not support one or several of it's requested features."
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
