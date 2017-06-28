_This is a wrapper around the Wikitude plugin's captureScreen function but it implements promises instead of callbacks. See [Official Doc](http://www.wikitude.com/external/doc/documentation/latest/phonegap/referencephonegap.html#capturescreen) for more information._

Allows you to take a screenshot of the currently active AR View.
## Arguments
Name|Type|Description
----|----|-----------
withUI|`BOOLEAN`|Indicates wether or not the AR View UI should be part of the screenshot.
fileNameOrPath|`STRING`/`NULL`|If it's a file name or a file path, the screenshot will be saved in the application bundle. If `NULL`, the screenshot will be saved in the device photo gallery.

## Returns
- `PROMISE` - A promise of a screenshot.

## Usage
```javascript
Ionicitude.captureScreen(true) // Screenshot will contain AR View UI and will be saved in the photo gallery.
  .then(function(success) {
    // React to a successfully captured screen
  }
  .catch(function(error) {
    // React to a failed captured screen
  };
```