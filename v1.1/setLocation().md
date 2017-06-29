# setLocation()

_This is a just a wrapper around the Wikitude plugin's `setLocation` function. See [Official Doc](http://www.wikitude.com/external/doc/documentation/latest/phonegap/referencephonegap.html#setlocation) for more information._

Use this function to inject a user's location into the currently active AR View.

_It's not clear in the Wikitude documentation wether this method should be used for testing purpose (since they use the world "simulated" in the arguments description) or for production purpose. Anyway... since Wikitude automatically tracks the device location on a geolocalization-based AR World, you shouldn't need to call this method._

**Note that after manually sending a location to the AR View, it will stop sending you GPS updates.**

## Arguments

Name|Type|Description
----|----|-----------
latitude|`NUMBER`|The latitude (in decimal degree) of the location to inject.
longitude|`NUMBER`|The longitude (in decimal degree) of the location to inject.
altitude|`NUMBER`|The altitude (in meters) of the location to inject.
accuracy|`NUMBER`|The accuracy (in meters) of the location's data.

## Usage

```javascript
Ionicitude.setLocation(31.2543139, -24.258480555555554, -10000, 20000):
```