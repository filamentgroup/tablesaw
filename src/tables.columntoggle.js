/*
* tablesaw: A set of plugins for responsive tables
* Column Toggle: allows the user to toggle which columns are visible.
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function(){

	var data = {
		key: "tablesaw-coltoggle"
	};

	var ColumnToggle = function( element ) {

		this.$table = $( element );

		if( !this.$table.length ) {
			return;
		}

		this.tablesaw = this.$table.data( "tablesaw" );

		this.attributes = {
			subrow: "data-tablesaw-subrow",
			ignorerow: "data-tablesaw-ignorerow"
		};

		this.classes = {
			columnToggleTable: 'tablesaw-columntoggle',
			columnBtnContain: 'tablesaw-columntoggle-btnwrap tablesaw-advance',
			columnBtn: 'tablesaw-columntoggle-btn tablesaw-nav-btn down',
			popup: 'tablesaw-columntoggle-popup',
			priorityPrefix: 'tablesaw-priority-',
			// TODO duplicate class, also in tables.js
			toolbar: 'tablesaw-bar'
		};

		this.$headers = this.tablesaw._getPrimaryHeaderCells();

		this.$table.data( data.key, this );
	};

	ColumnToggle.prototype.init = function() {

		if( !this.$table.length ) {
			return;
		}

		var tableId,
			id,
			$menuButton,
			$popup,
			$menu,
			$btnContain,
			self = this;

		this.$table.addClass( this.classes.columnToggleTable );

		tableId = this.$table.attr( "id" );
		id = tableId + "-popup";
		$btnContain = $( "<div class='" + this.classes.columnBtnContain + "'></div>" );
		$menuButton = $( "<a href='#" + id + "' class='btn btn-micro " + this.classes.columnBtn +"' data-popup-link>" +
										"<span>" + Tablesaw.i18n.columnBtnText + "</span></a>" );
		$popup = $( "<div class='dialog-table-coltoggle " + this.classes.popup + "' id='" + id + "'></div>" );
		$menu = $( "<div class='btn-group'></div>" );

		var hasNonPersistentHeaders = false;
		var notToggleableColumnCount = 0;
		this.$headers.each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = self.$getCells( this );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );

				$("<label><input type='checkbox' checked>" + $this.text() + "</label>" )
					.appendTo( $menu )
					.children()
					.first()
					.data( "tablesaw-header", this );

				hasNonPersistentHeaders = true;
			} else {
				notToggleableColumnCount++;
			}
		});

		if( !hasNonPersistentHeaders ) {
			$menu.append( '<label>' + Tablesaw.i18n.columnsDialogError + '</label>' );
		}

		$menu.appendTo( $popup );

		// bind change event listeners to inputs - TODO: move to a private method?
		$menu.find( 'input[type="checkbox"]' ).on( "change", function(e) {
			var checked = e.target.checked;

			var header = self.getHeaderFromCheckbox( e.target );
			var $cells = self.$getCells( header );

			$cells[ !checked ? "addClass" : "removeClass" ]( "tablesaw-cell-hidden" );
			$cells[ checked ? "addClass" : "removeClass" ]( "tablesaw-cell-visible" );

			self.updateColspanIgnoredRows( checked );

			self.$table.trigger( 'tablesawcolumns' );
		});

		$menuButton.appendTo( $btnContain );
		$btnContain.appendTo( this.$table.prev().filter( '.' + this.classes.toolbar ) );


		function closePopup( event ) {
			// Click came from inside the popup, ignore.
			if( event && $( event.target ).closest( "." + self.classes.popup ).length ) {
				return;
			}

			$( document ).off( 'click.' + tableId );
			$menuButton.removeClass( 'up' ).addClass( 'down' );
			$btnContain.removeClass( 'visible' );
		}

		var closeTimeout;
		function openPopup() {
			$btnContain.addClass( 'visible' );
			$menuButton.removeClass( 'down' ).addClass( 'up' );

			$( document ).off( 'click.' + tableId, closePopup );

			window.clearTimeout( closeTimeout );
			closeTimeout = window.setTimeout(function() {
				$( document ).on( 'click.' + tableId, closePopup );
			}, 15 );
		}

		$menuButton.on( "click.tablesaw", function( event ) {
			event.preventDefault();

			if( !$btnContain.is( ".visible" ) ) {
				openPopup();
			} else {
				closePopup();
			}
		});

		$popup.appendTo( $btnContain );

		this.$menu = $menu;

		$(window).on( Tablesaw.events.resize + "." + tableId, function(){
			self.refreshToggle( notToggleableColumnCount );
		});

		this.refreshToggle( notToggleableColumnCount );
	};

	ColumnToggle.prototype.updateColspanIgnoredRows = function( newColspanValue ) {
		this.$table.find( "[" + this.attributes.subrow + "],[" + this.attributes.ignorerow + "]" ).each(function() {
			var $td = $( this ).find( "td[colspan]" ).eq( 0 );

			if( newColspanValue === true || newColspanValue === false ) {
				newColspanValue = parseInt( $td.attr( "colspan" ), 10 ) + ( newColspanValue ? 1 : -1 )
			}

			// TODO add a colstart param so that this more appropriately selects colspan elements based on the column being hidden.
			$td.attr( "colspan", newColspanValue );
		});
	};

	ColumnToggle.prototype.$getCells = function( th ) {
		var self = this;
		return $( th ).add( th.cells ).filter(function() {
			// no subrows
			var $row = $( this ).parent();
			return !$row.is( "[" + self.attributes.subrow + "],[" + self.attributes.ignorerow + "]" );
		});
	};

	ColumnToggle.prototype.getHeaderFromCheckbox = function( checkbox ) {
		return $( checkbox ).data( "tablesaw-header" );
	};

	ColumnToggle.prototype.refreshToggle = function( notToggleableColumnCount ) {
		var self = this;
		var visibleColumns = notToggleableColumnCount;
		this.$menu.find( "input" ).each( function() {
			var header = self.getHeaderFromCheckbox( this );
			var isVisible = self.$getCells( header ).eq( 0 ).css( "display" ) === "table-cell";
			this.checked = isVisible;
			
			if( isVisible ) {
				visibleColumns++;
			}
		});

		this.updateColspanIgnoredRows( visibleColumns );
	};

	ColumnToggle.prototype.destroy = function() {
		this.$table.removeClass( this.classes.columnToggleTable );
		this.$table.find( 'th, td' ).each(function() {
			var $cell = $( this );
			$cell.removeClass( 'tablesaw-cell-hidden' )
				.removeClass( 'tablesaw-cell-visible' );

			this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
		});
	};

	// on tablecreate, init
	$( document ).on( Tablesaw.events.create, function( e, tablesaw ){

		if( tablesaw.mode === 'columntoggle' ){
			var table = new ColumnToggle( tablesaw.table );
			table.init();
		}

	} );

	$( document ).on( Tablesaw.events.destroy, function( e, tablesaw ){
		if( tablesaw.mode === 'columntoggle' ){
			$( tablesaw.table ).data( data.key ).destroy();
		}
	} );

}());