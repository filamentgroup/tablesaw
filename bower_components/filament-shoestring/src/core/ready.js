//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring" ], function(){
//>>excludeEnd("exclude");

  /**
	 * Bind callbacks to be run when the DOM is "ready".
	 *
	 * @param {function} fn The callback to be run
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.ready = function( fn ){
		if( ready && fn ){
			fn.call( document );
		}
		else if( fn ){
			readyQueue.push( fn );
		}
		else {
			runReady();
		}

		return [document];
	};

	// TODO necessary?
	shoestring.fn.ready = function( fn ){
		shoestring.ready( fn );
		return this;
	};

	// Empty and exec the ready queue
	var ready = false,
		readyQueue = [],
		runReady = function(){
			if( !ready ){
				while( readyQueue.length ){
					readyQueue.shift().call( document );
				}
				ready = true;
			}
		};

	// Quick IE8 shiv
	if( !w.addEventListener ){
		w.addEventListener = function( evt, cb ){
			return w.attachEvent( "on" + evt, cb );
		};
	}

	// If DOM is already ready at exec time, depends on the browser.
	// From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
		runReady();
	}	else {
		if( !w.document.addEventListener ){
			w.document.attachEvent( "DOMContentLoaded", runReady );
			w.document.attachEvent( "onreadystatechange", runReady );
		} else {
			w.document.addEventListener( "DOMContentLoaded", runReady, false );
			w.document.addEventListener( "readystatechange", runReady, false );
		}
		w.addEventListener( "load", runReady, false );
	}

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
