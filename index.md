---
home: false
lib: true
toc: false
---

# Important Note

**Due to a lack of time, I haven't been able to update this package in a long time.**

**Thus the documentation can be a litlle outdated, specifically the parts refering to Ionic command or code (the Ionic CLI has heavily changed since the last time I worked on this project).**

**I sincerely apologize for those of you who struggled installing or using this library.**

# Introduction

This package is designed for Ionic developers who wants to use the [cordova Wikitude plugin](http://www.wikitude.com/products/extensions/cordova-plugin-augmented-reality/) to add Augmented Reality (AR) in their app. It provides an Angular Service, named **Ionicitude**, with a simple API to interact with the cordova plugin, wether it be setting it, launching it or handling the AR Views' requests (more about in the documentation).

## What is the cordova Wikitude plugin?
It's a plugin that allows users to experience Augmented Reality on their device through an hybrid Cordova (or Ionic in our case) app. This AR experience can rely on user's location (think [Ingress](https://www.ingress.com/)) or on images recognition and tracking, or both. The possibilities are quite impressive and I encourage you to take a look at [the official Demo app](http://www.wikitude.com/try/) to grasp the extent of what can be accomplish with the plugin.

An AR Experience is, in the end, nothing more than a bunch of HTML/CSS/JS files. This set of files is called **ARchitect World** by the Wikitude staff.

_Since I'm lazy, I'll use **AR World** throughout the rest of this documentation._

### Important note
:warning: **The cordova Wikitude plugin relies heavily on the device's hardware and software (camera, accelerometer, compass, etc). Thus, _you won't be able to test your app (at least the AR part of it) anywhere except on a real device_. Testing it in a browser or an emulator will fail.**
