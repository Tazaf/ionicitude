# checkDevice()

_This method is called by the Ionicitude.init() method. You can force-skip this call by passing and argument to `Ionicitude.init()` (see [API Definition > `init()`](#init) for details). You should then manually call this method before launching an AR World._

Checks if the device supports the features needed by your app.
The result of the check will be available through the `Ionicitude.deviceSupportsFeatures` property.

By default, the needed features against which the device is check are `geo` and `2d_tracking`. You can change that by passing an argument to `Ionicitude.init()` (see [API Definition > `init()`](#init) for information).

## Returns
- `PROMISE` - A promise of a check result.

## Usage
```javascript
Ionicitude.checkDevice()
  .then(function(success) {
    // React to a device supporting all the requested features
  }
  .catch(function(error) {
    // React to a device not supporting at least one of the requested features
  };
```