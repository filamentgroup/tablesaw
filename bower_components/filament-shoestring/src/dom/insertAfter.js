//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/after" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Insert the current set after the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertAfter = function( selector ){
		return this.each(function(){
			shoestring( selector ).after( this );
		});
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
