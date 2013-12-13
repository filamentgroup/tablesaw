;(function( $ ) {
	var TS = {
		regex: {
			dir: /tablesaw(\.min)?\.js/i
		}
	};

	TS.dir = (function() {
		var dir;

		$( 'script' ).each(function() {
			var attr = $( this ).attr( 'data-dist-dir' );
			if( attr ) {
				dir = attr;
				return false;
			} else if ( this.src && this.src.match( TS.regex.dir ) ) {
				dir = this.src.replace( TS.regex.dir, '' );
				return false;
			}
		});

		return dir;
	})();

	window.TableSaw = TS;

	// Cut the mustard
	if( !( 'querySelector' in document ) || ( window.blackberry && window.WebKitPoint ) || window.operamini ) {
		return;
	} else {
		$( document.documentElement ).addClass( 'enhanced' );

		// DOM-ready auto-init of plugins.
		// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
		$( function(){
			$( document ).trigger( "enhance.tablesaw" );
		});
	}

})( jQuery );