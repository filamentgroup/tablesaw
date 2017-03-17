/*
* tablesaw: A set of plugins for responsive tables
* Stack and Column Toggle tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

var Tablesaw = {
	i18n: {
		modes: [ 'Stack', 'Swipe', 'Toggle' ],
		columns: 'Col<span class=\"a11y-sm\">umn</span>s',
		columnBtnText: 'Columns',
		columnsDialogError: 'No eligible columns.',
		sort: 'Sort'
	},
	// cut the mustard
	mustard: ( 'head' in document ) && // IE9+, Firefox 4+, Safari 5.1+, Mobile Safari 4.1+, Opera 11.5+, Android 2.3+
		( !window.blackberry || window.WebKitPoint ) && // only WebKit Blackberry (OS 6+)
		!window.operamini
};

if( Tablesaw.mustard ) {
	$( document.documentElement ).addClass( 'tablesaw-enhanced' );
}

(function() {
	var pluginName = "tablesaw";
	var classes = {
		toolbar: "tablesaw-bar"
	};
	var events = {
		create: "tablesawcreate",
		destroy: "tablesawdestroy",
		refresh: "tablesawrefresh",
		resize: "tablesawresize"
	};
	var defaultMode = "stack";
	var initSelector = "table";
	var initFilterSelector = "[data-tablesaw],[data-tablesaw-mode],[data-tablesaw-sortable]";
	var defaultConfig = {};

	Tablesaw.events = events;

	var Table = function( element ) {
		if( !element ) {
			throw new Error( "Tablesaw requires an element." );
		}

		this.table = element;
		this.$table = $( element );

		// only one <thead> and <tfoot> are allowed, per the specification
		this.$thead = this.$table.children().filter( "thead" ).eq( 0 );

		// multiple <tbody> are allowed, per the specification
		this.$tbody = this.$table.children().filter( "tbody" );

		this.mode = this.$table.attr( "data-tablesaw-mode" ) || defaultMode;

		this.init();
	};

	Table.prototype.init = function() {
		// assign an id if there is none
		if ( !this.$table.attr( "id" ) ) {
			this.$table.attr( "id", pluginName + "-" + Math.round( Math.random() * 10000 ) );
		}

		this.createToolbar();

		this._initCells();

		this.$table.data( pluginName, this );

		this.$table.trigger( events.create, [ this ] );
	};

	Table.prototype.getConfig = function( pluginSpecificConfig ) {
		// shoestring extend doesn’t support arbitrary args
		var configs = $.extend( defaultConfig, pluginSpecificConfig || {} );
		return $.extend( configs, typeof TablesawConfig !== "undefined" ? TablesawConfig : {} );
	};

	Table.prototype._getPrimaryHeaderRow = function() {
		return this._getHeaderRows().eq( 0 );
	};

	Table.prototype._getHeaderRows = function() {
		return this.$thead.children().filter( "tr" ).filter(function() {
			return !$( this ).is( "[data-tablesaw-ignorerow]" );
		});
	};

	Table.prototype._getRowIndex = function( $row ) {
		return $row.prevAll().length;
	};

	Table.prototype._getHeaderRowIndeces = function() {
		var self = this;
		var indeces = [];
		this._getHeaderRows().each(function() {
			indeces.push( self._getRowIndex( $( this ) ) );
		});
		return indeces;
	};

	Table.prototype._getPrimaryHeaderCells = function( $row ) {
		return ( $row || this._getPrimaryHeaderRow() ).find( "th" );
	};

	Table.prototype._findPrimaryHeadersForCell = function( cell ) {
		var $headerRow = this._getPrimaryHeaderRow();
		var $headers = this._getPrimaryHeaderCells( $headerRow );
		var headerRowIndex = this._getRowIndex( $headerRow );
		var results = [];

		for( var rowNumber = 0; rowNumber < this.headerMapping.length; rowNumber++ ) {
			if( rowNumber === headerRowIndex ) {
				continue;
			}
			for( var colNumber = 0; colNumber < this.headerMapping[ rowNumber ].length; colNumber++ ) {
				if( this.headerMapping[ rowNumber ][ colNumber ] === cell ) {
					results.push( $headers[ colNumber ] );
				}
			}
		}
		return results;
	};

	// used by init cells
	Table.prototype.getRows = function() {
		var self = this;
		return this.$table.find( "tr" ).filter(function() {
			return $( this ).closest( "table" ).is( self.$table );
		});
	};

	// used by sortable
	Table.prototype.getBodyRows = function( tbody ) {
		return ( tbody ? $( tbody ) : this.$tbody ).children().filter( "tr" );
	};

	Table.prototype.getHeaderCellIndex = function( cell ) {
		var lookup = this.headerMapping[ 0 ];
		for( var colIndex = 0; colIndex < lookup.length; colIndex++ ) {
			if( lookup[ colIndex ] === cell ) {
				return colIndex;
			}
		}

		return -1;
	};

	Table.prototype._initCells = function() {
		var $rows = this.getRows();
		var columnLookup = [];

		$rows.each(function( rowNumber ) {
			columnLookup[ rowNumber ] = [];
		});

		$rows.each(function( rowNumber ) {
			var coltally = 0;
			var $t = $( this );
			var children = $t.children();

			children.each(function() {
				var colspan = parseInt( this.getAttribute( "colspan" ), 10 );
				var rowspan = parseInt( this.getAttribute( "rowspan" ), 10 );

				// set in a previous rowspan
				while( columnLookup[ rowNumber ][ coltally ] ) {
					coltally++;
				}

				columnLookup[ rowNumber ][ coltally ] = this;

				// TODO? both colspan and rowspan
				if( colspan ) {
					for( var k = 0; k < colspan - 1; k++ ){
						coltally++;
						columnLookup[ rowNumber ][ coltally ] = this;
					}
				}
				if( rowspan ) {
					for( var j = 1; j < rowspan; j++ ){
						columnLookup[ rowNumber + j ][ coltally ] = this;
					}
				}

				coltally++;
			});
		});

		var headerRowIndeces = this._getHeaderRowIndeces();
		for( var colNumber = 0; colNumber < columnLookup[ 0 ].length; colNumber++ ) {
			for( var headerIndex = 0, k = headerRowIndeces.length; headerIndex < k; headerIndex++ ) {
				var headerCol = columnLookup[ headerRowIndeces[ headerIndex ] ][ colNumber ];

				var rowNumber = headerRowIndeces[ headerIndex ];
				var rowCell;

				if( !headerCol.cells ) {
					headerCol.cells = [];
				}

				while( rowNumber < columnLookup.length ) {
					rowCell = columnLookup[ rowNumber ][ colNumber ];

					if( headerCol !== rowCell ) {
						headerCol.cells.push( rowCell );
					}

					rowNumber++;
				}
			}
		}

		this.headerMapping = columnLookup;
	};

	Table.prototype.refresh = function() {
		this._initCells();

		this.$table.trigger( events.refresh, [ this ] );
	};

	Table.prototype.createToolbar = function() {
		// Insert the toolbar
		// TODO move this into a separate component
		var $toolbar = this.$table.prev().filter( '.' + classes.toolbar );
		if( !$toolbar.length ) {
			$toolbar = $( '<div>' )
				.addClass( classes.toolbar )
				.insertBefore( this.$table );
		}
		this.$toolbar = $toolbar;

		if( this.mode ) {
			this.$toolbar.addClass( 'tablesaw-mode-' + this.mode );
		}
	};

	Table.prototype.destroy = function() {
		// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
		this.$table.prev().filter( '.' + classes.toolbar ).each(function() {
			this.className = this.className.replace( /\btablesaw-mode\-\w*\b/gi, '' );
		});

		var tableId = this.$table.attr( 'id' );
		$( document ).off( "." + tableId );
		$( window ).off( "." + tableId );

		// other plugins
		this.$table.trigger( events.destroy, [ this ] );

		this.$table.removeData( pluginName );
	};

	// Collection method.
	$.fn[ pluginName ] = function() {
		return this.each( function() {
			var $t = $( this );

			if( $t.data( pluginName ) ){
				return;
			}

			new Table( this );
		});
	};

	var $doc = $( win.document );
	$doc.on( "enhance.tablesaw", function( e ) {
		// Cut the mustard
		if( Tablesaw.mustard ) {
			$( e.target ).find( initSelector ).filter( initFilterSelector )[ pluginName ]();
		}
	});

	// Avoid a resize during scroll:
	// Some Mobile devices trigger a resize during scroll (sometimes when
	// doing elastic stretch at the end of the document or from the 
	// location bar hide)
	var isScrolling = false;
	var scrollTimeout;
	$doc.on( "scroll.tablesaw", function() {
		isScrolling = true;

		win.clearTimeout( scrollTimeout );
		scrollTimeout = win.setTimeout(function() {
			isScrolling = false;
		}, 300 ); // must be greater than the resize timeout below
	});

	var resizeTimeout;
	$( win ).on( "resize", function() {
		if( !isScrolling ) {
			win.clearTimeout( resizeTimeout );
			resizeTimeout = win.setTimeout(function() {
				$doc.trigger( events.resize );
			}, 150 ); // must be less than the scrolling timeout above.
		}
	});

}());
