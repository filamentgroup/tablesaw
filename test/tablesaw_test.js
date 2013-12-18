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

	var tableHtml = ['<table %s><thead><tr><th data-priority="1" data-sortable-col>Header</th><th data-sortable-col>Header</th></tr></thead>',
			'<tbody>',
			'<tr><td>Body Row 1</td><td>1</td></tr>',
			'<tr><td>Body Row 2</td><td>2</td></tr>',
			'<tr><td>Body Row 10</td><td>10</td></tr>',
			'</tbody></table>'].join(''),
		$fixture,
		$table;

	module( 'Global' );
	test( 'Initialization', function() {
		ok( $( 'html' ).hasClass( 'tablesaw-enhanced' ), 'Has initialization class.' );
	});

	module( 'tablesaw Default', {
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

	module( 'tablesaw Stack', {
		setup: function() {
			$fixture = $( '#qunit-fixture' );
			$fixture.html( tableHtml.replace( /\%s/, 'data-mode="stack"' ) );
			$( document ).trigger( 'enhance.tablesaw' );

			$table = $fixture.find( 'table' );
		}
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-stack' ), 'Has initialization class.' );
	});

	module( 'tablesaw Column Toggle', {
		setup: function() {
			$fixture = $( '#qunit-fixture' );
			$fixture.html( tableHtml.replace( /\%s/, 'data-mode="columntoggle"' ) );
			$( document ).trigger( 'enhance.tablesaw' );

			$table = $fixture.find( 'table' );
		}
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-columntoggle' ), 'Has initialization class.' );
		ok( $table.find( 'tbody td' ).eq( 0 ).is( ':visible' ), 'First cell is visible' );
	});

	test( 'Show Dialog', function() {
		ok( !$fixture.find( '.tablesaw-columntoggle-popup' ).is( ':visible' ), 'Dialog hidden' );

		$table.prev().find( '.tablesaw-columntoggle-btn' ).click();

		ok( $fixture.find( '.tablesaw-columntoggle-popup' ).is( ':visible' ), 'Dialog visible after button click' );
	});

	test( 'Toggle Column', function() {
		$table.prev().find( '.tablesaw-columntoggle-btn' ).click()
			.next().find( ':checkbox' ).trigger( 'click' );

		ok( !$table.find( 'tbody td' ).eq( 0 ).is( ':visible' ), 'First cell is hidden after checkbox unchecked' );
	});


	module( 'tablesaw Swipe', {
		setup: function() {
			$fixture = $( '#qunit-fixture' );
			$fixture.html( tableHtml.replace( /\%s/, 'data-mode="swipe"' ) );
			$( document ).trigger( 'enhance.tablesaw' );

			$table = $fixture.find( 'table' );
		}
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-swipe' ), 'Has initialization class.' );
	});

	module( 'tablesaw Sortable', {
		setup: function() {
			$fixture = $( '#qunit-fixture' );
			// We use columntoggle here to make the cell html comparisons easier (stack adds elements to each cell)
			$fixture.html( tableHtml.replace( /\%s/, 'data-mode="columntoggle" data-sortable' ) );
			$( document ).trigger( 'enhance.tablesaw' );

			$table = $fixture.find( 'table' );
		}
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-sortable' ), 'Has initialization class.' );
		ok( $table.find( '.sortable-head' ).length > 0, 'Header has sort class.' );
	});

	test( 'Can sort descending', function() {
		var previousRow1Text = $table.find( 'tbody tr td' ).eq( 0 ).text(),
			$sortButton = $table.find( '.sortable-head button' ).eq( 0 );

		$sortButton.click();

		notEqual( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted descending' );

		$sortButton.click();

		equal( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted ascending' );
	});

}(jQuery));
