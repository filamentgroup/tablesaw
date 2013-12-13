/*
 * Simple jQuery Dialog
 * https://github.com/filamentgroup/dialog
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Author: @scottjehl
 * Licensed under the MIT, GPL licenses.
 */

(function( w, $ ){
	$.fn.dialog = function( transbg ){

		var pluginName = "dialog",
			cl = {
				open: pluginName + "-open",
				content: pluginName + "-content",
				close: pluginName + "-close",
				bkgd: pluginName + "-background",
				bkgdOpen: pluginName + "-background-open",
				bkgdTrans: pluginName + "-background-trans"
			},
			ev = {
				open: pluginName + "-open",
				close: pluginName + "-close"
			},
			nullHash = "dialog",
			doc = w.document,
			docElem = doc.documentElement,
			body = doc.body,
			$html = $( docElem ),
			$background = $( doc.createElement( 'div' ) ).addClass( cl.bkgd );

		return this.each(function(){

			var $el = $( this ),
				positionMedia = $el.attr( 'data-set-position-media' ),
				scroll = 0,
				focused = null,
				isOpen = false;

			if( !transbg ){
				transbg = $el.is( '[data-transbg]' );
			}

			if( transbg ){
				$background.addClass( cl.bkgdTrans );
			}

			$background.appendTo( body );

			function isSetScrollPosition() {
				return !positionMedia || ( w.matchMedia && w.matchMedia( positionMedia ).matches );
			}

			function open( e ){
				$background[ 0 ].style.height = Math.max( docElem.scrollHeight, docElem.clientHeight ) + "px";
				$el.addClass( cl.open );
				$background.addClass( cl.bkgdOpen );

				if( isSetScrollPosition() ) {
					scroll = "pageYOffset" in w ? w.pageYOffset : ( docElem.scrollY || docElem.scrollTop || ( body && body.scrollY ) || 0 );
					$el[ 0 ].style.top = scroll + "px";
				} else {
					$el[ 0 ].style.top = '';
				}

				$html.addClass( cl.open );
				isOpen = true;
				location.hash = nullHash;
				if( doc.activeElement ){
					focused = doc.activeElement;
				}
				$el[ 0 ].focus();
			}

			function close(){
				$el.removeClass( cl.open );
				$background.removeClass( cl.bkgdOpen );
				$html.removeClass( cl.open );
				if( focused ){
					focused.focus();
				}
				if( isSetScrollPosition() ) {
					w.scrollTo( 0, scroll );
				}
				isOpen = false;
			}

			$el
				.addClass( cl.content )
				.attr( "role", "dialog" )
				.attr( "tabindex", 0 )
				.bind( ev.open, open )
				.bind( ev.close, close )
				.bind( "click", function( e ){
					if( $( e.target ).is( "." + cl.close ) ){
						w.history.back();
						e.preventDefault();
					}
				});

			$background.bind( "click", function( e ) {
				w.history.back();
			});

			$( w )
				// close on hashchange if open (supports back button closure)
				.bind( "hashchange", function( e ){
					var hash = w.location.hash.replace( "#", "" );

					if( hash !== nullHash && isOpen ){
						$el.trigger( ev.close );
					}
				});

			$( doc )
				// open on matching a[href=#id] click
				.bind( "click", function( e ){
					var $a = $( e.target ).closest( "a" );

					if( !isOpen && $a.length && $a.attr( "href" ) ){
						var $matchingDialog = $( $a.attr( "href" ) );
						if( $matchingDialog.length && $matchingDialog.is( $el ) ){
							$matchingDialog.trigger( ev.open );
							e.preventDefault();
						}
					}
				})
				// close on escape key
				.bind( "keyup", function( e ){
					if( isOpen && e.which === 27 ){
						$el.trigger( ev.close );
					}
				});
		});
	};

	// auto-init
	$(function(){
		$( ".dialog" ).dialog();
	});

}( this, jQuery ));