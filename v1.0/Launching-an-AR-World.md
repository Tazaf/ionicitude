## What's an AR World

The most simplistic AR World possible is just an HTML file (generally `index.html`), that loads up all the Wikitude logic. **See [this Gist](https://gist.github.com/Tazaf/5209e26e9a66e5eb526ed5ad34152586) for a blank minimal `index.html` file to use in your new AR Worlds.**

More advanced AR Worlds contains an HTML file, one or several JS files (with your custom code or third party libraries), maybe some CSS, perhaps some image-tracking related files (specific to Wikitude, see [their documentation](http://www.wikitude.com/external/doc/documentation/latest/phonegap/targetmanagement.html) for more information) or whatever file is useful for this particular AR World..

## Expected files organization
In order to correctly launch your AR Worlds, Ionicitude expects three things:

1. You have a folder named `wikitude-worlds` in your app's `www` folder _(optionnal, see below)_
2. Each of your AR World is contained in a single folder _(named as you like)_ inside `wikitude-worlds`
3. Each AR World folder contains at least an HTML file named `index.html`

If you want to use another name than `wikitude-worlds` for your AR Worlds' root folder (point #1), you can do that by passing an object argument with at least a `worldsRootFolder` property when calling `Ionicitude.init()`:

```javascript
Ionicitude.init({
  worldsRootFolder: 'my-personal-ar-worlds-folder-with-a-much-better-name'
});
```

**You must still follow rules #2 et #3. Otherwise, your world will not load correctly and you won't know why, because Wikitude does not throw an error if you try to load a file that doesn't exist**

In the end, your files organization should look like this:

```
[your app root directory]/
    ...
    www/
        ...
        wikitude-worlds/ **Or whatever name you set**
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
_Please, see [API Definition > `launchAR()`](https://github.com/Tazaf/ionicitude/wiki/API-Definition#launchar) for the complete details about this method._

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

**:warning: Note that if you try to launch an AR World on a device that didn't successfully passed the `checkDevice()` test, `Ionicitude.launchAR()` will throw an `UnsupportedFeatureError`.**