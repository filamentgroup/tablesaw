/*
* tablesaw: A set of plugins for responsive tables
* Stack and Column Toggle tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

;(function( $ ) {
	var o = {
		pluginName : "table",
		classes : {
			toolbar: "tablesaw-bar"
		},
		events: {
			create: "tablesawcreate",
			destroy: "tablesawdestroy"
		},
		mode: "stack",
		initSelector: "table[data-mode],table[data-sortable]"
	},
	methods = {
		_create: function() {
			var self = this,
				$table = $(this);

			// override the mode if defined (this could be broader if needed)
			if( $(this).is( "[data-mode]" ) ){
				o.mode = $(this).attr( "data-mode" );
			}

			// Insert the toolbar
			// TODO move this into a separate component
			var $toolbar = $table.prev( '.' + o.classes.toolbar );
			if( !$toolbar.length ) {
				$toolbar = $( '<div>' )
					.addClass( o.classes.toolbar )
					.insertBefore( $table );
			}

			if( o.mode ) {
				$toolbar.addClass( 'mode-' + o.mode );
			}

			// Add header cells
			var colstart,
				thrs = this.querySelectorAll( "thead tr" );
			$( thrs ).each( function(){
				var coltally = 0;

				$( this ).children().each( function(){
					var span = parseInt( this.getAttribute( "colspan" ), 10 ),
						sel = ":nth-child(" + ( coltally + 1 ) + ")";

					colstart = coltally + 1;

					if( span ){
						for( var k = 0; k < span - 1; k++ ){
							coltally++;
							sel += ", :nth-child(" + ( coltally + 1 ) + ")";
						}
					}

					// Store "cells" data on header as a reference to all cells in the same column as this TH
					this.cells = $( self ).find("tr").not($( thrs ).eq(0)).not(this).children(sel);
					coltally++;

				});
			});

			$table.trigger( o.events.create, [ o.mode, colstart ] );
		},

		destroy: function() {
			var $t = $( this );
			$t.removeAttr( 'data-mode' );

			// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
			$t.prev( '.' + o.classes.toolbar ).each(function() {
				this.className = this.className.replace( /\bmode\-\w*\b/gi, '' );
			});

			$( window ).off( 'resize.' + $t.attr( 'id' ) );

			// other plugins
			$t.trigger( o.events.destroy, [ o.mode ] );

			$t.removeData( o.pluginName + 'active' );
		}
	};

	// Collection method.
	$.fn[ o.pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

			// if it's a method
			if( arrg && typeof( arrg ) === "string" ){
				return $.fn[ o.pluginName ].prototype[ arrg ].call( this, a, b, c );
			}

			// don't re-init
			if( $( this ).data( o.pluginName + "active" ) ){
				return $( this );
			}

			// otherwise, init
			$( this ).data( o.pluginName + "active", true );
			$.fn[ o.pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	$.extend( $.fn[ o.pluginName ].prototype, methods );

	$( document ).on( "enhance.tablesaw", function( e ) {
		$( e.target ).find( o.initSelector )[ o.pluginName ]();
	});

}( jQuery ));
