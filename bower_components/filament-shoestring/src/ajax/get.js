//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "ajax/ajax" ], function( shoestring ) {
//>>excludeEnd("exclude");

	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `GET` method.
	 *
	 * @param {string} url The url to GET from.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.get = function( url, callback ){
		return shoestring.ajax( url, { success: callback } );
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
