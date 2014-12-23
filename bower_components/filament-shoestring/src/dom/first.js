//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/eq" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Returns the first element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.first = function(){
		return this.eq( 0 );
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
