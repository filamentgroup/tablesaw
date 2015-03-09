// UMD module definition
// From: https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function (jQuery) {
  var Tablesaw, win = typeof window !== "undefined" ? window : this;
