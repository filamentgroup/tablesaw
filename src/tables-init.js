/*
* tablesaw: A set of plugins for responsive tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function(win) {
	"use strict";
	var $;
	if ("shoestring" in win) {
		$ = win.shoestring;
	} else if ("jQuery" in win) {
		$ = win.jQuery;
	} else {
		throw new Error("tablesaw: DOM library not found.");
	}

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	// Use raw DOMContentLoaded instead of shoestring (may have issues in Android 2.3, exhibited by stack table)
	if ("addEventListener" in document) {
		document.addEventListener("DOMContentLoaded", function() {
			$(document).trigger("enhance.tablesaw");
		});
	}
})(typeof window !== "undefined" ? window : this);
