Adds an Action to the Ionicitude Action Library that can then be triggered by an AR View, with a `document.location` statement. You can add an action by either passing a **name** and an **anonymous** callback, or just a **named** callback.

When called, the callback will be passed to arguments: `service`, the Ionicitude Service for you to call any of its method, and `param`, the object passed in the `document.location` URL. Declare your callback argument depending on its needs.

The Ionicitude Service is returned so that you can chain calls to `addAction()`.

# Arguments

Name|Type|Description
----|----|-----------
nameOrFunction|`STRING`/`FUNCTION`|If `STRING`, the name of the Action to add. If named `FUNCTION`, the Action to add under the same name.
callback|`FUNCTION`|_[Optionnal]_ If `nameOrFunction` is of type `STRING`, an anonymous function to add as the Action.

# Returns
- `OBJECT` - The Ionicitude Service

# Throws
- `TypeError` when
	1. `nameOrFunction` is neither a `STRING` nor a `FUNCTION`
	2. `nameOrFunction` is a `STRING` and `callback` is not present or `null`
	3. `nameOrFunction` is a `STRING` and `callback` is not a `FUNCTION`
	4. `nameOrFunction` is an anonymous `FUNCTION`
- `SyntaxError` when
	1. The name of the Action to add has already been used for a previsouly registered Action

# Usage
```javascript
Ionicitude
  .addAction('foo', function(service) {
    // This Action is named 'foo' and can access the Ionicitude Service API	
  }
  .addAction('bar', function(service, param) {
    // This Action is named 'bar' and can access both
    // the Ionicitude Service API (even if it doesn't need to)
    // and as any 'param' it needs
  }
  .addAction('baz', function() {
    // This Action is named 'baz' and doesn't need neither the Ionicitude Service nor any 'param'.
  };
```