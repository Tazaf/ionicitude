# Checking device's features

We already saw that an AR World can be geo-based or image-recognition-based, or both. The device that wants to launch such AR World must support whatever features it requires, and the Wikitude plugin must know wether or not the device supports said features.

This can be done with this method:

```javascript
Ionicitude.checkDevice();
```

----------
_Please, see [API Doc > `checkDevice()`](checkDevice()) for the complete details about this method, or continue reading to see some of them in their context._

----------

**_Note: By default, `checkDevice()` is called by `Ionicitude.init()`. If you want `init()` to skip this checking part, you can pass an object as the method's argument, with at least the property `doDeviceCheck` set to `false`_**

```javascript
Ionicitude.init({
  doDeviceCheck: false // This will tell init() to skip the call to checkDevice()
  // Any other init param
});
```

**_Be advised that if you do skip the call to `checkDevice()` in the init part, you will have to call the method yourself at one point. Preferably before you try to launch any AR World :wink:_**

As for now, there's only two features that an AR World can require:

* `'geo'` - This feature is needed by an AR World when it wants to use the user's location and manipulates geodata in a general way.
* `'image_tracking` - This feature is needed by an AR World when it wants to use image recognition and/or image tracking.

By default, `checkDevice()` checks if the device supports both of these features, but if your app will ever use only one of them, you can tell that to Ionicitude when initializing the service by passing an object argument to `Ionicitude.init()` with at least a `reqFeatures` array property:

```javascript
// Your app only needs geolocation features ? Do...
Ionicitude.init({
  reqFeatures: ['geo']
});

// Your app only need image tracking and/or recognition ? Do...
Ionicitude.init({
  reqFeatures: ['image_tracking']
});
```
_Note that your device will always be checked for the 'image_tracking' feature. Since Wikitude is an augmented relatity plugin, it must be able to use your camera_

:grey_exclamation: **Any string in `reqFeatures` that doesn't reference a valid Wikitude feature will not cause the check to fail. It will just be ignored.**

The result of the check will be stored and available through the `Ionicitude.deviceSupportsFeatures` property, as a Boolean.

`checkDevice()` returns you a promise, for you to react to any of the outcome:

```javascript
Ionicitude.checkDevice()
  .then(function(success) {
    // What do you want to do if the device supports eveything?
  })
  .catch(function(error) {
    // What do you want to do if the device doesn't support at least one of the feature?
  });
```