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
				$( document ).trigger( 'enhance.tablesaw' );

				$table = $fixture.find( 'table' );
			};
		};

	QUnit.module( 'Global' );
	QUnit.test( 'Initialization', function( assert ) {
		assert.ok( $( 'html' ).is( '.tablesaw-enhanced' ), 'Has initialization class.' );
	});

	QUnit.module( 'tablesaw is opt-in only, no default', {
		beforeEach: setup( '' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		assert.ok( $table[ 0 ].className.indexOf( 'tablesaw-' ) === -1, 'Does not have initialization class.' );
	});

	QUnit.module( 'tablesaw Stack', {
		beforeEach: setup( 'data-tablesaw-mode="stack"' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		assert.ok( $table.is( '.tablesaw-stack' ), 'Has initialization class.' );
	});

	QUnit.module( 'tablesaw Column Toggle', {
		beforeEach: setup( 'data-tablesaw-mode="columntoggle"' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		assert.ok( $table.is( '.tablesaw-columntoggle' ), 'Has initialization class.' );
		assert.ok( $jQ( $table.find( 'tbody td' )[ 0 ] ).is( ':visible' ), 'First cell is visible' );
	});

	QUnit.test( 'Show Dialog', function( assert ) {
		assert.ok( !$jQ( $fixture.find( '.tablesaw-columntoggle-popup' )[ 0 ] ).is( ':visible' ), 'Dialog hidden' );

		$table.prev().find( '.tablesaw-columntoggle-btn' ).trigger( "click" );

		assert.ok( $jQ( $fixture.find( '.tablesaw-columntoggle-popup' )[ 0 ] ).is( ':visible' ), 'Dialog visible after button click' );
	});

	QUnit.test( 'Toggle Column', function( assert ) {
		var $cell = $table.find( 'tbody td' ).eq( 0 );

		assert.strictEqual( $cell.is( '.tablesaw-toggle-cellhidden' ), false, 'First cell is visible before checkbox unchecked' );

		$table.prev().find( '.tablesaw-columntoggle-btn' ).trigger( 'click' )
			.next().find( 'input[type="checkbox"]' ).trigger( 'click' );

		// close dialog
		$( '.tablesaw-columntoggle-popup .close' ).trigger( "click" );

		assert.strictEqual( $cell.is( '.tablesaw-toggle-cellhidden' ), true, 'First cell is hidden after checkbox unchecked' );
	});


	QUnit.module( 'tablesaw Swipe', {
		beforeEach: setup( 'data-tablesaw-mode="swipe"' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		var $buttons = $table.prev().find( '.tablesaw-nav-btn' );
		assert.ok( $table.is( '.tablesaw-swipe' ), 'Has initialization class.' );
		assert.equal( $buttons.length, 2, 'Has buttons.' );
	});

	QUnit.test( 'Navigate with buttons', function( assert ) {
		var $buttons = $table.prev().find( '.tablesaw-nav-btn' ),
			$prev = $buttons.filter( '.left' ),
			$next = $buttons.filter( '.right' );

		assert.ok( $prev.is( '.disabled' ), 'Starts at far left, previous button disabled.' );
		assert.ok( !$next.is( '.disabled' ), 'Starts at far left, next button enabled.' );
		assert.ok( $table.find( 'tbody td:first-child' ).not( '.tablesaw-swipe-cellhidden' ), 'First column is visible' );

		$next.trigger( 'click' );
		assert.ok( !$prev.is( '.disabled' ), 'Previous button enabled.' );
		assert.ok( $table.find( 'tbody td:first-child' ).is( '.tablesaw-swipe-cellhidden' ), 'First column is hidden after click' );
	});

	QUnit.module( 'tablesaw Sortable without a Mode', {
		beforeEach: setup( 'data-tablesaw-sortable' )
	});

	QUnit.test( 'Sortable still initializes without a data-tablesaw-mode', function( assert ) {
		assert.ok( $table.is( '.tablesaw-sortable' ), 'Has initialization class.' );
		assert.ok( $table.find( '.tablesaw-sortable-head' ).length > 0, 'Header has sort class.' );
	});

	QUnit.module( 'tablesaw Sortable', {
		beforeEach: setup( 'data-tablesaw-mode="columntoggle" data-tablesaw-sortable' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		assert.ok( $table.is( '.tablesaw-sortable' ), 'Has initialization class.' );
		assert.ok( $table.find( '.tablesaw-sortable-head' ).length > 0, 'Header has sort class.' );
	});

	QUnit.test( 'Can sort descending', function( assert ) {
		var previousRow1Text = $table.find( 'tbody tr td' ).eq( 0 ).text(),
			$sortButton = $table.find( '.tablesaw-sortable-head button' ).eq( 0 );

		$sortButton.trigger( "click" );

		assert.equal( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted ascending' );

		$sortButton.trigger( "click" );

		assert.notEqual( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted descending' );
	});

	QUnit.test( 'Can sort numeric descending', function( assert ) {
		var $sortButton = $table.find( '.tablesaw-sortable-head button' ).eq( 1 );

		$sortButton.trigger( "click" );

		assert.equal( $table.find( "tbody tr" ).eq( 0 ).find( "td" ).eq( 1 ).html(), '1', 'First row is sorted ascending' );

		$sortButton.trigger( "click" );

		assert.equal( $table.find( "tbody tr" ).eq( 0 ).find( "td" ).eq( 1 ).html(), '10', 'First row is sorted descending' );
	});

	QUnit.test( 'Sort works with floats', function( assert ) {
		var previousText = "Body Row 1.2",
			$sortButton = $table.find( '.tablesaw-sortable-head button' ).eq( 0 ),
			rows = $table.find( 'tbody tr' ).length;

		$sortButton.trigger( "click" );
		assert.equal( $table.find( "tbody tr" ).eq( 1 ).find( "td" ).eq( 0 ).text(), previousText, previousText + ' is in the second row (descending)' );

		$sortButton.trigger( "click" );
		assert.equal( $table.find( "tbody tr" ).eq( rows - 2 ).find( "td" ).eq( 0 ).text(), previousText, previousText + ' is in row ' + ( rows - 2 ) + ' of ' + rows + ' (ascending)' );

	});

	QUnit.test( 'Sort is case insensitive', function( assert ) {
		var previousText = "body row 4",
			$sortButton = $table.find( '.tablesaw-sortable-head button' ).eq( 0 );

		$sortButton.trigger( "click" );
		assert.equal( $table.find( "tbody tr" ).eq( 4 ).find( "td" ).eq( 0 ).text(), previousText, previousText + ' is in the fifth row (ascending)' );

		$sortButton.trigger( "click" );
		assert.equal( $table.find( "tbody tr" ).eq( 0 ).find( "td" ).eq( 0 ).text(), previousText, previousText + ' is in the first row (descending)' );

	});

	QUnit.module( 'tablesaw Sortable Switcher', {
		beforeEach: setup( 'data-tablesaw-mode="columntoggle" data-tablesaw-sortable data-tablesaw-sortable-switch' )
	});

	QUnit.test( 'Can sort descending with switcher', function( assert ) {
		var previousRow1Text = $table.find( 'tbody tr td' ).eq( 0 ).text(),
			$switcher = $table.prev().find( 'select' ).eq( 0 );

		$switcher.val( '0_desc' ).trigger( 'change' );

		assert.notEqual( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted descending' );

		$switcher.val( '0_asc' ).trigger( 'change' );

		assert.equal( $table.find( 'tbody tr td' ).eq( 0 ).text(), previousRow1Text, 'First row is sorted ascending' );
	});

	QUnit.test( 'Can sort numeric descending with switcher', function( assert ) {
		var $switcher = $table.prev().find( 'select' ).eq( 0 );

		$switcher.val( '1_desc' ).trigger( 'change' );

		assert.equal( $table.find( "tbody tr" ).eq( 0 ).find( "td" ).eq( 1 ).html(), '10', 'First row is sorted descending' );

		$switcher.val( '1_asc' ).trigger( 'change' );

		assert.equal( $table.find( "tbody tr" ).eq( 0 ).find( "td" ).eq( 1 ).html(), '1', 'First row is sorted ascending' );
	});

	QUnit.module( 'tablesaw Mini Map', {
		beforeEach: setup( 'data-tablesaw-mode="columntoggle" data-tablesaw-minimap' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		var $minimap = $table.prev().find( '.minimap' );
		assert.ok( $minimap.length, 'Minimap exists.' );
		// assert.ok( window.Tablesaw.MiniMap.showMiniMap( $table ), 'showMiniMap return true.' );
		assert.equal( $minimap.css( "display" ), "block", 'Minimap is visible.' );
		assert.equal( $minimap.find( 'li' ).length, $table.find( 'tbody tr' ).eq( 0 ) .find( 'td' ).length, 'Minimap has same number of dots as columns.' );
	});

	QUnit.module( 'tablesaw Mode Switch', {
		beforeEach: setup( 'data-tablesaw-mode="stack" data-tablesaw-mode-switch' )
	});

	QUnit.test( 'Initialization', function( assert ) {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' );
		assert.ok( $switcher.length, 'Mode Switcher exists.' );
	});

	QUnit.test( 'Can switch to Swipe mode', function( assert ) {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' ).find( 'select' );
		assert.ok( !$table.is( '.tablesaw-swipe' ), 'Doesn’t have class.' );
		$switcher.val( 'swipe' ).trigger( 'change' );
		assert.ok( $table.is( '.tablesaw-swipe' ), 'Has class.' );
	});

	QUnit.test( 'Can switch to Column Toggle mode', function( assert ) {
		var $switcher = $table.prev().find( '.tablesaw-modeswitch' ).find( 'select' );
		assert.ok( !$table.is( '.tablesaw-columntoggle' ), 'Doesn’t have class.' );
		$switcher.val( 'columntoggle' ).trigger( 'change' );
		assert.ok( $table.is( '.tablesaw-columntoggle' ), 'Has class.' );
	});

	QUnit.module( 'tablesaw Stack Hide Empty', {
		beforeEach: function(){
			$fixture = $( '#qunit-fixture' );
			$fixture.html( tableHtml.replace( /\%s/, 'data-tablesaw-mode="stack" data-tablesaw-hide-empty' ) );
			$fixture.find( 'table tbody tr' ).eq( 3 ).find( 'td' ).eq( 4 ).html('');
			$( document ).trigger( 'enhance.tablesaw' );		
		}
	});

	QUnit.test( 'Empty cells are hidden', function( assert ) {
		$fixture = $( '#qunit-fixture' );
		var testCell = $fixture.find( 'table tbody tr' ).eq( 3 ).find( 'td' ).eq( 4 );

		//not sure how to better test this
		if(window.innerWidth < 640){
			assert.ok( $jQ( testCell[ 0 ] ).is(':hidden'));
		}
		else{
			assert.ok( $jQ( testCell[ 0 ] ).is(':visible'));
		}
	});

	QUnit.module ('tablesaw colspans', {
		beforeEach: function() {
			var colspannedHTML = [
				'<table %s>',
				'<thead>',
					'<tr>',
						'<th data-tablesaw-priority="1" colspan="2">Header 1</th>',
						'<th data-tablesaw-priority="2" colspan="2">Header 2</th>',
						'<th data-tablesaw-priority="6">Header 3</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td>Body Row 1</td>',
						'<td>1</td>',
						'<td>Small 1</td>',
						'<td>Small 2</td>',
						'<td>Small 3</td>',
					'</tr>',
					'<tr><td>Body Row 2</td><td>2</td><td colspan="2">Fat cell</td><td>After fat</td></tr>',
					'<tr><td>Body Row 10</td><td>10</td><td>A</td><td>A</td><td>A</td></tr>',
					'<tr><td>body row 4</td><td>10</td><td>A</td><td>A</td><td>A</td></tr>',
					'<tr><td>Body Row 1.2</td><td>1.2</td><td>A</td><td>A</td><td>A</td></tr>',
				'</tbody>',
				'</table>'].join('');
			$fixture = $( '#qunit-fixture' );
			$fixture.html( colspannedHTML.replace( /\%s/, 'data-tablesaw-mode="columntoggle" data-tablesaw-minimap data-tablesaw-no-labels' ) );
			$table = $fixture.find( 'table' );
			$( document ).trigger( 'enhance.tablesaw' );
		}
	});

	QUnit.test('Hide multicolumn header and single column cells', function( assert ) {
		var $firstCell = $table.find( 'tbody td' ).eq( 0 );
		var $secondCell = $table.find( 'tbody td' ).eq( 1 );

		assert.strictEqual( $firstCell.is( '.tablesaw-toggle-cellhidden' ), false, 'First cell is visible before checkbox unchecked' );
		assert.strictEqual( $secondCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Second cell is visible before checkbox unchecked' );

		$table.prev().find( '.tablesaw-columntoggle-btn' ).trigger( 'click' )
			.next().find( 'input[type="checkbox"]' ).first().trigger( 'click' );

		// close dialog
		$( '.tablesaw-columntoggle-popup .close' ).trigger( "click" );

		assert.strictEqual( $firstCell.is( '.tablesaw-toggle-cellhidden' ), true, 'First cell is hidden after checkbox unchecked' );
		assert.strictEqual( $secondCell.is( '.tablesaw-toggle-cellhidden' ), true, 'Second cell is hidden after checkbox unchecked' );
	});

	QUnit.test('Hide multicolumn header and multi column cells', function( assert ) {
		var $firstRowCell1 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 2 );
		var $firstRowCell2 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 3 );
		var $firstRowCell3 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 4 );
		var $secondRowFatCell = $table.find( 'tbody tr' ).eq( 1 ).find( 'td' ).eq( 2 );
		var $secondRowLastCell = $table.find( 'tbody tr' ).eq( 1 ).find( 'td' ).eq( 3 );

		assert.strictEqual( $firstRowCell1.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,2 cell is visible before checkbox unchecked' );
		assert.strictEqual( $firstRowCell2.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,3 is visible before checkbox unchecked' );
		assert.strictEqual( $firstRowCell3.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,4 is visible before checkbox unchecked' );
		assert.strictEqual( $secondRowFatCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,2-3 is visible before checkbox unchecked' );
		assert.strictEqual( $secondRowLastCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,4 is visible before checkbox unchecked' );

		var middlecheck = $($table.prev().find( '.tablesaw-columntoggle-btn' ).trigger( 'click' )
			.next().find( 'input[type="checkbox"]' )[1]);
		if (!middlecheck[0].checked) {
			middlecheck.trigger( 'click' );
			assert.strictEqual ( middlecheck[0].checked, true, "Toggle button wasn't initially true and then should've been turned on.");
		}
		middlecheck.trigger( 'click' );
		assert.strictEqual ( middlecheck[0].checked, false, "Toggle button wasn't unchecked.");

		// close dialog
		$( '.tablesaw-columntoggle-popup .close' ).trigger( "click" );

		assert.strictEqual( $firstRowCell1.is( '.tablesaw-toggle-cellhidden' ), true, 'Cell 0,2 cell is hidden after checkbox unchecked' );
		assert.strictEqual( $firstRowCell2.is( '.tablesaw-toggle-cellhidden' ), true, 'Cell 0,3 is hidden after checkbox unchecked' );
		assert.strictEqual( $firstRowCell3.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,4 is still visible after checkbox unchecked' );
		assert.strictEqual( $secondRowFatCell.is( '.tablesaw-toggle-cellhidden' ), true, 'Cell 1,2-3 is hidden after checkbox unchecked' );
		assert.strictEqual( $secondRowLastCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,4 is still visible after checkbox unchecked' );
	});

	QUnit.test('Hide single column header and not multi column cells', function( assert ) {
		var $firstRowCell1 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 2 );
		var $firstRowCell2 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 3 );
		var $firstRowCell3 = $table.find( 'tbody tr' ).eq( 0 ).find( 'td' ).eq( 4 );
		var $secondRowFatCell = $table.find( 'tbody tr' ).eq( 1 ).find( 'td' ).eq( 2 );
		var $secondRowLastCell = $table.find( 'tbody tr' ).eq( 1 ).find( 'td' ).eq( 3 );

		assert.strictEqual( $firstRowCell1.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,2 cell is visible before checkbox unchecked' );
		assert.strictEqual( $firstRowCell2.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,3 is visible before checkbox unchecked' );
		assert.strictEqual( $firstRowCell3.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,4 is visible before checkbox unchecked' );
		assert.strictEqual( $secondRowFatCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,2-3 is visible before checkbox unchecked' );
		assert.strictEqual( $secondRowLastCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,4 is visible before checkbox unchecked' );

		var lastcheck = $table.prev().find( '.tablesaw-columntoggle-btn' ).trigger( 'click' )
			.next().find( 'input[type="checkbox"]').last();
		if (!lastcheck[0].checked) {
			lastcheck.trigger( 'click' );
			assert.strictEqual ( lastcheck[0].checked, true, "Toggle button wasn't initially true and then should've been turned on.");
		}
		lastcheck.trigger( 'click' );
		assert.strictEqual ( lastcheck[0].checked, false, "Toggle button wasn't unchecked.");

		// close dialog
		$( '.tablesaw-columntoggle-popup .close' ).trigger( "click" );

		assert.strictEqual( $firstRowCell1.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,2 cell is visible after checkbox unchecked' );
		assert.strictEqual( $firstRowCell2.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 0,3 is visible after checkbox unchecked' );
		assert.strictEqual( $firstRowCell3.is( '.tablesaw-toggle-cellhidden' ), true, 'Cell 0,4 is hidden after checkbox unchecked' );
		assert.strictEqual( $secondRowFatCell.is( '.tablesaw-toggle-cellhidden' ), false, 'Cell 1,2-3 is visible after checkbox unchecked' );
		assert.strictEqual( $secondRowLastCell.is( '.tablesaw-toggle-cellhidden' ), true, 'Cell 1,4 is hidden after checkbox unchecked' );
	});

}( window.shoestring || window.jQuery || window.$jQ ));
