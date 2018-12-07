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

	function loadScriptPromise(src) {
		return new Promise((resolve, reject) => {
			var scr = document.createElement("script");
			scr.async = true;
			scr.src = src;
			scr.onload = resolve;
			document.head.appendChild(scr);
		});
	}

	function loadTablesawDynamically() {
		return loadScriptPromise("../dist/tablesaw.js");
	}

	function initializeTablesawUsingMethodCall() {
		if (!!window.Tablesaw) {
			Tablesaw.init();
		}
	}

	function initializeTablesawUsingInitScript() {
		return loadScriptPromise("../dist/tablesaw-init.js");
	}

	function createTableDynamically() {
		var tableSelection = $([
			'<table class="table-for-test" data-tablesaw-sortable>',
				'<thead>',
				'<tr>',
					'<th data-tablesaw-priority="1" data-tablesaw-sortable-col>Header 1</th>',
					'<th data-tablesaw-sortable-col data-tablesaw-sortable-numeric>Header 2</th>',
					'<th>Header 3</th>',
					'<th data-tablesaw-priority="6">Header 4</th>',
				'</tr>',
				'</thead>',
				'<tbody>',
				'<tr>',
					'<td>Body Row 1</td>',
					'<td>1</td>',
					'<td>foo</td>',
					'<td>bar</td>',
				'</tr>',
				'<tr>',
					'<td>Body Row 2</td>',
					'<td>2</td>',
					'<td>foo</td>',
					'<td>bar</td>',
				'</tr>',
				'<tr>',
					'<td>Body Row 3</td>',
					'<td>3</td>',
					'<td>foo</td>',
					'<td>bar</td>',
				'</tr>',
				'</tbody>',
			'</table>'].join(''));

		$( '#qunit-fixture' ).append(tableSelection);
		return tableSelection;
	}

	var tableCounter = 0;

	async function createAndInitializeTable(assert, initializeUsingInitScript) {
		tableCounter++;
		var tableSelection = createTableDynamically();

		var tableText = 'Table ' + tableCounter+': '; 
		var methodText = 'using ' + (initializeUsingInitScript ? 'tablesaw-init.js script.' : 'the init() method call.');

		assert.ok( !tableSelection.is('.tablesaw-sortable'), tableText + ' initialization class not found before being initialized ' + methodText );
		
		if (initializeUsingInitScript)
			await initializeTablesawUsingInitScript();
		else
			await initializeTablesawUsingMethodCall();

		assert.ok( tableSelection.is('.tablesaw-sortable'), tableText + ' initialization class found before being initialized ' + methodText );
	}

	QUnit.module( 'Global' );

	QUnit.test( 'tablesaw is dynamically loaded and tables are dynamically created and initialized', async function( assert ) {
		assert.ok( !window.Tablesaw, 'Tablesaw object is not available.' );
	 	assert.ok( !$( 'html' ).is('.tablesaw-enhanced'), 'Html initialization class is not set before Tablesaw is loaded.' );
		
		await loadTablesawDynamically();

		assert.ok( !!window.Tablesaw && !!window.Tablesaw.init, 'Tablesaw object is available.' );
		assert.ok( $( 'html' ).is('.tablesaw-enhanced'), 'Html initialization class is set after Tablesaw is loaded.' );

		await createAndInitializeTable(assert, false);
		await createAndInitializeTable(assert, true);

		await createAndInitializeTable(assert, false);
		await createAndInitializeTable(assert, true);
	});

}( window.shoestring || window.jQuery || window.$jQ ));
