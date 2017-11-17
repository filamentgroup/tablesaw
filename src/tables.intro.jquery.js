(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["jquery"], function (jQuery) {
      return (root.Tablesaw = factory(jQuery, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery')(root), root);
  } else {
    root.Tablesaw = factory(jQuery, root);
  }
}(typeof window !== "undefined" ? window : this, function ($, win) {
	"use strict";
