/*! Tablesaw - v2.0.2 - 2016-02-07
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2016 Filament Group; Licensed  */
;(function( $ ) {

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	$( function(){
		$( document ).trigger( "enhance.tablesaw" );
	});

})( jQuery );