//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/dimension" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Gets the height value of the first element or sets the height for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.height = function( value ){
		return shoestring._dimension( this, "height", value );
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
