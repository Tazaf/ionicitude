/**
 * Created by Mathias on 05.04.2016.
 */
(function () {
  'use strict';

  var settings = {
    // TODO : commenter la propriété selon la doc de Wikitude.
    worldConfig: {camera_position: 'back'},
    /**
     * Defines which features your AR app need the device to support.
     * For now, only two features are available in the cordova WikitudePlugin.
     * The first one is 'geo' and is used for any ARchitect World that wants to rely on the user's location.
     * The second is '2dtracking' and is used for any ARchitect World that wants to use image recognition and image tracking.
     * More information : http://www.wikitude.com/developer/documentation/phonegap.
     * @type {Array}
     */
    reqFeatures: ['geo', '2dtracking'],
    /**
     * Defines where in your app are stored all your ARchitect World folders.
     * By default, a wikitude-worlds folder is created at the root of your app but you can easily change that by giving this parameter your custom path.
     * Example : if you want to store your worlds folder in a myWorlds folder inside www, change the value to 'www/myWorlds'.
     * @type {String}
     */
    worldsRootFolder: 'wikitude-worlds',
    /**
     * Each of this parameter property references a sub-folder inside your worldsRootFolder, that containx all the files managing a single ARchitect world experience.
     * The name that you give to each property must be used when launching this ARchitect World by calling the launchAR() method of the Wikitude service.
     * For example, to launch the 'main' ARchitext World, you will call : launchAR('main').
     * Each property must have it's own two properties : folder and file.
     * The first one must be set to the folder's name containing the file for this World, where the second must be set to the HTML main file for this world.
     * By default, the folder property value and the property name are the same, and the file value is 'index.html', but you're obviously free the change that.
     * @type {Object}
     */
    worldsFolders: {
      /**
       * Defines the properties for the 'main' ARchitect World
       * @type {Object}
       */
      main: {
        /**
         * Defines the name of the folder containing the 'main' ARchitect World files, inside the folder referenced by the 'worldsRootFolder' value.
         * If not provided, the name of the parent property will be used.
         * @type {String}
         */
        folder: 'main',
        /**
         * Defines the name of the HTML file that contains the bootstrap of the ARchitect World.
         * If not provided, the name 'index' will be used (thus targeting an index.html file inside the 'folder' folder.
         * @type {String}
         */
        file: 'index'
      }
    }
  };

  angular
    .module('WikitudeModule')
    /**
     * This defines the protocol used by the Wikitude AR View when it tries to call a functionnality defined in the main app.
     * This SHOULD NOT BE changed ! Otherwise, you will NOT be able to communicate between the Wikitude AR View and you app.
     */
    .constant('protocol', 'architectsdk://')
    .value('settings', settings);
})();
