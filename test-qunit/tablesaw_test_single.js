(function($) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			QUnit.module(name, {[setup][ ,teardown]})
			QUnit.test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			assert.ok(value, [message])
			assert.equal(actual, expected, [message])
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
					'<th data-tablesaw-priority="1" data-tablesaw-sortable-col>Header</th>',
					'<th data-tablesaw-sortable-col data-tablesaw-sortable-numeric>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th>Header</th>',
					'<th data-tablesaw-priority="6">Header</th>',
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
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
					'<td>This column text is designed to make the columns really wide.</td>',
				'</tr>',
				'<tr><td>Body Row 2</td><td>2</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
				'<tr><td>Body Row 10</td><td>10</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
				'<tr><td>body row 4</td><td>10</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
				'<tr><td>Body Row 1.2</td><td>1.2</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>',
			'</tbody>',
			'</table>'].join(''),
		$fixture,
		$table,
		setup = function( tableAttributes ) {
			return function() {
				$fixture = $( '#qunit-fixture' );
				// We use columntoggle here to make the cell html comparisons easier (stack adds elements to each cell)
				$fixture.html( tableHtml.replace( /\%s/, tableAttributes ) );
				// WAIT, do this in the tests.
				// $( document ).trigger( 'enhance.tablesaw' );
				$table = $fixture.find( 'table' );
			};
		};

	QUnit.module( 'tablesaw manual init', {
		beforeEach: setup( 'data-tablesaw-mode="stack"' )
	});

	QUnit.test( 'Initialization global', function( assert ) {
		assert.ok( !$fixture.find( 'table' ).is(".tablesaw-stack"), 'Does not have initialization class.' );

		Tablesaw.init();

		assert.ok( $fixture.find( 'table' ).is(".tablesaw-stack"), 'Does have initialization class.' );
	});

	QUnit.test( 'Initialization directly on the table', function( assert ) {
		assert.ok( !$fixture.find( 'table' ).is(".tablesaw-stack"), 'Does not have initialization class.' );

		Tablesaw.init( $fixture.find( 'table' )[0]);

		assert.ok( $fixture.find( 'table' ).is(".tablesaw-stack"), 'Does have initialization class.' );
	});

}( window.shoestring || window.jQuery || window.$jQ ));
