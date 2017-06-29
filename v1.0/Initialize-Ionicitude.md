# Initialize Ionicitude

Before it can be used, the Ionicitude service needs to be initialized. This means loading the Wikitude plugin and setting up some default Ionicitude behavior. You can do this by calling this method:

```javascript
Ionicitude.init();
```

----------
_Please, see [API Definition > `init()`](https://github.com/Tazaf/ionicitude/wiki/API-Definition#init) for the complete details about this method, or continue reading to see some of them in their context._

----------

:information_source: **This method should be executed before using the module, and only when the device and cordova are ready.**

I suggest that you call this function in the `app.run()` block that every Ionic app normally has, specificaly in the `$ionicPlatform.ready()` block.

```javascript
// Should be in the app.js under a slightly different aspect.
angular
.module('app')
.run(run);

function run($ionicPlatform, Ionicitude) {
  $ionicPlatform.ready(function () {
    // Some Ionic code about StatusBar and stuff...
    
    Ionicitude.init();
  });
}
```
`Ionicitude.init()` is a promise that returns the Ionicitude service as the resolved value. If anything goes wrong while initializing, the error is passed as the rejected value.