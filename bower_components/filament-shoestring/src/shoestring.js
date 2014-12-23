//>>excludeStart("exclude", pragmas.exclude);
define([], function(){
	//>>excludeEnd("exclude");

	/**
	 * The shoestring object constructor.
	 *
	 * @param {string,object} prim The selector to find or element to wrap.
	 * @param {object} sec The context in which to match the `prim` selector.
	 * @returns shoestring
	 * @this window
	 */
	function shoestring( prim, sec ){
		var pType = typeof( prim ),
				ret = [],
				sel;

		if( prim ){
			// if string starting with <, make html
			if( pType === "string" && prim.indexOf( "<" ) === 0 ){
				var dfrag = document.createElement( "div" );
				dfrag.innerHTML = prim;
				return shoestring( dfrag ).children().each(function(){
					dfrag.removeChild( this );
				});
			}
			else if( pType === "function" ){
				return shoestring.ready( prim );
			}
			// if string, it's a selector, use qsa
			else if( pType === "string" ){
				if( sec ){
					return shoestring( sec ).find( prim );
				}
//>>includeStart("development", pragmas.development);
				try {
//>>includeEnd("development");
					sel = document.querySelectorAll( prim );
//>>includeStart("development", pragmas.development);
				} catch( e ) {
					shoestring.error( 'queryselector', prim );
				}
//>>includeEnd("development");
				for( var i = 0, il = sel.length; i < il; i++ ){
					ret[ i ] = sel[ i ];
				}
			}
			else if( Object.prototype.toString.call( pType ) === '[object Array]' ||
							 pType === "object" && prim instanceof w.NodeList ){

								 for( var i2 = 0, il2 = prim.length; i2 < il2; i2++ ){
									 ret[ i2 ] = prim[ i2 ];
								 }
							 }
			// object? passthrough
			else {
				ret = ret.concat( prim );
			}
		}

		ret = shoestring.extend( ret, shoestring.fn );

		// add selector prop
		ret.selector = prim;

		return ret;
	}

	// For adding element set methods
	shoestring.fn = {};

	// For extending objects
	// TODO move to separate module when we use prototypes
	shoestring.extend = function( first, second ){
		for( var i in second ){
			if( second.hasOwnProperty( i ) ){
				first[ i ] = second[ i ];
			}
		}

		return first;
	};

	// expose
	window.shoestring = shoestring;

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
