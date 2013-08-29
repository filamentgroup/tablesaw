/*
 * swipeable column toggle - extends the coltoggle plugin when you add a data-swipe attr
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed MIT
 */
(function( win, $, undefined ){

	var MM = {
		attr: {
			init: 'data-minimap'
		}
	};

	function createMiniMap( $table ){

		var $btns = $( '<div class="table-advance minimap">' ),
			$dotNav = $( '<ul class="table-advance-dots">' ).appendTo( $btns ),
			hideDot = 'table-advance-dots-hide',
			$headerCells = $table.find( 'thead th' );

		// populate dots
		$headerCells.each(function(){
			$dotNav.append( '<li><i></i></li>' );
		});

		$btns.appendTo( $table.prev( '.ui-table-bar' ) );

		function showMinimap( $table ) {
			var mq = $table.attr( MM.attr.init );
			return !mq || win.matchMedia && win.matchMedia( mq ).matches;
		}

		function showHideNav(){
			if( !showMinimap( $table ) ) {
				$btns.hide();
				return;
			}
			$btns.show();

			// show/hide dots
			var dots = $dotNav.find( "li" ).removeClass( hideDot );
			$table.find( "thead th" ).each(function(i){
				if( $( this ).css( "display" ) === "none" ){
					dots.eq( i ).addClass( hideDot );
				}
			});
		}

		// run on init and resize
		showHideNav();
		$( win ).on( "resize", showHideNav );


		$table
			.bind( "tablecolumns.minimap", function(){
				showHideNav();
			})
			.bind( "tabledestroy.minimap", function(){
				var $t = $( this );

				$t.prev( '.ui-table-bar' ).find( '.table-advance' ).remove();
				$( win ).off( "resize", showHideNav );

				$t.unbind( ".minimap" );
			});
	}



	// on tablecreate, init
	$( document ).on( "tablecreate", "table", function( e, mode ){

		var $table = $( this );
		if( ( mode === 'swipe' || mode === 'columntoggle' ) && $table.is( '[ ' + MM.attr.init + ']' ) ){
			createMiniMap( $table );
		}

	} );

}( this, jQuery ));
