/*
 * Simple jQuery Dialog
 * https://github.com/filamentgroup/dialog
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Author: @scottjehl
 * Contributors: @johnbender
 * Licensed under the MIT, GPL licenses.
 */

(function( w, $ ){
	w.componentNamespace = w.componentNamespace || w;

	var pluginName = "dialog", cl, ev,
		nullHash = "dialog",
		doc = w.document,
		docElem = doc.documentElement,
		body = doc.body,
		$html = $( docElem );

	var Dialog = w.componentNamespace.Dialog = function( element ){
		this.$el = $( element );
		this.$background =
			$( doc.createElement('div') ).addClass( cl.bkgd ).appendTo( "body");
		this.hash = this.$el.attr( "id" ) + "-dialog";

		this.isOpen = false;
		this.positionMedia = this.$el.attr( 'data-set-position-media' );
		this.isTransparentBackground = this.$el.is( '[data-transbg]' );
	};

	Dialog.events = ev = {
		open: pluginName + "-open",
		close: pluginName + "-close"
	};

	Dialog.classes = cl = {
		open: pluginName + "-open",
		opened: pluginName + "-opened",
		content: pluginName + "-content",
		close: pluginName + "-close",
		closed: pluginName + "-closed",
		bkgd: pluginName + "-background",
		bkgdOpen: pluginName + "-background-open",
		bkgdTrans: pluginName + "-background-trans"
	};

	Dialog.prototype.isSetScrollPosition = function() {
		return !this.positionMedia ||
			( w.matchMedia && w.matchMedia( this.positionMedia ).matches );
	};

	Dialog.prototype.destroy = function() {
		this.$background.remove();
	};

	Dialog.prototype.open = function( e ) {
		this.$background[ 0 ].style.height = Math.max( docElem.scrollHeight, docElem.clientHeight ) + "px";
		this.$el.addClass( cl.open );
		this.$background.addClass( cl.bkgdOpen );
		this._setBackgroundTransparency();

		if( this.isSetScrollPosition() ) {
			this.scroll = "pageYOffset" in w ? w.pageYOffset : ( docElem.scrollY || docElem.scrollTop || ( body && body.scrollY ) || 0 );
			this.$el[ 0 ].style.top = this.scroll + "px";
		} else {
			this.$el[ 0 ].style.top = '';
		}

		$html.addClass( cl.open );
		this.isOpen = true;

		location.hash = this.hash;

		if( doc.activeElement ){
			this.focused = doc.activeElement;
		}
		this.$el[ 0 ].focus();

		this.$el.trigger( cl.opened );
	};

	Dialog.prototype._setBackgroundTransparency = function() {
		if( this.isTransparentBackground ){
			this.$background.addClass( cl.bkgdTrans );
		}
	};

	Dialog.prototype.close = function(){
		if( !this.isOpen ){
			return;
		}

		this.$el.removeClass( cl.open );

		this.$background.removeClass( cl.bkgdOpen );
		$html.removeClass( cl.open );

		if( this.focused ){
			this.focused.focus();
		}

		if( this.isSetScrollPosition() ) {
			w.scrollTo( 0, this.scroll );
		}

		this.isOpen = false;

		this.$el.trigger( cl.closed );
	};
}( this, jQuery ));

(function( w, $ ){
  var Dialog = w.componentNamespace.Dialog, doc = document;

	$.fn.dialog = function( transbg ){
		return this.each(function(){
			var $el = $( this ), dialog = new Dialog( this );

			$el.data( "instance", dialog );

			$el.addClass( Dialog.classes.content )
				.attr( "role", "dialog" )
				.attr( "tabindex", 0 )
				.bind( Dialog.events.open, $.proxy(dialog, 'open') )
				.bind( Dialog.events.close, $.proxy(dialog, 'close') )
				.bind( "click", function( e ){
					if( $( e.target ).is( "." + Dialog.classes.close ) ){
						w.history.back();
						e.preventDefault();
					}
				});

			dialog.$background.bind( "click", function( e ) {
				w.history.back();
			});

			// close on hashchange if open (supports back button closure)
			$( w ).bind( "hashchange", function( e ){
				var hash = w.location.hash.replace( "#", "" );

				if( hash !== dialog.hash ){
					dialog.close();
				}
			});

			// open on matching a[href=#id] click
			$( doc ).bind( "click", function( e ){
				var $a = $( e.target ).closest( "a" );

				if( !dialog.isOpen && $a.length && $a.attr( "href" ) ){
					var $matchingDialog = $( $a.attr( "href" ) );
					if( $matchingDialog.length && $matchingDialog.is( $el ) ){
						$matchingDialog.trigger( Dialog.events.open );
						e.preventDefault();
					}
				}
			});

			// close on escape key
			$( doc ).bind( "keyup", function( e ){
				if( e.which === 27 ){
					dialog.close();
				}
			});
		});
	};

	// auto-init
	$(function(){
		$( ".dialog" ).dialog();
	});
}( this, jQuery ));
