/*
* tablesaw: A set of plugins for responsive tables
* Stack: switches from column layout to rows with inline labels
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

;(function( win, $, undefined ){

	var classes = {
		stackTable: 'tablesaw-stack',
		cellLabels: 'tablesaw-cell-label'
	};

	var data = {
		obj: 'tablesaw-stack'
	};

	var attrs = {
		labelless: 'data-no-labels'
	};

	var Stack = function( element ) {

		this.$table = $( element );

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );

		if( !this.labelless ) {
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.$table.find( "th" );
		}

		this.$table.data( data.obj, this );
	};

	Stack.prototype.init = function( colstart ) {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		// get headers in reverse order so that top-level headers are appended last
		var reverseHeaders = $( this.allHeaders );

		// create the hide/show toggles
		reverseHeaders.each(function(){
			var $cells = $( this.cells ),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				text = $(this).text();

			if( text !== "" ){
				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
					}
					$cells.filter( filter ).prepend( "<b class='" + classes.cellLabels + hierarchyClass + "'>" + text + "</b>"  );
				} else {
					$cells.prepend( "<b class='" + classes.cellLabels + "'>" + text + "</b>"  );
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( classes.stackTable );
		this.$table.find( '.' + classes.cellLabels ).remove();
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
			$( this ).data( data.obj ).destroy();
		}

	} );

}( this, jQuery ));