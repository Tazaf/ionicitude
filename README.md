![Ionicitude logo](docs/logo_min.png)

# Ionicitude

AngularJS module for using the Wikitude cordova plugin in an Ionic project.

# Table of content

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
  - [What is the cordova Wikitude plugin?](#what-is-the-cordova-wikitude-plugin)
    - [Important note](#important-note)
- [Installing the Cordova Wikitude plugin](#installing-the-cordova-wikitude-plugin)
  - [Wikitude Licence Key](#wikitude-licence-key)
  - [Android platform version ^5.0.0](#android-platform-version-%5E500)
    - ["I didn't add my platforms yet..."](#i-didnt-add-my-platforms-yet)
    - ["Damn, I already added my platforms!"](#damn-i-already-added-my-platforms)
    - ["How can I know it worked?"](#how-can-i-know-it-worked)
  - [Known bugs](#known-bugs)
- [Installing Ionicitude](#installing-ionicitude)
  - [With `ionic add`](#with-ionic-add)
  - [Manually](#manually)
  - [Registering the dependency](#registering-the-dependency)
- [Initialization](#initialization)
- [Checking Device's Features](#checking-devices-features)
- [Launching an AR World](#launching-an-ar-world)
  - [What's an AR World](#whats-an-ar-world)
  - [Expected file organization](#expected-file-organization)
  - [Actually launching an AR World](#actually-launching-an-ar-world)
- [Interaction between the Ionic app and the AR View](#interaction-between-the-ionic-app-and-the-ar-view)
  - [Boring (but important) explanations ahead!](#boring-but-important-explanations-ahead)
    - [From: AR View, To: Ionic App](#from-ar-view-to-ionic-app)
    - [From: Ionic App, To: AR View](#from-ionic-app-to-ar-view)
  - [Ionicitude Callback Handling Mechanism (CHM)](#ionicitude-callback-handling-mechanism-chm)
    - [AR View URL format](#ar-view-url-format)
      - [Valids AR View's URL](#valids-ar-views-url)
      - [Invalids AR View's URL](#invalids-ar-views-url)
    - [Use custom CHM](#use-custom-chm)
  - [CHM Function Mapping](#chm-function-mapping)
    - [Registering functions](#registering-functions)
    - [Using custom function library](#using-custom-function-library)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Introduction
This bower package is designed for Ionic developers that wants to use the [cordova Wikitude plugin](http://www.wikitude.com/products/extensions/cordova-plugin-augmented-reality/) to add Augmented Reality (AR) in their app. It provides an Angular Service, named **Ionicitude**, with a simple API to interact with the cordova plugin, wether it be setting it, launching it or handling the AR Views' requests (more about that later).

## What is the cordova Wikitude plugin?
It's a plugin that allows users to experience Augmented Realtity on their device through an hybrid Cordova (or Ionic in our case) app. This AR experience can rely on user's location (think [Ingress](https://www.ingress.com/)) or on images recognition and tracking, or both. The possibilities are quite impressives and I encourage you to take a look at [the official Demo app](http://www.wikitude.com/try/)) to grasp the extent of what can be accomplish with the plugin.
An AR Experience is, in the end, nothing more than a bunch of HTML/CSS/JS files. This set of files is called **ARchitect World** by the Wikitude staff.

_Since it's quite a pain to type, I'll call them **AR World** throughout the rest of this README._

### Important note
:warning: **The cordova Wikitude plugin relies heavily on the device's hardware and software (camera, accelerometer, compass, etc). Thus, _you won't be able to test it anywhere except on a real device_. Testing in a browser or an emulator will both fail.**

# Installing the Cordova Wikitude plugin
**This package DOES NOT come along with the cordova Wikitude plugin!**

Since Ionicitude is a service that uses the cordova Wikitude plugin, you'll need to first install the plugin on your project. Do it with the following command (that can take a while: it's a heavy plugin):

`ionic plugin add https://github.com/Wikitude/wikitude-cordova-plugin.git`
## Wikitude Licence Key
To use the Wikitude plugin, you have to have a valid **licence key**. You can obtain one by registering on [the Wikitude site](http://www.wikitude.com/developer/documentation/phonegap) (top-right of the screen), logging in, and accessing the [licence key management page](http://www.wikitude.com/developer/licenses). Here, you can download a free trial licence key for the Wikitude SDK.

_Note that the free trial let's you use all the plugin functionnality (geo and 2dtracking) without any time limit, but put a splash screen before every AR World launch and a big "Trial" watermark all over your screen. This is apparently not the case with a paid licence key._

The downloaded file is juste a plain text file containing your licence key.

Copy it, go to the `WikitudePlugin.js` file (located in your app structure at `plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js`) and paste it as the value to `this._sdkKey` on line 11.

_Note : If you already installed any platform to your project, you'll need to install them again for the plugin modification to propagate (see next point for android platform)._

## Android platform version ^5.0.0
If you want your Ionic app to build correctly for android, with the cordova Wikitude plugin installed, it's absolutely imperative that you add the android platform with at least its `5.0.0` version. Otherwise your build will fail.

### "I didn't add my platforms yet..."

That's cool. But, when you do, don't forget to do it with:

`ionic platform add android@5.0.0`

### "Damn, I already added my platforms!"

Hey, no prob'. You can check your installed android platform version with...

`ionic platform`

...and if it's lower than `5.0.0`, you can update it:

`ionic platform update android@5.0.0`

### "How can I know it worked?"

When it's done, you can check that everything's OK by typing this commande (and crossing your fingers):

`ionic build android`

If you see a releaving `BUILD SUCCESSFULL` at the end of the process, congrats! Your app is building.

## Known Android bugs

Please, be advised that I've been confronted, when using the Wikitude plugin, with some awkwards bugs on Android regarding the back button handling from within an AR View, and the user location tracking lifecycle. If you encouter them or any other bugs related to the Wikitude plugin, please go on the [Github Wikitude repo](http://github.com/Wikitude/wikitude-cordova-plugin/issues) or on the [Wikitude Developer Forum](http://www.wikitude.com/developer/developer-forum) (you'll need to register).

**Having mostly developped with Ionic on Android, I don't know if these bugs also impact iOS builds. From the few tests that I've done, it's apparently not the case.**

# Installing Ionicitude
OK :ok_hand: ! Now that you have successfully installed the cordova Wikitude plugin (right?), it's time to use it with Ionicitude. To install it, you have two choices.

## 1a. With `ionic add`

From within your app's root directory, type:

`ionic add tazaf/ionicitude`

_Note : this is just syntactic sugar for `bower install`_

**The package will be installed in the `www/lib/ionicitude`.**

You will then need to add the following line in your app's `index.html`, after the calls to `ionic.bundle.js` and `cordova.js` :

```html
<script src="lib/ionicitude/dist/ionicitude.min.js"></script>
```

Or, if you want the humanly readable version :

```html
<script src="lib/ionicitude/dist/ionicitude.js"></script>
```

## 1b. Manually
You can also simply download this project on your computer and place it wherever you like in your project. Then, locate either the `ionicitude.js` file **or** the `ionicitude.min.js` file, both being in the `dist` folder of the package, and include it in your app's `index.html`, after the calls to `ionic.bundle.js` and `cordova.js` :

```html
<script src="path/to/the/file/ionicitude.min.js"></script>
```

_Note: you'll obviously need to replace `path/to/the/file` with the actual path to the file._

## 2. Registering the dependency
Whatever install method you choose, you'll finally have to register the module in your app's dependencies:

```javascript
// In app.js or wherever you created your app's module
angular.module('app', ['ionic', 'Ionicitude', 'other dependencies']);
```

# Initialization
Before it can be used, the Ionicitude service needs to be initialized. You can do this by calling this method:

```javascript
Ionicitude.init();
```

----------
*Please, see [API Definition > `init()`]() for the complete details about this method, or continue reading to see some of them in their context.*

----------


It needs to be called prior to ANY use of the module and only when the device and cordova are ready.

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
# Checking Device's Features

We already saw that an AR World can be geo-based or image-recognition-based, or both. The device that wants to launch them must support whatever features they require, and the Wikitude plugin must know wether or not the device supports them.
This can be done with this method:

```javascript
Ionicitude.checkDevice();
```

----------
*Please, see [API Definition > `checkDevice()`]() for the complete details about this method, or continue reading to see some of them in their context.*

----------

**_Note: By default, `checkDevice()` is called by `Ionicitude.init()`. If you want `init()` to skip this checking part, you can pass an object as the method's argument, with at least the property `doDeviceCheck` set to `false`_**

```javascript
Ionicitude.init({
  doDeviceCheck: false // This will tell init() to skip the call to checkDevice()
  // Any other init param
});
```

**_Be advised that if you do skip the call to `checkDevice()` in the init part, you will have to call the method yourself at one point. Preferably before you try to launch any AR World :wink:_**

As for now, there's an impressive amount of... two features that an AR World can require:

* `'geo'`: This feature is needed by an AR World when it wants to use the user's location and manipulates geodata in a general way.
* `'2d_tracking`: This feature is needed by an AR World when it wants to use image recognition and image tracking.

Initially, `checkDevice()` checks if the device supports both of these features, but if your app will ever use only one of them, you can tell that to Ionicitude when initializing the service by passing an object argument to `Ionicitude.init()` with at least a `reqFeatures` array property:

```javascript
// Your app only needs geolocation features
Ionicitude.init({
	reqFeatures: ['geo']
});

// Your app only need image tracking and recognition
Ionicitude.init({
	reqFeatures: ['2d_tracking']
});
```

**Any string in `reqFeatures` that doesn't references a valid Wikitude feature will not cause the check to fail. It will just be ignored.**

The result of the check will be stored and available through the `Ionicitude.deviceSupportsFeatures` property, as a Boolean.

`checkDevice()` returns you a promise, for you to react to any of the outcome:

```javascript
Ionicitude.checkDevice()
  .then(function(success) {
    // What do you want to do if the device supports eveything?
  })
  .catch(function(error) {
    // What do you want to do if the device doesn't support at least one of the feature?
  });
```


# Launching an AR World

## What's an AR World

The most simplistic AR World possible is just an HTML file (generally `index.html`), that loads up all the Wikitude logic. **See [this Gist](https://gist.github.com/Tazaf/5209e26e9a66e5eb526ed5ad34152586) for a blank minimal `index.html` file to use in your new AR Worlds.**

More advanced Worlds contains an HTML file, one or several JS files (with your custom code or third party libraries), maybe some CSS, image-tracking related files (specific to Wikitude, see [their documentation](http://www.wikitude.com/developer/documentation/phonegap) for more information) or whatever file is useful for this particular AR World..

## Expected file organization
In order to correctly launch your AR Worlds, Ionicitude expects three things:

1. You have a folder named `wikitude-worlds` in your app's `www` folder _(optionnal, see below)_
2. Each of your AR World is contained in a single folder inside `wikitude-worlds`
3. Each AR World folder contains at least an HTML file named `index.html`

If you want to use another name than `wikitude-worlds` for your AR Worlds' root folder, you can do that by telling Ionicitude what folder you want to use by passing an object argument to `Ionicitude.init()` with at least a `worldsRootFolder` property:

```javascript
Ionicitude.init({
	worldsRootFolder: 'my-personal-ar-worlds-folder-with-a-much-better-name'
});
```

**You should still follow rules #2 et #3. Otherwise, your world will not load correctly and you won't know why, because Wikitude does not throw an error if the file does not exists...**

In the and, your files organization should look like this:

```
application-root/
	...
	www/
		...
		wikitude-worlds/
			world-foo/
				index.html
				... some other files or folders ...
			world-bar/
				index.html
				... some other files or folders ...
```

## Actually launching an AR World
To launch an AR, simply call the `Ionicitude.launchAR()`, and pass it the name of the folder containing the AR World's files that you want to launch. Say you want to launch the `world-foo` AR World, you would call the method like that:

```javascript
Ionicitude.launchAR('world-foo');
```

----------
*Please, see [API Definition > `launchAR()`]() for the complete details about this method.*

----------

This will take the `index.html` file inside the `world-foo` folder, and launch an AR View with it.

`launchAR()` returns a promise, for you to react to any outcome:

```javascript
Ionicitude.launchAR()
	.then(function(success) {
		// What to do when the launch is successfull
	})
	.catch(function(error) {
		// What to do when the launch has failed
	});
```

**:warning: Note that if the device wants to launch an AR World but passed the `checkDevice()` check with a negative outcome, `Ionicitude.launchAR()` will throw an `UnsupportedFeatureError`.**

# Interaction between the Ionic app and the AR View

## Boring (but important) explanations ahead!

It's very important to understand that when the Wikitude plugin launches an AR View, it does not so in the context of your Ionic App. It creates a completely new, independant, agnostic WebView, that comes over your Ionic App WebView (check the following diagram). That means that all your data, scopes, services, controllers or whatever your app is using are complete strangers for the AR View.

![New AR View - Diagram](docs/new-ar-view.jpg)

To overcome this, the Wikitude staff added some mechanism for the two WebViews to communicate, much like a basic client/server architecture, the AR View being the client, and your app being the server.

### From: AR View, To: Ionic App

Remember when I said earlier that an AR World is ultimately juste HTML/CSS/JS files? Well, whenever one of your AR World's JS file execute a statement that looks like this one...

```javascript
// Somewhere in an AR World'JS file
document.location = 'architectsdk://foo?bar';
```

... that's the signal for the AR View that it needs to call a previsouly registered callback function on the Ionic App, and pass it the URL _(the value of `document.location`)_ as a String argument. This previsouly registered callback function is then responsible of analyzing, interpreting and executing whatever it's asked to do by the URL.

Thankfully, Ionicitude provides you with it's own way of doing this, so you don't have to worry about it. See [Ionicitude Callback Handling Mechanism](#ionicitude-callback-handling-mechanism-chm) for the details.

![Callback Function](docs/callback-function.jpg)

### From: Ionic App, To: AR View
If you want your Ionic App to trigger some behavior in the AR View (send a bunch of data to be displayed in reaction of an AR View call, for example), you can use `Ionicitude.callJavaScript()` _(mind the capital 'S')_ to do so. 

**For now, this method is just a wrapper around the Wikitude's `callJavaScript` function.**

This method works kind of like `eval()`. You just pass it a javascript statement as a String argument, and it will try to execute it on the context of the AR View. 

```javascript
// Somewhere in your Ionic code
Ionicitude.callJavascript('getQuestion(42)');
```

This will call the `getQuestion()` function, passing it `42` as it's only argument. **Note that `getQuestion()` must be defined in an AR World's JS files, not on your Ionic App's JS.**

This method is designed to be used inside a function called by the AR View with `document.location` (see above). If you try to call `Ionicitude.callJavaScript()` without having any active AR View, nothing will happen.


## Ionicitude Callback Handling Mechanism (CHM)
Ionicitude comes with it's own Callback Handling Mechanism (CHM) to deal with `document.location` calls. It is enabled by default when calling `Ionicitude.init()`, but you can use your own if you like. You'd just have to pass an object with at least a `customCallback` property as an argument to the `Ionicitude.init()` function. The value of `customCallback` must be a function that takes one argument:

```javascript
Ionicitude.init({
	// Using your custom CHM over Ionicitude's one.
	customcallback: function(arViewUrl) {
		// Do whatever handling you want to do with every document.location call from an AR View
	}
});
```

**If you do use your personnal CHM, you can skip the end of this section.**

### `document.location` URL format

Ionicitude's CHM requires that every URL passed as a value to `document.location` in an AR World's JS file follows a particular format.

1. It needs to start with `architectsdk://`, as this is a requirement from the Wikitude plugin.
2. The following characters must be the name of the function that will be ultimately called, what I call the Action.
3. If the Action have an argument, its function name must be followed by the `?` character
4. The argument to the Action's function must be a valid litteral JSON object. If the function needs more than one argument, then just add more properties to this JSON object and access them on your function body.

#### Valids AR View's URL
All the following URLs will be correctly interpreted and executed:

* `architectsdk://foo` will translate to `foo();`
* `architectsdk://foo?{"bar":"baz"}` will translate to `foo({bar: 'baz'});`
* `architectsdk://foo?{"bar": 1, "baz": {"fooBar": 123}}` will translate to `foo({bar: 1, baz: {fooBar: 123}});`

#### Invalids AR View's URL
All the following URLs will fail, throwing a SyntaxError:

* `foo` - every URL must starts with `architectsdk://`
* `architectsdk://foo()` - `foo()` is not a correct function name
* `architectsdk://foo{"bar": "baz"}` - the function argument must be preceded by the `?` character
* `architectsdk://foo?bar` - the function's argument must be a valib litteral JSON object


### CHM Function Mapping
Obviously, the Action name that you pass in the `document.location`'s URL must match an existing function, somewhere. By default, Ionicitude's CHM will try and execute this function from it's own Action library component. But because Ionicitude is _(sadly)_ not omniscient, it can not already contain everything that your AR View could call. 

#### Registering Actions
That's why you have to register an Action to Ionicitude's library before calling it from inside an AR View. Do this by calling `Ionicitude.addAction()` and passing it either a name and an anonymous function, or just a **named** function.

```javascript
// This is OK:
Ionicitude.addAction('foo', function() {
	// Some code...
});

// This is also OK:
function foo() {
	// Some code...
}

Ionicitude.addAction(foo);

// This is NOT OK:
Ionicitude.addAction(function() {
	// Some code...
});
```

When called by Ionicitude's CHM, an Action function will receive two arguments:

* `plugin`: The Wikitude plugin, if you need to call any method from the Wikitude plugin API (such as `close()` or `callJavaScript`)
* `param`: An object containing, as its properties, your function's arguments, if provided by the `document.location` statement (see [`document.location` URL format](#document-location-url-format)).

```javascript
// Registering an Action that doesn't need neither the plugin nor argument
Ionicitude.addAction();

// Registering an Action that needs only the plugin
Ionicitude.addAction();

// Registering an Action that needs both the plugin and argument,
// or an Action that don't need the plugin but tales an argument
Ionicitude.addAction();
```

**Be sure to register the function BEFORE your AR View calls it.**
### Using custom function library
If you don't want to register every single function with `Ionicitude.registerFunction()`, you can also tell Ionicitude to use your own library object, that will contains all the function needed by your AR Views. Do that by passing an object with at least a `functionLibrary` property as an argument to `Ionicitude.init()`:

```javascript
Ionicitude.init({
	functionLibrary: {
		foo: function(){
			// Some code	
		},
		bar: function(JSON_Object){
			// Some code
		}
	},
	// Other init params...
});
```
