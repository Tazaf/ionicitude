# ready()

Encapsulate your code that is using the Ionicitude service in this method. That will ensure that this code is executed only when or if the module has finished initializing.

## Argument

Name|Type|Description
----|----|-----------
code|`FUNCTION`|An anonymous function that contains the code to execute only when Ionicitude is fully initialized.

## Usage

```javascript
Ionicitude.ready(function () {
  Ionicitude.launchAR("myAR")
    .then(function(success) {
      // ...
    })
    .catch(function(error) {
      // ...
    });
});
```