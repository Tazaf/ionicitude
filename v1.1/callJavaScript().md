# callJavaScript()

_This is a just a wrapper around the Wikitude plugin's `callJavaScript` function. See [Official Doc](http://www.wikitude.com/external/doc/documentation/latest/phonegap/referencephonegap.html#calljavascript) for more information._

Allows you to executre a JavaScript statement from the Ionic App into the context of the currently active AR View.

## Arguments

Name|Type|Description
----|----|-----------
js|`STRING`|A litteral javascript statement to execute in the context of the currently active AR View.

## Usage
```javascript
// Will prompt an alert in the AR View
Ionicitude.callJavaScript('alert("Hello")');
```