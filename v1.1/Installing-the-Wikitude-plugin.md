# Installing the Wikitude plugin

:exclamation: **This package DOES NOT come along with the cordova Wikitude plugin!**

Since Ionicitude is a service that uses the cordova Wikitude plugin, you'll need to first install the plugin on your project. Do it with the following command (that can take a while: it's a heavy plugin):

```
$> ionic plugin add https://github.com/Wikitude/wikitude-cordova-plugin.git
```

## Wikitude Licence Key
To use the Wikitude plugin, you have to have a valid **licence key**. You can obtain one by registering on [the Wikitude site](http://www.wikitude.com/developer/documentation/phonegap) (top-right of the screen), logging in, and accessing the [licence key management page](http://www.wikitude.com/developer/licenses). Here, you can download a free trial licence key for the Wikitude SDK.

**Note that the free trial let's you use all the plugin functionnality (geo and 2dtracking) without any time limit, but put a splash screen before every AR World launch and a big "Trial" watermark all over your screen. This is apparently not the case with a paid licence key.**

The downloaded file is juste a plain text file containing your licence key.

Copy it, go to the `WikitudePlugin.js` file (located in your app structure at `plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js`) and paste it as the value to `this._sdkKey` on line 11.

_Note : If you already installed any platform to your project, you'll need to install them again for the plugin modification to propagate (see next point for android platform)._

## Android platform version ^5.0.0
If you want your Ionic app to build correctly for android, with the cordova Wikitude plugin installed, it's absolutely imperative that you add the android platform with at least its `5.0.0` version. Otherwise your build will fail.

### You didn't add any platform ?

That's cool. But, when you do, don't forget to do it with:

```
$> ionic platform add android@5.0.0
```

### You already added your platform(s) ?

Hey, no prob'. You can check your installed android platform version with...

```
$> ionic platform
```

...and if it's lower than `5.0.0`, you can update it:

```
$> ionic platform update android@5.0.0
```

### How to check it worked

When it's done, you can check that everything's OK by typing this command (and crossing your fingers):

```
$> ionic build android
```

If you see an easing `BUILD SUCCESSFULL` at the end of the process, congrats! Your app is building.

## Known Android bugs

Please, be advised that I've been confronted, when using the Wikitude plugin, to some awkwards bugs on Android  devices regarding the back button handling from within an AR View, and the user location tracking lifecycle. If you encouter them or any other bugs related to the Wikitude plugin, please go on the [Github Wikitude repo](http://github.com/Wikitude/wikitude-cordova-plugin/issues) or on the [Wikitude Developer Forum](http://www.wikitude.com/developer/developer-forum) (you'll need to register).

**Having mostly developped with Ionic on Android, I don't know if these bugs also impact iOS builds. From the few tests that I've done, it's apparently not the case.**