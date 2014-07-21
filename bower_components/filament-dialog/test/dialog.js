(function( $, window ) {
	var $doc, $instance, commonSetup, commonTeardown;

	commonSetup = function() {
		$instance = $( "#dialog" );

		if( $instance.data("instance") ) {
			$instance.data( "instance" ).destroy();
		}

		$instance.dialog();
	};

	commonTeardown = function() {
		$instance.unbind( "dialog-closed" );
		$instance.unbind( "dialog-opened" );
		$instance.trigger( "dialog-close" );

		$instance.data( "instance" ).destroy();
	};

	module( "opening", {
		setup: commonSetup,
		teardown: commonTeardown
	});

	var openTest = function( open ) {
		$instance.one( "dialog-opened", function(){
			ok( $instance.is(".dialog-open") );
			start();
		});

		ok( !$instance.is(".dialog-open") );

		open();
	};

	asyncTest( "with the link", function() {
		var $link = $( $instance.find("a").attr( "href" ) );

		openTest(function() {
			$link.trigger( "click" );
		});
	});

	asyncTest( "with a trigger", function() {
		openTest(function() {
			$instance.trigger( "dialog-open" );
		});
	});

	asyncTest( "with trigger sets the hash to #dialog", function() {
		$instance.one( "dialog-opened", function(){
			equal( location.hash, "#dialog-dialog" );
			start();
		});

		ok( !$instance.is(".dialog-open") );
		$instance.trigger( "dialog-open" );
	});

	module( "background", {
		setup: commonSetup,
		teardown: commonTeardown
	});

	test( "is added to the body", function() {
		equal($( "body" ).find( ".dialog-background" ).length ,1 );
	});

	module( "closing", {
		setup: commonSetup,
		teardown: commonTeardown
	});

	var closeTest = function( close ) {
		expect( 3 );

		$instance.one( "dialog-opened", function(){
			ok( $instance.is(".dialog-open") );
			$instance.trigger( "dialog-close" );
		});

		$instance.one( "dialog-closed", function(){
			ok( !$instance.is(".dialog-open") );
			start();
		});

		ok( !$instance.is(".dialog-open") );
		$instance.trigger( "dialog-open" );
	};

	asyncTest( "using trigger makes the dialog invisible", function() {
		closeTest(function() {
			$instance.trigger( "dialog-close" );
		});
	});

	asyncTest( "using the back button makes the dialog invisible", function() {
		closeTest(function() {
			window.history.back();
		});
	});

	asyncTest( "using the escape key makes the dialog invisible", function() {
		var keyupEvent = {
			type: "keyup",
			timestamp: (new Date()).getTime()
		};

		keyupEvent.which = 27;

		closeTest(function() {
			$( document ).trigger( keyupEvent );
		});
	});
})( jQuery, this );
