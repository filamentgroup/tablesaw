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

	var tableHtml = [
			'<table %s>',
			'<thead>',
				'<tr>',
					'<th data-priority="1" data-sortable-col>Header</th>',
					'<th data-sortable-col>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th data-priority="6">Header</th>',
				'</tr>',
			'</thead>',
			'<tbody>',
				'<tr>',
					'<td>Body Row 1</td>',
					'<td>1</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
				'</tr>',
				'<tr><td>Body Row 2</td><td>2</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
				'<tr><td>Body Row 10</td><td>10</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
				'<tr><td>body row 3</td><td>10</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
			'</tbody>',
			'</table>'].join(''),
		$fixture,
		$table,
		setup = function( tableAttributes ) {
			return function() {
				$fixture = $( '#qunit-fixture' );
				// We use columntoggle here to make the cell html comparisons easier (stack adds elements to each cell)
				$fixture.html( tableHtml.replace( /\%s/, tableAttributes ) );
				$( document ).trigger( 'enhance.tablesaw' );

				$table = $fixture.find( 'table' );
			};
		};

	module( 'Global' );
	test( 'Initialization', function() {
		ok( $( 'html' ).hasClass( 'tablesaw-enhanced' ), 'Has initialization class.' );
	});

	module( 'tablesaw is opt-in only, no default', {
		setup: setup( '' )
	});

	test( 'Initialization', function() {
		ok( $table[ 0 ].className.indexOf( 'tablesaw-' ) === -1, 'Does not have initialization class.' );
	});

	module( 'tablesaw Stack', {
		setup: setup( 'data-mode="stack"' )
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-stack' ), 'Has initialization class.' );
	});

	module( 'tablesaw Column Toggle', {
		setup: setup( 'data-mode="columntoggle"' )
	});

	test( 'Initialization', function() {
		ok( $table.hasClass( 'tablesaw-columntoggle' ), 'Has initialization class.' );
		ok( $table.find( 'tbody td' ).eq( 0 ).is( ':visible' ), 'First cell is visible' );
	});

	test( 'Show Dialog', function() {
		ok( !$fixture.find( '.tablesaw-columntoggle-popup' ).is( ':visible' ), 'Dialog hidden' );

		$table.prev().find( '.tablesaw-columntoggle-btn' ).click();

		ok( $fixture.find( '.tablesaw-columntoggle-popup' ).is( ':visible' ), 'Dialog visible after button click' );

		var $curtain = $( '.dialog-background-open' );
		ok( $curtain.length, 'Curtain visible.' );

		// close dialog
		$curtain.click();
		ok( $curtain.is( '.dialog-background-open' ), 'Curtain not visible after click.' );
	});

	test( 'Toggle Column', function() {
		$table.prev().find( '.tablesaw-columntoggle-btn' ).click()
			.next().find( ':checkbox' ).trigger( 'click' );

		ok( !$table.find( 'tbody td' ).eq( 0 ).is( ':visible' ), 'First cell is hidden after checkbox unchecked' );
	});


	module( 'tablesaw Swipe', {
		setup: setup( 'data-mode="swipe"' )
	});

	test( 'Initialization', function() {
		var $buttons = $table.prev().find( '.tablesaw-nav-btn' );
		ok( $table.hasClass( 'tablesaw-swipe' ), 'Has initialization class.' );
		equal( $buttons.length, 2, 'Has buttons.' );
	});

	test( 'Navigate with buttons', function() {
		var $buttons = $table.prev().find( '.tablesaw-nav-btn' ),
			$prev = $buttons.filter( '.left' ),
			$next = $buttons.filter( '.right' );

		ok( $prev.is( '.disabled' ), 'Starts at far left, previous button disabled.' );
		ok( !$next.is( '.disabled' ), 'Starts at far left, next button enabled.' );
		ok( $table.find( 'tbody td:first-child' ).not( '.tablesaw-cell-hidden' ), 'First column is visible' );

		$next.trigger( 'click' );
		ok( !$prev.is( '.disabled' ), 'Previous button enabled.' );
		ok( $table.find( 'tbody td:first-child' ).is( '.tablesaw-cell-hidden' ), 'First column is hidden after click' );
	});

	module( 'tablesaw Sortable without a Mode', {
		setup: setup( 'data-sortable' )
	});

	test( 'Sortable still initializes without a data-mode', function() {
		ok( $table.hasClass( 'tablesaw-sortable' ), 'Has initialization class.' );
		ok( $table.find( '.sortable-head' ).length > 0, 'Header has sort class.' );
	});

	module( 'tablesaw Sortable', {
		setup: setup( 'data-mode="columntoggle" data-sortable' )
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

	test( 'Can sort numeric descending', function() {
		var $sortButton = $table.find( '.sortable-head button' ).eq( 1 );

		$sortButton.click();

		equal( $table.find( 'tbody tr:eq(0) td:eq(1)' ).html(), '10', 'First row is sorted descending' );

		$sortButton.click();

		equal( $table.find( 'tbody tr:eq(0) td:eq(1)' ).html(), '1', 'First row is sorted ascending' );
	});

	test( 'Sort is case insensitive', function() {
		var previousText = "body row 3",
			$sortButton = $table.find( '.sortable-head button' ).eq( 0 );

		$sortButton.click();
		equal( $table.find( 'tbody tr:eq(0) td:eq(0)' ).text(), previousText, previousText + ' is in the first row (descending)' );

		$sortButton.click();
		equal( $table.find( 'tbody tr:eq(3) td:eq(0)' ).text(), previousText, previousText + ' is in the third row (ascending)' );

	});

	module( 'tablesaw Sortable Switcher', {
		setup: setup( 'data-mode="columntoggle" data-sortable data-sortable-switch' )
	});

	test( 'Can sort descending with switcher', function() {
		var previousRow1Text = $table.find( 'tbody tr td' ).eq( 0 ).text(),
			$switcher = $table.prev().find( 'select' ).eq( 0 );

		$switcher.val( '0_desc' ).trigger( 'change' );

		notEqual( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted descending' );

		$switcher.val( '0_asc' ).trigger( 'change' );

		equal( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted ascending' );
	});

	test( 'Can sort numeric descending with switcher', function() {
		var $switcher = $table.prev().find( 'select' ).eq( 0 );

		$switcher.val( '1_desc' ).trigger( 'change' );

		equal( $table.find( 'tbody tr:eq(0) td:eq(1)' ).html(), '10', 'First row is sorted descending' );

		$switcher.val( '1_asc' ).trigger( 'change' );

		equal( $table.find( 'tbody tr:eq(0) td:eq(1)' ).html(), '1', 'First row is sorted ascending' );
	});

	module( 'tablesaw Mini Map', {
		setup: setup( 'data-mode="columntoggle" data-minimap' )
	});

	test( 'Initialization', function() {
		var $minimap = $table.prev().find( '.minimap' );
		ok( $minimap.length, 'Minimap exists.' );
		equal( $minimap.find( 'li' ).length, $table.find( 'tbody tr:eq(0) td' ).length, 'Minimap has same number of dots as columns.' );
	});

	module( 'tablesaw Mode Switch', {
		setup: setup( 'data-mode="stack" data-mode-switch' )
	});

	test( 'Initialization', function() {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' );
		ok( $switcher.length, 'Mode Switcher exists.' );
	});

	test( 'Can switch to Swipe mode', function() {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' ).find( 'select' );
		ok( !$table.hasClass( 'tablesaw-swipe' ), 'Doesn’t have class.' );
		$switcher.val( 'swipe' ).trigger( 'change' );
		ok( $table.hasClass( 'tablesaw-swipe' ), 'Has class.' );
	});

	test( 'Can switch to Column Toggle mode', function() {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' ).find( 'select' );
		ok( !$table.hasClass( 'tablesaw-columntoggle' ), 'Doesn’t have class.' );
		$switcher.val( 'columntoggle' ).trigger( 'change' );
		ok( $table.hasClass( 'tablesaw-columntoggle' ), 'Has class.' );
	});

}(jQuery));
