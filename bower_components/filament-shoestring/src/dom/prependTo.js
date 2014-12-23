//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/prepend" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Add each element of the current set before the children of the selected elements.
	 *
	 * @param {string} selector The selector for the elements to add the current set to..
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prependTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).prepend( this );
		});
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
