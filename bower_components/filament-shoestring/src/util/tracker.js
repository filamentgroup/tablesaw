//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring" ], function(){
//>>excludeEnd("exclude");

	(function() {
		shoestring.trackedMethodsKey = "shoestringMethods";

		// simple check for localStorage from http://diveintohtml5.info/storage.html
		function supportsStorage() {
			try {
				return 'localStorage' in window && window.localStorage !== null;
			} catch (e) {
				return false;
			}
		}

		// return a new function closed over the old implementation
		function recordProxy( old, name ) {
			return function() {
				var tracked;
				try {
					tracked = JSON.parse(window.localStorage.getItem( shoestring.trackedMethodsKey ) || "{}");
				} catch (e) {
					if( e instanceof SyntaxError) {
						tracked = {};
					}
				}

				tracked[ name ] = true;
				window.localStorage.setItem( shoestring.trackedMethodsKey, JSON.stringify(tracked) );

				return old.apply(this, arguments);
			};
		}

		// proxy each of the methods defined on fn
		if( supportsStorage() ){
			for( var method in shoestring.fn ){
				if( shoestring.fn.hasOwnProperty(method) ) {
					shoestring.fn[ method ] = recordProxy(shoestring.fn[ method ], method);
				}
			}
		}
	})();

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
