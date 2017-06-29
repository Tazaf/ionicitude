# Interaction between the Ionic app and the AR view

## Important explanations ahead!

It's very important to understand that when the Wikitude plugin launches an AR View, it does not so in the context of your Ionic App. It creates a completely new, independant, agnostic WebView, that comes over your Ionic App WebView (check the following diagram). This means that all your data, scopes, services, controllers or whatever your app is using are complete strangers for the AR View.

![New AR View - Diagram](/assets/images/new-ar-view.jpg)

To overcome this, the Wikitude staff added some callback mechanism for the two WebViews to communicate, much like a basic client/server architecture, the AR View being the client, and your app being the server.

### From: AR View, To: Ionic App

Remember when I said earlier that an AR World is ultimately juste HTML/CSS/JS files? Well, whenever one of your AR World's JS file execute a `document.location` statement that starts with `architectsdk://`, like this one...

```javascript
// Somewhere in an AR World'JS file
document.location = 'architectsdk://foo?bar';
```

... that's the signal for the AR View that it needs to call a previsouly registered callback function on the Ionic App (more on that [later](Ionicitude-Callback-Handling-Mechanism-(CHM))), and pass it the URL _(the value of `document.location`)_ as a String argument.

![Callback Function](/assets/images/callback-function.jpg)

This previsouly registered callback function is then responsible of analyzing, interpreting and executing whatever it's asked to do by the URL.

Thankfully, Ionicitude provides you with it's own callback handling mechanism, so you wouldn't have to worry about that. But you can still set up your own mechanism, if you want.

----------
_Please, see [Ionicitude CHM](Ionicitude-Callback-Handling-Mechanism-(CHM)) for more details._

----------

### From: Ionic App, To: AR View
If you want your Ionic App to trigger some behavior inside the AR View (in reaction to an AR View `document.location` call, for example), you can use `Ionicitude.callJavaScript()` _(mind the capital 'S')_ to do so.

----------
_Please, see [API Doc > `callJavaScript()`](callJavaScript()) for details about this method._

----------


**For now, this method is just a wrapper around the Wikitude's `callJavaScript` function.**

This method works kinda like `eval()`. You pass it a javascript statement as a String argument, and it will try to execute this statement on the context of the AR View. 

```javascript
// Somewhere in your Ionic code
Ionicitude.callJavascript('getQuestion(42)');
```

This will call the `getQuestion()` function, passing it `42` as it's only argument.
**Note that `getQuestion()` must be defined in the AR World's JS, not on your Ionic App's JS.**

This `callJavaScript()` method is designed to be called only when an AR View is currently active. If you try to call `Ionicitude.callJavaScript()` without having any active AR View, nothing will happen.