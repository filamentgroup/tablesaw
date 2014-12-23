//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Returns the raw DOM node at the passed index.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return HTMLElement
	 * @this shoestring
	 */
	shoestring.fn.get = function( index ){
		return this[ index ];
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
