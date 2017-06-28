Launch an AR World with the Wikitude plugin, and returns a promise. This creates a new AR View and switches the app's focus to it.

# Argument
Name|Type|Description
----|----|-----------
world_ref|`STRING`|The name of the folder that contains the files for the AR World to launch. This folder must exist in a folder named `"wikitude-worlds"` in your app's `www` directory. If you want to change the name of this folder (or event it's path), you can by passing an argument to `Ionicitude.init()` (see [API Definition > `init()` ](#init)for details).

# Returns
- `PROMISE` - A promise of a launched AR World.

# Throws
- `UnsupportedFeatureError` when:
	1. Trying to launch an AR World that requires features not supported by the device (see [Checking Device's Features](#checking-devices-features))

# Usage
```javascript
Ionicitude.launchAR("my_world_folder_name")
  .then(function(success) {
    // React to a successfull AR World launching
  })
  .catch(function(error) {
    // React to a failed AR World launching
  });
```