/*
* tablesaw: A set of plugins for responsive tables
* Stack: switches from column layout to rows with inline labels
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

;(function( win, $, undefined ){

	var Stack = function( element ) {

		this.$table = $( element );

		this.classes = {
			stackTable: "tablesaw-stack",
			cellLabels: "tablesaw-cell-label"
		};

		// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
		this.allHeaders = this.$table.find( "th" );

		this.$table.data( 'tablesaw-stack', this );
	};

	Stack.prototype.init = function( colstart ) {
		this.$table.addClass( this.classes.stackTable );

		// get headers in reverse order so that top-level headers are appended last

		var reverseHeaders = $( this.allHeaders );

		// create the hide/show toggles
		var self = this;

		reverseHeaders.each(function(){
			var $cells = $( this.cells ),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				text = $(this).text();

			if( text !== ""  ){

				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
					}
					$cells.filter( filter ).prepend( "<b class='" + self.classes.cellLabels + hierarchyClass + "'>" + text + "</b>"  );
				}
				else {
					$cells.prepend( "<b class='" + self.classes.cellLabels + "'>" + text + "</b>"  );
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( this.classes.stackTable );
		this.$table.find( '.' + this.classes.cellLabels ).remove();
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", "table", function( e, mode, colstart ){
		if( mode === 'stack' ){
			var table = new Stack( this );
			table.init( colstart );
		}

	} );

	$( document ).on( "tablesawdestroy", "table", function( e, mode ){

		if( mode === 'stack' ){
			$( this ).data( 'tablesaw-stack' ).destroy();
		}

	} );

}( this, jQuery ));