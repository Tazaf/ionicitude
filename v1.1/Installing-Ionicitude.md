# Installing Ionicitude

OK :ok_hand: ! Now that you have successfully installed the cordova Wikitude plugin (right?), it's time to install Ionicitude, in order to manipulate this freshly installed cordova plugin. To install ionicitude, you have several choices.

## 1a. With `ionic add` _(recommanded)_

Using any command ligne tool, go to your app's root directory and type:

```
$> ionic add ionicitude
```

or

```
$> bower install --save ionicitude
```

After some download, Ionicitude will be installed on your project.

**The files will be locate in `www/lib/ionicitude`.**

You will then need to add the following line in your app's `index.html`, after the calls to `ionic.bundle.js` and `cordova.js` :

```html
<script src="lib/ionicitude/dist/ionicitude.min.js"></script>
```

Or, if you want the humanly readable version :

```html
<script src="lib/ionicitude/dist/ionicitude.js"></script>
```

## 1b. Using `npm install`
For those of you who prefer to use `npm install`, you can use this to install the ionicitude plugin.

### Install the package
This can be achieved using the following command:

```
$> npm install --save ionicitude
```

The plugin will then be available in your app's `node_modules` folder, and the `.js` files are located on the `dist` subfolder.

### Copy the file
But this is not enough! In order to use Ionicitude in your code, its file(s) must be in the `www` folder of your project (or any of the subfolder).

**Ionic has a special folder for this kind of plugin and this is the `www/lib` folder.**

You could do this by hand, but the NPM package of Ionicitude comes with a script **that copies the necesseray files from the plugin and paste them in a new `ionicitude` folder right inside the `www/lib` folder**. To execute this script, type the following command:

```
$> ./node_modules/.bin/install-ionicitude
```

### [Optionnal] Update your `package.json`
If you only do the previous operations, you'll have to do them again every time you update the Ionicitude package through a `npm install`.
To spare you the trouble, you could update your poject's `package.json` by adding a "postinstall" attribute to the "scripts" attribute, like this:

```javascript
// package.json
{
  ...
  "scripts": {
    ...
    "postinstall": "./node_modules/.bin/install-ionicitude"
  },
  ...
}
```
This way, each time you do a `npm install` in your project folder, npm will go and fetch the latest version of your package (specifically Ionicitude) and execute the Ionicitude script that copies the latest files at the right place of your project.

### Insert the `<script>`
When the script is done (it should tell you so), you'll finally need to insert the `.js` file in your app's `index.html`, after the calls to `ionic.bundle.js` and `cordova.js` :

```html
<script src="lib/ionicitude/dist/ionicitude.min.js"></script>
```

Or, if you want the humanly readable version :

```html
<script src="lib/ionicitude/dist/ionicitude.js"></script>
```

## 1c. Manually
You can simply [download the latest version of this project](https://github.com/Tazaf/ionicitude/releases) on your computer and place it wherever you like in your project. Then, locate either the `ionicitude.min.js` file **or** the `ionicitude.js` file, both being in the `dist` folder of the downloaded project, and copy them in your own project, wherever you like.

You will then need to include the file in your app's `index.html`, after the calls to `ionic.bundle.js` and `cordova.js` :

```html
<script src="path/to/the/file/ionicitude.min.js"></script>
```

Or, if you copied the humanly readable version :

```html
<script src="path/to/the/file/ionicitude.js"></script>
```

_Note: you'll obviously need to replace `path/to/the/file` with the actual path to the file._

## 2. Registering the dependency
Whatever installing method you choose, you'll finally have to register the module in your app's dependencies:

```javascript
// In app.js or wherever you created your app's module
angular.module('app', ['ionic', 'ionicitude-module', /* other dependencies */]);
```