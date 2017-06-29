# Ionicitude "Callback Handling Mechanism" (CHM)

Ionicitude comes with it's own Callback Handling Mechanism (CHM) to deal with `document.location` calls. It is enabled by default when calling `Ionicitude.init()`, but you can use your own if you like. You'd just have to pass an object with at least a `customCallback` property as an argument to the `Ionicitude.init()` function. The value of `customCallback` must be a function that takes one argument, the URL:

```javascript
Ionicitude.init({
  // Using your custom CHM over Ionicitude's one.
  customCallback: function(arViewUrl) {
    // Do whatever handling you want to do with every document.location call's URL received from an AR View
  }
});
```

**If you do use your personnal CHM, you can skip the rest of this section.**

# document.location URL format

To properly function, Ionicitude's CHM needs that every URL passed as a value to `document.location` in an AR World's JS follows a particular format.

1. The URL needs to start with `architectsdk://`, as this is a requirement from the Wikitude plugin _(you could store that somewhere in a variable to avoid rewriting it everytime)_.
2. The following characters must be the name of the Action that the AR View want the Ionic App to execute, or, in other words, the name of the function that will be called by the Ionic App.
3. If this function needs argument(s)...
    1. the name of the Action in point #2 must be followed by the `?` character.
    2. the remaining characters must form a valid JSON Object declaration. Each of this object property being one of the needed arguments.

## Valid URLs
All the following `document.location`'s URLs will be correctly interpreted and executed by the CHM:

* `"architectsdk://foo"` will call the `foo` Action with no argument
* `"architectsdk://foo?{"bar":"baz"}"` will call the `foo` Action with `{bar: "baz"}` as its argument
* `"architectsdk://foo?{"bar": 1, "baz": {"fooBar": 123}}"` will call the `foo` Action with `{bar: 1, baz: {fooBar: 123}}` as its argument

## Invalids URLs
All the following URLs will fail, throwing a `SyntaxError`:

* `foo` - URL does not start with `architectsdk://`
* `architectsdk://foo()` - the parenthesis must not be present
* `architectsdk://foo{"bar": "baz"}` - the `?` character is missing between the Action's name and the JSON Object argument
* `architectsdk://foo?bar` - the characters following the `?` must form a valid JSON Object.

# CHM Actions Mapping
Obviously, the Action name that you pass in the `document.location`'s URL must match an existing function, somewhere in your Ionic App.

By default, Ionicitude's CHM will try and execute this function from it's own Action library. But because Ionicitude is _(sadly)_ not omniscient, it can not already contain everything that your AR View could call. In fact, its kinda empty in the beginning.

## Registering Actions
You'll have to manually register an Action to Ionicitude's library before calling it from inside an AR View.

Do this by calling `Ionicitude.addAction()` and passing it either a **name** and an **anonymous** function as a callback, or just a **named** function. **Anything else will throw a TypeError.**

----------
_Please, see [API Doc > `addAction()`](addAction()) for details about this method._

----------

This is **OK**:

```javascript
// Give a string name and an anonymous function.
Ionicitude.addAction('foo', function() {
  // Some code describing what the 'foo' Action does.
});
```

```javascript
// Declare the function and then give it to the method.
function foo() {
  // Some code describing what the 'foo' Action does.
}

Ionicitude.addAction(foo);
```

```javascript
// Give a named function directly to the method.
Ionicitude.addAction(function foo() {
  // Some code describing what the 'foo' Action does.
});
```

This is **NOT OK**:
```javascript
// Don't pass only an anonymous function.
Ionicitude.addAction(function() {
  // Some code describing what the Action does.
});
```

**Be sure to register the Action BEFORE your AR View calls it.**

To register multiple Actions one after another, you can simply chain your calls to `Ionicitude.addAction()`:

```javascript
// As you can see, the method you chose to use doesn't matter
function foo() { /* Some code */ }

Ionicitude
  .addAction(foo)
  .addAction('bar', function() { ... })
  .addAction(function baz() { ... });

// Ionicitude's Action library now contains three Actions
// — 'foo', 'bar' and 'baz' —
// that can be called with a 'document.location' statement.
```

## Action's arguments
When called by a `document.location` statement, a registered Action's callback will receive two arguments:

* `service`: The Ionicitude service, if you need to call any method from its API
* `param`: An object containing, as its properties, your callback's arguments, when provided by the `document.location` statement (see [`document.location` URL format](#documentlocation-url-format))

# Full example

To wrap up all this Action business, here is a example.

Let's say that your `document.location` statement looks like this:
```javascript
// In your AR View's JS
document.location = 'architectsdk://foo?{"bar":"Some argument value", "baz": 125.252}'
```

Then, your `param` argument's value could roughly translate to...
```
// You don't have to write this anywhere, it's just a clearer way to look at the data
{
  "bar": "Some argument value",
  "baz": 125.252
}
```
... and your `foo` Action should be registered like this...
```javascript
// Somwhere in your Ionic App's JS, but after calling Ionicitude.init()
Ionicitude.addAction(function foo(service, param) {
  // You can access your param properties
  console.log(param.bar); // Will print : "Some argument value", in the console of the Ionic WebView
  console.log(param.baz); // Will print : 125.252, in the console of the Ionic WebView
	
  // You can also access the Ionicitude service API
  service.close(); // Or any other API's function
});
```

**If your Action only uses the `param` argument and not the `service` one, its callback still must be declared as accepting the two arguments in the right order:**

```javascript
function foo(service, param) { ... }
```

**But if your Action needs only to use the `service` argument, its callback can be declared as accepting only this one:**

```javascript
function foo(service) { ... }
```