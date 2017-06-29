# Execute code only when ready

Please note that `Ionicitude.init()` has some asynchronous behavior (especially while checking the device). This means that some of your code using Ionicitude could be executed before the initialization process is finished, resulting in potential error (see [issue #3](https://github.com/Tazaf/ionicitude/issues/3)).

To ensure that the code using the module is executed only when Ionicitude has done initializing, you can use this method:

```javascript
Ionicitude.ready();
```

----------
_Please, see [API Doc > `ready()`](ready()) for the complete details about this method._

----------

The syntax is exactly like the `$ionicPlatform.ready()` function, provided by Ionic. You encapsulate the code you want to execute inside an anonymous function, passed as the argument to the `Ionicitude.ready()` method. Say you want to launch an AR World (see [API Doc > `launchAR()`](launchAR()) for details), you would write something like this:

```javascript
// This could be in a controller for example.
Ionicitude.ready(function () {
  Ionicitude
    .launchAR('myAR')
    .then(function (success) {
      // ...
    }
    .catch(function (error) }
      // ...
    }
});
```
This will ensure that the launch is done **only** when Ionicitude's initialization is fully completed.

**Some Ionicitude's method can be safely called even if the module is not initialized, so using the `ready()` method is not mandatory for every use case. Nonetheless, it's a good practice to always encapsulate any call the module inside this method, to be extra sure.**