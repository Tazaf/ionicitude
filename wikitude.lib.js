/**
 * Created by Mathias on 01.04.2016.
 */
(function () {
  'use strict';

  angular
    .module('WikitudeModule')
    .service('lib', lib);

  function lib(plugin) {

    // This is where your custom functions go

    this.close = close;
    this.hide = hide;

    ////////////////////

    function close() {
      plugin.get().close();
    }

    function hide() {
      plugin.get().hide();
    }
  }
})();
