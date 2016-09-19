/*
* tablesaw: A set of plugins for responsive tables
* Stack: switches from column layout to rows with inline labels
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

;(function(){

	var classes = {
		stackTable: 'tablesaw-stack',
		cellLabels: 'tablesaw-cell-label',
		cellContentLabels: 'tablesaw-cell-content'
	};

	var data = {
		obj: 'tablesaw-stack'
	};

	var attrs = {
		labelless: 'data-tablesaw-no-labels',
		hideempty: 'data-tablesaw-hide-empty'
	};

	var Stack = function( element, colstart ) {

		this.$table = $( element );
		this.colstart = colstart;

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );
		this.hideempty = this.$table.is( '[' + attrs.hideempty + ']' );

		if( !this.labelless ) {
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.$table.find( "th" );
		}

		this.$table.data( data.obj, this );
	};

	Stack.prototype.init = function( ) {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		// get headers in reverse order so that top-level headers are appended last
		var reverseHeaders = $( this.allHeaders );
		var hideempty = this.hideempty;

		// create the hide/show toggles
		reverseHeaders.each(function(){
			var $t = $( this ),
				$cells = $( this.cells ).filter(function() {
					return !$( this ).parent().is( "[" + attrs.labelless + "]" ) && ( !hideempty || !$( this ).is( ":empty" ) );
				}),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				// TODO reduce coupling with sortable
				$sortableButton = $t.find( ".tablesaw-sortable-btn" ),
				html = $sortableButton.length ? $sortableButton.html() : $t.html();

			if( html !== "" ){
				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( this.colstart ) +")";
					}
					var filteredCells = $cells.filter( filter );
					filteredCells.not( ":has(b." + classes.cellLabels + ")" ).prepend( "<b class='" + classes.cellLabels + hierarchyClass + "'></b>"  );
					filteredCells.children( "b." + classes.cellLabels ).each(function() {
						if (this.innerHTML != html) {
							this.innerHTML = html;
						}
					});
				} else {
					var newCells = $cells.not( ":has(b." + classes.cellLabels + ")" );
					newCells.wrapInner( "<span class='" + classes.cellContentLabels + "'></span>" );
					newCells.prepend( "<b class='" + classes.cellLabels + "'></b>"  );
					$cells.children( "b." + classes.cellLabels ).each(function() {
						if (this.innerHTML != html) {
							this.innerHTML = html;
						}
					});
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( classes.stackTable );
		this.$table.find( '.' + classes.cellLabels ).remove();
		this.$table.find( '.' + classes.cellContentLabels ).each(function() {
			$( this ).replaceWith( this.childNodes );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw, colstart ){
		if( tablesaw.mode === 'stack' ){
			var table = new Stack( Tablesaw.table, colstart );
			table.init();
		}

	} );

	$( document ).on( "tablesawrefresh", function( e ){
		var table = $(e.target).table().data( data.obj );
		if (table) {
			// Reinitialization will only add labels to new rows
			// or update existing labels.
			table.init()
		}
	} );

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){

		if( tablesaw.mode === 'stack' ){
			$( tablesaw.table ).data( data.obj ).destroy();
		}

	} );

}());
