//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "ajax/ajax" ], function( shoestring ) {
//>>excludeEnd("exclude");

	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `POST` method.
	 *
	 * @param {string} url The url to POST to.
	 * @param {object} data The data to send.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.post = function( url, data, callback ){
		return shoestring.ajax( url, { data: data, method: "POST", success: callback } );
	};

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
