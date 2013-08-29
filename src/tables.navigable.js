/*
* navigable Tables
* Copyright (c) 2013 Filament Group, Inc.
* Licensed under MIT
*/

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

	$( document ).on( "enhance", function() {
		var $tables = $( Nav.selectors.init );

		if( $tables.length ) {
			Nav.featureTests.disabledFocusable();
		}

		$tables.each( Nav.init );
	});


}( this, jQuery ));
