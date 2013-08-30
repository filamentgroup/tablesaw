/*! Tablesaw - v0.1.0 - 2013-08-29
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2013 Zach Leatherman; Licensed MIT */
// DOM-ready auto-init of plugins.
// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
(function( $ ){
	$( function(){
		$( document ).trigger( "enhance.tablesaw" );
	});
}( jQuery ));
(function( $ ) {
	var o = {
		pluginName : "table",
		classes : {
			table : "objl-table",
			reflowTable: "ui-table-reflow",
			cellLabels: "ui-table-cell-label",
			popup: "ui-table-columntoggle-popup",
			columnBtnContain: "ui-table-columntoggle-btnwrap table-advance",
			columnBtn: "ui-table-columntoggle-btn ui-table-nav-btn",
			priorityPrefix: "ui-table-priority-",
			columnToggleTable: "ui-table-columntoggle",
			collapsibleCell: "ui-table-cell-collapsible",
			collapsibleRow: "ui-table-row-collapsible",
			dialogClass: "",
			toolbar: "ui-table-bar"
		},
		events: {
			create: "tablecreate",
			destroy: "tabledestroy"
		},
		columnBtnText: "Columns",
		mode: "reflow",
		initSelector : "table",
		columnBtnSide: "right"
	},
	methods = {
		_create: function() {
			var self = this,
				$table = $(this);

			if( $(this).is( "[data-exclude]" ) ) {
				return;
			}

			// override the mode if defined (this could be broader if needed)
			if( $(this).is( "[data-mode]" ) ){
				o.mode = $(this).attr( "data-mode" );
			}

			if( $table.is( "[data-column-btn-side]" ) ){
				o.columnBtnSide = $table.attr( "data-column-btn-side" );
			}

			if( $table.is( "[data-dialog-class]" ) ){
				o.classes.dialogClass = $table.attr( "data-dialog-class" );
			}

			var thrs = this.querySelectorAll( "thead tr" ),
				trs = this.querySelectorAll( "tbody tr" );

			$table.addClass( o.classes.table );

			// Insert the toolbar
			var $toolbar = $table.prev( '.' + o.classes.toolbar );
			if( !$toolbar.length ) {
				$toolbar = $( '<div>' )
					.addClass( o.classes.toolbar )
					.insertBefore( $table );
			}

			if( o.mode ) {
				$toolbar.addClass( 'mode-' + o.mode );
			}

			// Expose headers and allHeaders properties on the widget
			// headers references the THs within the first TR in the table
			this.headers = $table.find( "tr:first > th" );
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.querySelectorAll( "th" );

			$( thrs ).each( function(){
				var coltally = 0;

				$( this ).children().each( function(){
					var span = parseInt( this.getAttribute( "colspan" ), 10 ),
						sel = ":nth-child(" + ( coltally + 1 ) + ")";

					self.colstart = coltally + 1;

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

			$( trs ).each( function(){
				var row = $( this );
				if( row.is( "[data-collapsible-row]" ) ){

					row.addClass( o.classes.collapsibleRow );
					row.on( "click" , _handleCollapse );

					row.children().each( function(){
						var cell = $( this );
						if( cell.is( "[data-collapsible-cell]" ) ){
							cell.addClass( o.classes.collapsibleCell );
						}
					});
				}
			});

			if( o.mode === "reflow" ){
				$table[ o.pluginName ]( "reflow", self );
			}
			else if ( o.mode === "columntoggle" ){
				$table[ o.pluginName ]( "columntoggle", self );
			}
			$table.trigger( o.events.create, [ o.mode ] );
		},

		destroy: function() {
			var $t = $( this );
			$t.removeAttr( 'data-mode' );
			$t.removeClass( o.classes.table );

			// reflow
			$t.removeClass( o.classes.reflowTable );
			$t.find( '.' + o.classes.cellLabels ).remove();

			// columntoggle
			$t.removeClass( o.classes.columnToggleTable );
			$t.find( 'th, td' ).each(function() {
				var $cell = $( this );
				$cell.removeClass( 'ui-table-cell-hidden' )
					.removeClass( 'ui-table-cell-visible' );

				this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
			});

			// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
			$t.prev( '.' + o.classes.toolbar ).each(function() {
				this.className = this.className.replace( /\bmode\-\w*\b/gi, '' );
			});

			$( window ).off( 'resize.' + $t.attr( 'id' ) );

			// other plugins
			$t.trigger( o.events.destroy );

			$t.removeData( o.pluginName + 'active' );
		},

		reflow: function( self ) {
			var table = this,
				setClass = this.getAttribute( "class" ) + " " + o.classes.reflowTable;

			// If it's not reflow mode, return here.
			if( o.mode !== "reflow" ){
				return;
			}

			table.setAttribute( "class", setClass );

			// get headers in reverse order so that top-level headers are appended last

			var reverseHeaders = $( this.allHeaders );

			// create the hide/show toggles
			reverseHeaders.each(function(){
				var $cells = $( this.cells ),
					colstart = self.colstart,
					hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " ui-table-cell-label-top",
					text = $(this).text();

				if( text !== ""  ){

					if( hierarchyClass ){
						var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
							filter = "";

						if( iteration ){
							filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
						}
						$cells.filter( filter ).prepend( "<b class='" + o.classes.cellLabels + hierarchyClass + "'>" + text + "</b>"  );
					}
					else {
						$cells.prepend( "<b class='" + o.classes.cellLabels + "'>" + text + "</b>"  );
					}
				}
			});
		},

		columntoggle: function(){


			var tableId,
				id,
				$menuButton,
				$popup,
				$menu,
				$btnContain,
				$table = $( this ),
				self = this,
				menuInputChange = function(e) {
					var checked = e.target.checked;

					$( e.target ).data( "cells" )
						.toggleClass( "ui-table-cell-hidden", !checked )
						.toggleClass( "ui-table-cell-visible", checked );

					$table.trigger( 'tablecolumns' );
				};

			// assign an id if there is none
			if ( !$table.attr( "id" ) ) {
				$table.attr( "id", o.pluginName + "-" + Math.round( Math.random() * 10000 ) );
			}

			$table.addClass( o.classes.columnToggleTable );

			tableId = $table.attr( "id" );
			id = tableId + "-popup";
			$btnContain = $( "<div class='" + o.classes.columnBtnContain + " " + o.columnBtnSide + " " + o.classes.dialogClass + "'></div>" );
			$menuButton = $( "<a href='#" + id + "' class='btn btn-micro " + o.classes.columnBtn +"' data-popup-link>" +
											"<span>" + o.columnBtnText + "</span></a>" );
			$popup = $( "<div class='fgdialog dialog-table-coltoggle " + o.classes.popup + "' id='" + id + "'></div>" );
			$menu = $( "<div class='btn-group'></div>" );

			$(this.headers).not( "td" ).each( function() {
				var $this = $( this ),
					priority = $this.attr("data-priority"),
					$cells = $this.add( this.cells );

				if( priority && priority !== "persist" ) {
					$cells.addClass( o.classes.priorityPrefix + priority );

					$("<label class='btn btn-check btn-checkbox btn-selected theme-simple'><input type='checkbox' checked>" + $this.text() + "</label>" )
						.appendTo( $menu )
						.btn()
						.children( 0 )
						.data( "cells", $cells );
				}
			});

			$menu.appendTo( $popup );

			// bind change event listeners to inputs - TODO: move to a private method?
			$menu.on( "change", menuInputChange );

			$menuButton.appendTo( $btnContain );

			$btnContain.appendTo( $table.prev( '.' + o.classes.toolbar ) );

			$popup
				.appendTo( $btnContain )
				.dialog( true );


			// refresh method

			$(window).on( "resize." + tableId, function(){
				$table[ o.pluginName ]( "refreshToggle", self );
			} );

			$.extend( this, {
				_menu: $menu,
				_menuInputChange: menuInputChange
			});

			$(this)[ o.pluginName ]( "refreshToggle", self );
		},

		refreshPriority: function(){
			$(this.headers).not( "td" ).each( function() {
				var $this = $( this ),
					priority = $this.attr("data-priority"),
					$cells = $this.add( this.cells );

				if( priority && priority !== "persist" ) {
					$cells.addClass( o.classes.priorityPrefix + priority );
				} else {
					$cells.each(function() {
						// remove all priority classes.
						this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
					});
				}
			});
		},

		refreshToggle: function(){
			this._menu.find( "input" ).each( function() {
				var $this = $( this );

				this.checked = $this.data( "cells" ).eq( 0 ).css( "display" ) === "table-cell";

				$this.parent()[ this.checked ? "addClass" : "removeClass" ]( "btn-selected" );
			});
		}

	},
	_handleCollapse = function(){
		var row = $( this );
		row.toggleClass( "open" );
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

;(function( win, $ ){

	var Nav = {
		selectors: {
			init: 'table.ui-table-navigable',
			editableFields: 'tbody input, tbody select'
		},
		attrs: {
			mode: 'data-navigable-mode',
			initial: 'data-initial-val',
			undoValue: 'navigable-value'
		},
		modes: {
			edit: 'edit'
		},
		events: {
			change: "onchange.tablesNavigable",
			edit: 'ui-table-navigable-edit',
			editFocus: 'ui-table-navigable-edit-focus',
			editBlur: 'ui-table-navigable-edit-blur'
		},
		classes: {
			activeCell: 'ui-table-active-cell',
			editMode: "edit",
			arrowUp: "icon-arrow-change-up-sm",
			arrowDown: "icon-arrow-change-down-sm",
			reverse: "ui-table-col-reverse"
		},
		featureTests: {
			isDisabledFocusableWithoutBlur: null,
			disabledFocusable: function() {
				if( Nav.featureTests.isDisabledFocusableWithoutBlur !== null ) {
					return;
				}

				var focusFired = false,
					previousActiveElement = document.activeElement,
					$el;

				$el = $( '<input type="text">' )
					.css({
						position: 'absolute',
						left: -9999,
						top: -9999
					})
					.appendTo( document.body )
					.on('focus', function() {
						$( this ).attr( 'disabled', 'disabled' );
						if( this === document.activeElement ) {
							focusFired = true;
						}
					})
					.on('blur', function() {
						// this fires async
						Nav.featureTests.isDisabledFocusableWithoutBlur = false;
					})
					.trigger('focus');

				// If we don’t setTimeout this, Chrome won’t fire the blur.
				window.setTimeout(function() {
					$el.remove();
				}, 15);

				if( previousActiveElement) {
					previousActiveElement.focus();
				}
				Nav.featureTests.isDisabledFocusableWithoutBlur = focusFired;
			}
		},
		moveDownARow: function( el ) {
			Nav.moveVertical( el, false );
		},
		moveUpARow: function( el ) {
			Nav.moveVertical( el, true );
		},
		moveVertical: function( el, moveUp ) {
			var $cell = $( el ).closest( 'td' ),
				$row = $cell.closest( 'tr' )[ moveUp ? 'prev' : 'next' ]( 'tr' ),
				$input,
				input,
				index = $cell.index(),
				docElem = win.document.documentElement,
				body = win.document.body,
				scroll = "pageYOffset" in win ? win.pageYOffset : ( docElem.scrollY || docElem.scrollTop || ( body && body.scrollY ) || 0 ),
				winHeight = $( window ).height(),
				offset,
				isOffscreen;

			while( $row && $row.length ) {
				$input = $row.find( 'td, th' ).eq( index ).find( 'input, select' );
				if( $input ) {
					offset = $input.offset().top;
					isOffscreen = offset < scroll || ( offset + $input.closest( 'td, th' ).height() ) > ( scroll + winHeight );

					$input.focus();
					input = $input.get( 0 );
					if( input.scrollIntoView && isOffscreen ) {
						input.scrollIntoView();
					}
					break;
				}
				$row = $row.prev( 'tr' );
			}
		},
		moveLeft: function( el ) {
			$( el ).closest( 'td' ).prevAll( 'td' ).filter( ":visible" ).find( 'input,select' ).eq( -1 ).focus();
		},
		moveRight: function( el ) {
			$( el ).closest( 'td' ).nextAll( 'td' ).filter( ":visible" ).find( 'input,select' ).eq( 0 ).focus();
		},
		onkeyNavigationMode: function( event ) {
			var charCode = event.which;

			if( charCode >= 37 && charCode <= 40 ) {
				event.preventDefault();
			}

			switch( charCode ) {
				case 37: // LEFT
					Nav.moveLeft( this );
					break;
				case 39: // RIGHT
					Nav.moveRight( this );
					break;
				case 38: // UP
					Nav.moveUpARow( this );
					break;
				case 40: // DOWN
					Nav.moveDownARow( this );
					break;
			}
		},
		onkeyEditModeDelete: function( event ) {
			if( this.tagName === 'SELECT' && event.which === 8 ) {
				event.preventDefault();
			}
		},
		onkeyNavigate: function( event ) {
			var code = event.keyCode || event.which,
				$target = $( event.target ),
				$table,
				isEditMode;

			if( code === 13 || code === 9 ) { // ENTER or TAB
				$table = $target.closest( "table" );
				isEditMode = $table.attr( Nav.attrs.mode ) === Nav.modes.edit;

				if( isEditMode || event.shiftKey ) {
					// Enter navigation mode
					$table.removeAttr( Nav.attrs.mode, Nav.modes.edit );
				}
			}

			if( code === 13 ) { // ENTER
				if( isEditMode || event.shiftKey ) {
					if( event.shiftKey ) {
						Nav.moveUpARow( event.target );
					} else {
						Nav.moveDownARow( event.target );
					}
				} else {
					Nav.forceEditMode( $table, $target );
				}

				event.preventDefault();
			}
		},
		onkeyStartEdit: function( event ) {
			var $t = $( this ),
				act = function( callback ){
					event.preventDefault();
					$table = $t.closest( "table" );
					$table.attr( Nav.attrs.mode, Nav.modes.edit );
					if( callback ){
						callback();
					}
					$t.focus();
					$t[0].selectionStart = $t[0].selectionEnd = $t.val().length;
				},
				$table,
				charac;

			if( event.keyCode ){
				charac = event.keyCode;
			} else if( event.which ){
				charac = event.which;
			}

			if( !event.altKey && !event.metaKey ) {
				if( charac > 47 && charac < 91 ){
					$t.data( Nav.attrs.undoValue, $t.val() );
					act(function(){
						$t.val( String.fromCharCode( charac ) );
					});
				} else if( charac === 8 || charac === 46 ){
					event.stopPropagation();
					act(function(){
						$t.val("");
					});
				}
			}
		},
		onkeyEditModeEsc: function( event ) {
			var $t, $table, charac;

			if( event.keyCode ){
				charac = event.keyCode;
			} else if( event.which ){
				charac = event.which;
			}

			if( charac === 27 ) { // ESC
				$t = $( this );
				$t.val( $t.data( Nav.attrs.undoValue ) );
				$t.trigger( 'blur' );
				$table = $t.closest( "table" );
				Nav.clearActiveCell( Nav.getActiveCell( $table ) );

				$table.removeAttr( Nav.attrs.mode );
				$t.trigger( 'focus' );
			}
		},
		onchangeEditMode: function(){
			var $t = $( this ),
				$cell = $t.closest( "th,td" ),
				initial = parseFloat( $cell.attr( Nav.attrs.initial ), 10 ),
				val = parseFloat( $t.val(), 10),
				min = $t.attr( "min" ),
				max = $t.attr( "max" );

			if( Nav.isError( val, min, max ) ){
				$cell.nope();
			} else {
				$t.trigger( Nav.events.change, [ initial, val ] );
			}
		},
		changeArrow: function( $cell, initial, val ){
			var _changeArrowDown = function(){
				$cell.removeClass( Nav.classes.arrowUp );
				$cell.addClass( Nav.classes.arrowDown );
				$cell.removeClass( "error" );
			},
			_changeArrowUp = function(){
				$cell.addClass( Nav.classes.arrowUp );
				$cell.removeClass( Nav.classes.arrowDown );
				$cell.removeClass( "error" );
			},
			_removeArrow = function(){
				$cell.removeClass( Nav.classes.arrowUp );
				$cell.removeClass( Nav.classes.arrowDown );
				$cell.removeClass( "error" );
			};

			var temp;
			if( $cell.hasClass( Nav.classes.reverse ) ){
				temp = initial;
				initial = val;
				val = temp;
			}

			if( initial > val ){
				_changeArrowDown();
			} else if( val > initial ){
				_changeArrowUp();
			} else {
				_removeArrow();
			}
		},
		isError: function( val, min, max ){
			var error = false;
			if( isNaN( val ) || ( min && val < min ) || ( max && val > max )){
				error = true;
			}
			return error;
		},
		addInitialVals: function( fields ){
			$.each( fields, function( idx, el ){
				var $el = $( el ),
					cell = $el.closest( "th,td" ),
					val = $el.val();
				cell.attr( Nav.attrs.initial, val );
			});
		},
		getActiveCell: function( el ) {
			return $( el ).closest( 'table' ).find( '.' + Nav.classes.activeCell );
		},
		clearActiveCell: function( cell ) {
			var $cell = $( cell );
			if( $cell.is( '.' + Nav.classes.editMode ) ) {
				$cell.trigger( Nav.events.editBlur );
			}
			$cell.removeClass( Nav.classes.activeCell + " " + Nav.classes.editMode );
		},
		forceEditMode: function( $table, $input ) {
			$table.attr( Nav.attrs.mode, Nav.modes.edit );

			$input.data( Nav.attrs.undoValue, $input.val() )
				.trigger( Nav.events.edit );

			var input = $input.get( 0 );
			if( input.select ) {
				input.select();
			}
			if( input.setSelectionRange ) {
				input.setSelectionRange( 0, 9999 );
			}
		},
		markReverse: function(){
			var heads = this.headers;
			$.each( heads, function( idx, el ){
				var cells;
				if( $( el ).is( "[data-reverse]" ) ){
					cells = this.cells;
					$( cells ).addClass( Nav.classes.reverse );
				}
			});
		},
		init: function() {
			var $table = $( this ),
				$fields = $table.find( Nav.selectors.editableFields ),
				activeCellTimeout,
				clicksWithoutFocus = 0;

			Nav.markReverse.call( this );
			Nav.addInitialVals( $fields );

			$( win.document ).bind( Nav.events.change, function( event, initial, val ) {
				var $cell = $( event.target ).closest( 'th, td' );
				Nav.changeArrow( $cell, initial, val );
			});

			$table.on( 'dblclick click', 'td', function( event ) {
				var $cell = $( this ).closest( 'th, td' ),
					$input = $cell.find( 'input, select' );

				if( $input.length ) {
					if( event.type === 'dblclick' || 'ontouchend' in window ) {
						$table.attr( Nav.attrs.mode, Nav.modes.edit );
					}

					if( 'ontouchend' in window && $input.is( 'input' ) ) {
						Nav.forceEditMode( $table, $input );
						return;
					}

					// DoubleFocus:
					// When focus is already on the input and you click again, focus doesn’t refire.
					// But it needs to be tracked to handle the click-on-active-cell in navigation mode
					// to activate edit mode.
					if( event.type === 'click' && event.target.tagName === 'INPUT' ) {
						$cell.data( 'activeFocus', true );

						if( clicksWithoutFocus > 0 ) {
							$input.trigger( Nav.events.edit );
						}
					} else {
						$input.trigger( 'focus' );
					}
					$input.data( Nav.attrs.undoValue, $input.val() );

					// DoubleFocus:
					if( event.type === 'click' ) {
						clicksWithoutFocus++;
					}
				}
			}).on( 'focus ' + Nav.events.edit, Nav.selectors.editableFields, function() {
					var $t = $( this ),
						$cell = $t.closest( 'th, td' ),
						forceEditMode = false,
						$activeCell = Nav.getActiveCell( $t );

					window.clearTimeout( activeCellTimeout );
					if( $cell[ 0 ] === $activeCell[ 0 ] ) {
						$table.attr( Nav.attrs.mode, Nav.modes.edit );
						forceEditMode = true;
					} else {
						Nav.clearActiveCell( $activeCell );
						$cell.addClass( Nav.classes.activeCell );
					}

					$t.unbind( 'keydown', Nav.onkeyNavigate )
						.bind( 'keydown', Nav.onkeyNavigate );

					if( forceEditMode || $table.attr( Nav.attrs.mode ) === Nav.modes.edit ) {
						$cell.removeClass( 'proxied' );
						$cell.find( '.proxy' ).remove();

						// Prepare input for Edit mode
						$t.removeAttr( 'readonly' )
							.unbind( 'keydown', Nav.onkeyNavigationMode )
							.unbind( 'keydown', Nav.onkeyStartEdit )
							.bind( 'keydown', Nav.onkeyEditModeEsc )
							.bind( 'keydown', Nav.onkeyEditModeDelete )
							.bind( 'keyup', Nav.onchangeEditMode );
						$cell.addClass( Nav.classes.editMode );
						$t.trigger( Nav.events.editFocus );
					} else {
						// Prepare input for Navigation mode

						$t.attr( 'readonly', 'readonly' )
							.unbind( 'keydown', Nav.onkeyEditModeEsc )
							.unbind( 'keydown', Nav.onkeyEditModeDelete )
							.unbind( 'keyup', Nav.onchangeEditMode )
							.bind( 'keydown', Nav.onkeyNavigationMode )
							.bind( 'keydown', Nav.onkeyStartEdit );

						if( $cell.is( '.' + Nav.classes.editMode ) ) {
							$t.trigger( Nav.events.editBlur );
						}
						$cell.removeClass( Nav.classes.editMode );

						// The short-term addition of disabled kills the cursor
						// and default selection behavior.

						if( Nav.featureTests.isDisabledFocusableWithoutBlur ) {
							$t.attr( 'disabled', 'disabled' );

							window.setTimeout( function() {
								$t.removeAttr( 'disabled' );
							}, 15 );
						// Make sure the form element is one capable of text selection
						} else if( 'setSelectionRange' in this ) {
							var $proxy,
								val = this.value;

							$cell.addClass( 'proxied' );
							$proxy = $cell.find( '.proxy' );
							if( !$proxy.length ) {
								$proxy = $( '<div>' ).addClass( 'proxy' );
								$cell.append( $proxy );
							}
							$proxy.css( 'right', $cell.css('padding-right') ).html( val );
						}
						// else: form element has selected text when tabbed into.
					}
				}).on( 'blur', Nav.selectors.editableFields, function() {
					var $t = $( this ),
						$cell = $t.closest( 'th, td' );
					$t.removeAttr( 'readonly' )
						.unbind( 'keydown' )
						.unbind( 'keyup' );

					// DoubleFocus:
					$cell.data( 'activeFocus', false );
					clicksWithoutFocus = 0;

					// Remove any proxy labels
					$cell.removeClass( 'proxied' );
					$cell.find( '.proxy' ).remove();

					// Remove any dialogs from the hash
					if( win.location.hash.indexOf("d-") === 1 ){
						win.history.back();
					}

					// This timeout is used as a fallback,
					// in case we aren’t focusing to a new field.
					activeCellTimeout = window.setTimeout(function() {
						var $cell = Nav.getActiveCell( $t );
						Nav.clearActiveCell( $cell );

						if( !$( document.activeElement ).closest( 'table' ).is( $table ) ) {
							$table.removeAttr( Nav.attrs.mode );
						}
					}, 200 );
				});
		}
	};

	$( document ).on( "enhance.tablesaw", function() {
		var $tables = $( Nav.selectors.init );

		if( $tables.length ) {
			Nav.featureTests.disabledFocusable();
		}

		$tables.each( Nav.init );
	});


}( this, jQuery ));

(function( win, $, undefined ){


	function createSwipeTable( $table ){

		var $btns = $( "<div class='table-advance'></div>" ),
			$prevBtn = $( "<a href='#' class='ui-table-nav-btn btn btn-micro left' title='Previous Column'></a>" ).appendTo( $btns ),
			$nextBtn = $( "<a href='#' class='ui-table-nav-btn btn btn-micro right' title='Next Column'></a>" ).appendTo( $btns ),
			hideBtn = 'disabled',
			persistWidths = 'table-fix-persist',
			$headerCells = $table.find( "thead th" ),
			$headerCellsNoPersist = $headerCells.not( '[data-priority="persist"]' ),
			headerWidths = [],
			$head = $( document.head || 'head' ),
			tableId = $table.attr( 'id' );

		// Calculate initial widths
		$table.css('width', 'auto');
		$headerCells.each(function() {
			headerWidths.push( $( this ).outerWidth() );
		});
		$table.css( 'width', '' );

		$btns.appendTo( $table.prev( '.ui-table-bar' ) );

		$table.addClass( "table-coltoggle-swipe" );

		if( !tableId ) {
			tableId = 'tableswipe-' + Math.round( Math.random() * 10000 );
			$table.attr( 'id', tableId );
		}

		function $getCells( headerCell ) {
			return $( headerCell.cells ).add( headerCell );
		}

		function showColumn( headerCell ) {
			$getCells( headerCell ).removeClass( 'ui-table-cell-hidden' );
		}

		function hideColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'ui-table-cell-hidden' );
		}

		function persistColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'ui-table-cell-persist' );
		}

		function isPersistent( headerCell ) {
			return $( headerCell ).is( '[data-priority="persist"]' );
		}

		function unmaintainWidths() {
			$table.removeClass( persistWidths );
			$( '#' + tableId + '-persist' ).remove();
		}

		function maintainWidths() {
			var prefix = '#' + tableId + ' ',
				styles = [],
				tableWidth = $table.width();

			$headerCells.each(function( index ) {
				var width;
				if( isPersistent( this ) ) {
					width = $( this ).width();

					// Don’t persist greedy columns (take up more than 75% of table width)
					if( width < tableWidth * 0.75 ) {
						styles.push( prefix + ' .ui-table-cell-persist:nth-child(' + ( index + 1 ) + ') { width: ' + width + 'px; }' );
					}
				}
			});

			unmaintainWidths();
			$table.addClass( persistWidths );
			$head.append( $( '<style>' ).attr( 'id', tableId + '-persist' ).html( styles.join( "\n" ) ) );
		}

		function getNext(){
			var next = [],
				checkFound;

			$headerCellsNoPersist.each(function( i ) {
				var $t = $( this ),
					isHidden = $t.css( "display" ) === "none";

				if( !isHidden && !checkFound ) {
					checkFound = true;
					next[ 0 ] = i;
				} else if( isHidden && checkFound && !next[ 1 ] ) {
					next[ 1 ] = i;
				}
			});

			return next;
		}

		function getPrev(){
			var next = getNext();
			return [ next[ 1 ] - 1 , next[ 0 ] - 1 ];
		}

		function nextpair( fwd ){
			return fwd ? getNext() : getPrev();
		}

		function canAdvance( pair ){
			return pair[ 1 ] > -1 && pair[ 1 ] < $headerCellsNoPersist.length;
		}

		function fakeBreakpoints() {
			var extraPaddingPixels = 20,
				containerWidth = $table.parent().width(),
				sum = 0;

			$headerCells.each(function( index ) {
				var $t = $( this ),
					isPersist = $t.is( '[data-priority="persist"]' );
				sum += headerWidths[ index ] + ( isPersist ? 0 : extraPaddingPixels );

				if( isPersist ) {
					// for visual box-shadow
					persistColumn( this );
					return;
				}

				if( sum > containerWidth ) {
					hideColumn( this );
				} else {
					showColumn( this );
				}

			});

			unmaintainWidths();
			$table.trigger( 'tablecolumns' );
		}

		function advance( fwd ){
			var pair = nextpair( fwd );
			if( canAdvance( pair ) ){
				if( isNaN( pair[ 0 ] ) ){
					if( fwd ){
						pair[0] = 0;
					}
					else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				maintainWidths();

				hideColumn( $headerCellsNoPersist.get( pair[ 0 ] ) );
				showColumn( $headerCellsNoPersist.get( pair[ 1 ] ) );

				$table.trigger( 'tablecolumns' );
			}
		}

		$prevBtn.add( $nextBtn ).click(function( e ){
			advance( !!$( e.target ).closest( $nextBtn ).length );
			e.preventDefault();
		});

		$table
			.bind( "touchstart.swipetoggle", function( e ){
				var origin = ( e.touches || e.originalEvent.touches )[ 0 ].pageX,
					x,
					drag;

				$table.addClass( "table-noanimate" );

				$( this )
					.bind( "touchmove", function( e ){
						x = ( e.touches || e.originalEvent.touches )[ 0 ].pageX;
						drag = x - origin;
						if( drag < -30 ){
							drag = -30;
						}
						if( drag > 30 ){
							drag = 30;
						}

						//$table.css( { "position": "relative", "left": drag + "px" } );
					})
					.bind( "touchend.swipetoggle", function(){
						if( x - origin < 15 ){
							advance( true );
						}
						if( x - origin > -15 ){
							advance( false );
						}

						$( this ).unbind( "touchmove touchend" );
						$table.removeClass( "table-noanimate" );
						//$table.css( "left", "0" );

					});

			})
			.bind( "tablecolumns.swipetoggle", function(){
				$prevBtn[ canAdvance( getPrev() ) ? "removeClass" : "addClass" ]( hideBtn );
				$nextBtn[ canAdvance( getNext() ) ? "removeClass" : "addClass" ]( hideBtn );
			})
			.bind( "tablenext.swipetoggle", function(){
				advance( true );
			} )
			.bind( "tableprev.swipetoggle", function(){
				advance( false );
			} )
			.bind( "tabledestroy.swipetoggle", function(){
				var $t = $( this );

				$t.removeClass( 'table-coltoggle-swipe' );
				$t.prev( '.ui-table-bar' ).find( '.table-advance' ).remove();
				$( win ).off( "resize", fakeBreakpoints );

				$t.unbind( ".swipetoggle" );
			});

		fakeBreakpoints();
		$( win ).on( "resize", fakeBreakpoints );
	}



	// on tablecreate, init
	$( document ).on( "tablecreate", "table", function( e, mode ){

		var $table = $( this );
		if( mode === 'swipe' ){
			createSwipeTable( $table );
		}

	} );

}( this, jQuery ));

(function( $ ) {
	function getSortValue( cell ) {
		return $.map( cell.childNodes, function( el ) {
				var $el = $( el );
				if( $el.is( 'input, select' ) ) {
					return $el.val();
				} else if( $el.hasClass( 'ui-table-cell-label' ) ) {
					return;
				}
				return $.trim( $el.text() );
			}).join( '' );
	}

	var pluginName = "sortable",
		initSelector = "table[data-" + pluginName + "]",
		sortableSwitchSelector = "[data-" + pluginName + "-switch]",
		classes = {
			head: pluginName + "-head",
			ascend: pluginName + "-ascending",
			descend: pluginName + "-descending",
			enhanced: pluginName + "-enhanced",
			switcher: pluginName + "-switch",
			tableToolbar: 'ui-table-toolbar'
		},
		i18n = {
			sort: 'Sort'
		},
		methods = {
			_create: function( o ){
				return $( this ).each(function() {
					var init = $( this ).data( "init" + pluginName );
					if( init ) {
						return false;
					}
					$( this )
						.data( "init"+ pluginName, true )
						.trigger( "beforecreate." + pluginName )
						.addClass( classes.enhanced )
						[ pluginName ]( "_init" , o )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var el = $( this ),
					heads,
					$switcher;

				var addClassToTable = function(){
						el.addClass( pluginName );
					},
					addClassToHeads = function( h ){
						$.each( h , function( i , v ){
							$( v ).addClass( classes.head );
						});
					},
					makeHeadsActionable = function( h , fn ){
						$.each( h , function( i , v ){
							var b = $( "<button />" );
							b.bind( "click" , { col: v } , fn );
							$( v ).wrapInner( b );
						});
					},
					clearOthers = function( sibs ){
						$.each( sibs , function( i , v ){
							var col = $( v );
							col.removeAttr( "data-sortable-default-col" );
							col.removeClass( classes.ascend );
							col.removeClass( classes.descend );
						});
					},
					headsOnAction = function( e ){
						if( $( e.target ).is( 'a[href]' ) ) {
							return;
						}

						e.stopPropagation();
						var head = $( this ).parent(),
							v = e.data.col;
						clearOthers( head.siblings() );
						if( head.hasClass( classes.descend ) ){
							el[ pluginName ]( "sortBy" , v , true);
						} else {
							el[ pluginName ]( "sortBy" , v );
						}
						if( $switcher ) {
							$switcher.find( 'select' ).val( heads.index( head ) ).trigger( 'refresh' );
						}

						e.preventDefault();
					},
					handleDefault = function( heads ){
						$.each( heads , function( idx , el ){
							var $el = $( el );
							if( $el.is( "[data-sortable-default-col]" ) ){
								if( !$el.hasClass( classes.descend ) ) {
									$el.addClass( classes.ascend );
								}
							}
						});
					},
					addSwitcher = function( heads ){
						$switcher = $( '<div>' ).addClass( classes.switcher ).addClass( classes.tableToolbar ).html(function() {
							var html = [ '<label>' + i18n.sort + ':' ];

							html.push( '<span class="btn btn-small">&#160;<select>' );
							heads.each(function( j ) {
								var $t = $( this ),
									isDefaultCol = $t.is( '[data-sortable-default-col]' ),
									isDescending = $t.hasClass( classes.descend ),
									isNumeric = false;

								// Check only the first three rows to see if the column is numbers.
								$( this.cells ).slice( 0, 3 ).each(function() {
									if( !isNaN( parseInt( getSortValue( this ), 10 ) ) ) {
										isNumeric = true;
										return false;
									}
								});

								html.push( '<option' + ( isDefaultCol && !isDescending ? ' selected' : '' ) + ' value="' + j + '_asc">' + $t.text() + ' ' + ( isNumeric ? '↑' : '(A-Z)' ) + '</option>' );
								html.push( '<option' + ( isDefaultCol && isDescending ? ' selected' : '' ) + ' value="' + j + '_desc">' + $t.text() + ' ' + ( isNumeric ? '↓' : '(Z-A)' ) + '</option>' );
							});
							html.push( '</select></span></label>' );

							return html.join('');
						});

						var $toolbar = el.prev( '.ui-table-bar' ),
							$firstChild = $toolbar.children().eq( 0 );

						if( $firstChild.length ) {
							$switcher.insertBefore( $firstChild );
						} else {
							$switcher.appendTo( $toolbar );
						}
						$switcher.find( '.btn' ).btn();
						$switcher.find( 'select' ).on( 'change', function() {
							var val = $( this ).val().split( '_' ),
								head = heads.eq( val[ 0 ] );

							clearOthers( head.siblings() );
							el.sortable( 'sortBy', head.get( 0 ), val[ 1 ] === 'asc' );
						});
					};

					addClassToTable();
					heads = el.find( "thead th[data-" + pluginName + "-col]" );
					addClassToHeads( heads );
					makeHeadsActionable( heads , headsOnAction );
					handleDefault( heads );

					if( el.is( sortableSwitchSelector ) ) {
						addSwitcher( heads, el.find('tbody tr:nth-child(-n+3)') );
					}
			},
			getColumnNumber: function( col ){
				return $( col ).prevAll().length;
			},
			getTableRows: function(){
				return $( this ).find( "tbody tr" );
			},
			sortRows: function( rows , colNum , ascending ){
				var cells, fn, sorted;
				var getCells = function( rows ){
						var cells = [];
						$.each( rows , function( i , r ){
							cells.push({
								cell: getSortValue( r.childNodes[ 2*colNum + 1 ] ),
								rowNum: i
							});
						});
						return cells;
					},
					getSortFxn = function( ascending ){
						var fn;
						if( ascending ){
							fn = function( a , b ){
								if( parseInt( a.cell , 10 )){
									return parseInt( a.cell , 10 ) - parseInt( b.cell, 10 );
								} else {
									return a.cell > b.cell ? 1 : -1;
								}
							};
						} else {
							fn = function( a , b ){
								if( parseInt( a.cell , 10 )){
									return parseInt( b.cell , 10 ) - parseInt( a.cell, 10 );
								} else {
									return a.cell < b.cell ? 1 : -1;
								}
							};
						}
						return fn;
					},
					applyToRows = function( sorted , rows ){
						var newRows = [], i, l, cur;
						for( i = 0, l = sorted.length ; i < l ; i++ ){
							cur = sorted[ i ].rowNum;
							newRows.push( rows[cur] );
						}
						return newRows;
					};

				cells = getCells( rows );
				fn = getSortFxn( ascending );
				sorted = cells.sort( fn );
				rows = applyToRows( sorted , rows );
				return rows;
			},
			replaceTableRows: function( rows ){
				var el = $( this ),
					body = el.find( "tbody" );
				body.html( rows );
			},
			makeColDefault: function( col , a ){
				var c = $( col );
				c.attr( "data-sortable-default-col" , "true" );
				if( a ){
					c.removeClass( classes.descend );
					c.addClass( classes.ascend );
				} else {
					c.removeClass( classes.ascend );
					c.addClass( classes.descend );
				}
			},
			notify: function(){
				//TODO
			},
			sortBy: function( col , ascending ){
				var el = $( this ), colNum, rows;

				colNum = el[ pluginName ]( "getColumnNumber" , col );
				rows = el[ pluginName ]( "getTableRows" );
				rows = el[ pluginName ]( "sortRows" , rows , colNum , ascending );
				el[ pluginName ]( "replaceTableRows" , rows );
				el[ pluginName ]( "makeColDefault" , col , ascending );
				el[ pluginName ]( "notify" );
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg ) {
		var args = Array.prototype.slice.call( arguments , 1),
			returnVal;

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			returnVal = $.fn[ pluginName ].prototype[ arrg ].apply( this[0], args );
			return (typeof returnVal !== "undefined")? returnVal:$(this);
		}
		// check init
		if( !$( this ).data( pluginName + "data" ) ){
			$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this , arrg );
		}
		return $(this);
	};
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

	$( document ).on( "tablecreate", "table", function() {
		if( $( this ).is( initSelector ) ) {
			$( this )[ pluginName ]();
		}
	});

}( jQuery ));

;(function( win, $ ) {

	function featureTest( property, value, noPrefixes ) {
		// Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
		var prop = property + ':',
			el = document.createElement( 'test' ),
			mStyle = el.style;

		if( !noPrefixes ) {
			mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ).slice( 0, -prop.length );
		} else {
			mStyle.cssText = prop + value;
		}
		return mStyle[ property ].indexOf( value ) !== -1;
	}

	var S = {
		selectors: {
			init: '.stickyheaders'
		},
		tests: {
			sticky: featureTest( 'position', 'sticky' ),
			fixed: featureTest( 'position', 'fixed', true )
		},
		// Thanks jQuery!
		getScrollTop: function() {
			var prop = 'pageYOffset',
				method = 'scrollTop';
			return win ? (prop in win) ? win[ prop ] :
				win.document.documentElement[ method ] :
				win.document.body[ method ];
		},
		init: function( table ) {
			var $table = $( table ),
				$headers = $table.find( 'thead' ).eq( 0 ),
				$cloned = $table.next().is( '.stickyclone' ),
				cloned,
				getCellSelector = function( cell ) {
					return cell.tagName + ':eq(' + $( cell ).prevAll().length + ')';
				},
				updateCell = function( $new, $old ) {
					// Warning: on box-sizing: border-box, style.width includes padding (sometimes—not in Firefox). Use clientWidth for more reliable crossbrowser number.
					$new.replaceWith( $old.clone().width( $old.width() + 'px' ) );
				},
				updateClonedHeaders = function() {
					var $clonedHeaders = $cloned.find( 'th' );

					$cloned.width( $table.width() );
					$headers.find( 'th' ).each(function( index ) {

						var $t = $( this ),
							$cell = $clonedHeaders.eq( index );

						if( $t.css( 'display' ) !== 'none' ) {
							updateCell( $cell, $t );
						} else {
							$cell.css( 'display', 'none' );
						}
					});
				};

			if( !$cloned.length ) {
				cloned = document.createElement( 'table' );
				cloned.className = table.className.replace(/\bstickyheaders\b/, '') + ' stickyclone';
				$cloned = $( cloned );
				$cloned.append( $headers.clone() );
				$cloned.on( 'click', function( event ) {
					var $t = $( event.target ),
						parents = [ getCellSelector( event.target ) ],
						cellSelector;

					// This line is to enable default popup behavior
					if( $t.is( 'a[href]' ) ) {
						return;
					}

					// Trigger a click
					$t.parents().each(function() {
						var tn = this.tagName;

						if( tn === 'THEAD' ) {
							return false;
						}
						parents.unshift( getCellSelector( this ) );
						if( tn === 'TH' || tn === 'TD' ) {
							cellSelector = parents;
						}
					});

					$headers.find( parents.join( ' > ' ) ).trigger( event.type );
					updateClonedHeaders();
				});
				$table.after( $cloned );
			}

			function toggle( turnOn ) {
				$cloned[ $cloned.is( '.on' ) ? 'removeClass' : 'addClass' ]( 'on' );

				if( turnOn ) {
					updateClonedHeaders();
				}
			}

			$( win ).bind( 'scroll', function() {
				var offset = $table.offset().top,
					scroll = S.getScrollTop(),
					isAlreadyOn = $cloned.is( '.on' );

				if( !$table.get(0).offsetWidth ) {
					return;
				}

				if( offset > scroll || offset + $table.height() < scroll ) {
					if( isAlreadyOn ) {
						toggle();
					}
				} else {
					if( !isAlreadyOn ) {
						toggle( true );
					}
				}
			}).trigger( 'scroll' );

			$( win ).bind( 'resize', function() {
				if( $cloned.is( '.on' ) ) {
					updateClonedHeaders();
				}
			});
		}
	};

	win.StickyHeaders = S;

	if( !S.tests.sticky && S.tests.fixed ) {
		$( win.document ).on( "enhance.tablesaw" , function(){
			$( S.selectors.init ).each(function() {
				S.init( this );
			});
		});
	}

})( this, jQuery );
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

;(function( win, $ ) {

	var S = {
		selectors: {
			init: 'table[data-mode-switch]'
		},
		attributes: {
			excludeMode: 'data-mode-exclude'
		},
		classes: {
			main: 'ui-table-modeswitch',
			toolbar: 'ui-table-toolbar'
		},
		modes: [ 'reflow', 'swipe', 'columntoggle' ],
		i18n: {
			modes: [ 'Stack', 'Swipe', 'Toggle' ],
			columns: 'Col<span class="a11y-sm">umn</span>s'
		},
		init: function( table ) {
			var $table = $( table ),
				ignoreMode = $table.attr( S.attributes.excludeMode ),
				$toolbar = $table.prev( '.ui-table-bar' ),
				modeVal = '',
				$switcher = $( '<div>' ).addClass( S.classes.main + ' ' + S.classes.toolbar ).html(function() {
					var html = [ '<label>' + S.i18n.columns + ':' ],
						dataMode = $table.attr( 'data-mode' ),
						isSelected;

					html.push( '<span class="btn btn-small">&#160;<select>' );
					for( var j=0, k = S.modes.length; j<k; j++ ) {
						if( ignoreMode && ignoreMode.toLowerCase() === S.modes[ j ] ) {
							continue;
						}

						isSelected = dataMode === S.modes[ j ];

						if( isSelected ) {
							modeVal = S.modes[ j ];
						}

						html.push( '<option' +
							( isSelected ? ' selected' : '' ) +
							' value="' + S.modes[ j ] + '">' + S.i18n.modes[ j ] + '</option>' );
					}
					html.push( '</select></span></label>' );

					return html.join('');
				});

			var $otherToolbarItems = $toolbar.find( '.table-advance' ).eq( 0 );
			if( $otherToolbarItems.length ) {
				$switcher.insertBefore( $otherToolbarItems );
			} else {
				$switcher.appendTo( $toolbar );
			}

			$switcher.find( '.btn' ).btn();
			$switcher.find( 'select' ).bind( 'change', S.onModeChange );
		},
		onModeChange: function() {
			var $t = $( this ),
				$switcher = $t.closest( '.' + S.classes.main ),
				$table = $t.closest( '.ui-table-bar' ).nextUntil( $table ).eq( 0 ),
				val = $t.val();

			$switcher.remove();
			$table.table( 'destroy' );

			$table.attr( 'data-mode', val );
			$table.table();
		}
	};

	$( win.document ).on( "tablecreate", "table", function() {
		if( $( this ).is( S.selectors.init ) ) {
			S.init( this );
		}
	});

})( this, jQuery );