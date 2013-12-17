(function($) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/

	var tableHtml = '<table %s><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Body</td></tr></tbody></table>',
		$fixture,
		$table;

	module( 'Global' );
	test( 'Initialization', function() {
		ok( $( 'html' ).hasClass( 'tablesaw-enhanced' ), 'Has initialization class.' );
	});

	module( 'tablesaw Stack', {
		// This will run before each test in this module.
		setup: function() {
			$fixture = $( '#qunit-fixture' );
			$fixture.html( tableHtml.replace( /\%s/, '' ) );
			$( document ).trigger( 'enhance.tablesaw' );

			$table = $fixture.find( 'table' );
		}
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-stack' ), 'Has initialization class.' );
	});

}(jQuery));
