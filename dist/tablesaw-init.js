/*! Tablesaw - v3.0.0-beta.4 - 2016-10-12
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2016 Filament Group; Licensed MIT */
;(function( win ) {

	var $;
	if( 'shoestring' in win ) {
		$ = win.shoestring;
	} else if( 'jQuery' in win ) {
		$ = win.jQuery;
	} else {
		throw new Error( "tablesaw: DOM library not found." );
	}

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	$( function(){
		$( document ).trigger( "enhance.tablesaw" );
	});

})( typeof window !== "undefined" ? window : this );