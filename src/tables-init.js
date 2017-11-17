/*
* tablesaw: A set of plugins for responsive tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function(win) {
	"use strict";

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	// Use raw DOMContentLoaded instead of shoestring (may have issues in Android 2.3, exhibited by stack table)
	if (!("Tablesaw" in win)) {
		throw new Error("Tablesaw library not found.");
	}
	if (!("init" in Tablesaw)) {
		throw new Error("Your tablesaw-init.js is newer than the core Tablesaw version.");
	}

	Tablesaw.init();
})(typeof window !== "undefined" ? window : this);
