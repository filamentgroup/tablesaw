//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/propFix.js" ], function(){
//>>excludeEnd("exclude");

	/**
	 * Remove a proprety from each element in the current set.
	 *
	 * @param {string} name The name of the property.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeProp = function( property ){
		var name = shoestring.propFix[ property ] || property;

		return this.each(function(){
			this[ name ] = undefined;
			delete this[ name ];
		});
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
