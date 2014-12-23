//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Returns an object with the `top` and `left` properties corresponging to the first elements offsets.
	 *
	 * @return object
	 * @this shoestring
	 */
	shoestring.fn.offset = function(){
		return {
			top: this[ 0 ].offsetTop,
			left: this[ 0 ].offsetLeft
		};
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
