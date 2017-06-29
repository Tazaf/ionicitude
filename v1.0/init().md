# init()

**Must be called prior to any other Ionicitude's API call.**

Initializes the Ionicitude Service, then returns it for you to chain methods calls, if necessary.

This initialization first loads up the Wikitude plugin, then sets up the Ionicitude's CHM (see [Ionicitude Callback Handling Mechanism](#ionicitude-callback-handling-mechanism-chm) for more information) and, finally, calls Ionicitude.checkDevice() (see [API Definition > `checkDevice()`](#checkdevice) for more information).

**Note that this method is designed to be called one time, and one time only. If you call it a second time, ~~you'll break the space-time continuum~~ nothing will happen.**

## Arguments
You can change the method's default behavior or modify some of the service's settings by passing an **object** as the method's argument. This object can have the following properties, that are all optionnal:

Name|Type|Description
----|----|-----------
customCallback|`FUNCTION`|Default to [Ionicitude CHM](#ionicitude-callback-handling-mechanism-chm). A function that will be used to handle and react to any `document.location` call executed from an AR View's JS code. This function must take one argument, which will be the value of the `document.location` statement.
doDeviceCheck|`BOOLEAN`|Default `TRUE`. Pass `FALSE` to skip the `checkDevice()` method call. If you do, you'll need to manually call the method later on.
reqFeatures|`ARRAY`|Default `['geo', '2d_tracking']`. An array of strings indicating which features are required by your app. Can be `'geo'`, `'2d_tracking'` or both. Anything else will be ignored.
worldLoadConfig|`OBJECT`|Default `{camera_position: 'back'}`. An object of additionnal settings for the AR Views. For now only one setting is available, `camera_position`, that can be either `front` (to use the device front camera) or `back` (to use the device back camera).
worldsRootFolder|`STRING`|Default `"wikitude-worlds"`. A string that references a folder's name in your app in which your AR Worlds' folders are stored (see [Expected File Organization](#expected-file-organization) for more information).

## Returns
- `OBJECT` - The Ionicitude Service.

## Usage
```javascript
// Full default usage
Ionicitude.init();

// With custom behavior and/or settings
Ionicitude.init({
  customCallback: function(URL) { /* Handle the URL yourself */ },
  doDeviceCheck: false, // Will skip the call to checkDevice()
  reqFEatures: ["geo"], // checkDevice() will only check the geolocalization feature
  worldLoadConfig: {camera_position: 'front'}, // The front camera will be used by the AR Views.
  worldsRootFolder: "my_custom_world_folder"
});
```