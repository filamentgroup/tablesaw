/*! Tablesaw - v3.0.9 - 2018-10-11
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2018 Filament Group; Licensed MIT */
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
