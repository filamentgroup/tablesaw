//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/prev" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Returns a `shoestring` object with the set of *all* siblings before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prevAll = function(){
		//>>includeStart("development", pragmas.development);
		if( arguments.length > 0 ){
			shoestring.error( 'prevall-selector' );
		}
		//>>includeEnd("development");

		var result = [];

		this.each(function() {
			var $previous = shoestring( this ).prev();

			while( $previous.length ){
				result.push( $previous[0] );
				$previous = $previous.prev();
			}
		});

		return shoestring( result );
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
