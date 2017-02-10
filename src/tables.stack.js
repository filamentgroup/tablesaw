/*
* tablesaw: A set of plugins for responsive tables
* Stack: switches from column layout to rows with inline labels
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function(){

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

	var Stack = function( element, tablesaw ) {

		this.tablesaw = tablesaw;
		this.$table = $( element );

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );
		this.hideempty = this.$table.is( '[' + attrs.hideempty + ']' );

		this.$table.data( data.obj, this );
	};

	// Stack.prototype.init = function( colstart ) {
	Stack.prototype.init = function() {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		var self = this;

		this.$table.find( "th, td" ).filter(function() {
			return !$( this ).closest( "thead" ).length;
		}).filter(function() {
			return !$( this ).closest( "tr" ).is( "[" + attrs.labelless + "]" ) &&
				( !self.hideempty || !!$( this ).html() );
		}).each(function() {
			var html = [];
			var $cell = $( this );

			// headers
			$( self.tablesaw._findHeadersForCell( this ) ).each(function() {
				var $t = $( this );
				// TODO decouple from sortable better
				var $sortableButton = $t.find( ".tablesaw-sortable-btn" );
				html.push( $sortableButton.length ? $sortableButton.html() : $t.html() );
			});

			$cell.wrapInner( "<span class='" + classes.cellContentLabels + "'></span>" );
			$cell.prepend( "<b class='" + classes.cellLabels + "'>" + html.join( ", " ) + "</b>"  );
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
	$( document ).on( "tablesawcreate", function( e, tablesaw ){
		if( tablesaw.mode === 'stack' ){
			var table = new Stack( tablesaw.table, tablesaw );
			table.init();
		}
	});

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){
		if( tablesaw.mode === 'stack' ){
			$( tablesaw.table ).data( data.obj ).destroy();
		}
	});

}());