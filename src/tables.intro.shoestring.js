(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["shoestring"], function (shoestring) {
      return (root.Tablesaw = factory(shoestring, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('shoestring'), root);
  } else {
    root.Tablesaw = factory(shoestring, root);
  }
}(typeof window !== "undefined" ? window : this, function ($, window) {
	"use strict";

  var document = window.document;