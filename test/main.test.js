import test from 'ava';
// import "console-advanced";
import Tablesaw from '../dist/tablesaw.js';

test('Tablesaw, DOM lib exists', t => {
	t.is(typeof Tablesaw, "object");
	t.is(typeof Tablesaw.$, "function");
	t.not(typeof Tablesaw.Table, "undefined");
	t.not(typeof Tablesaw.Stack, "undefined");
	t.not(typeof Tablesaw.ColumnToggle, "undefined");
	// t.not(typeof Tablesaw.Sortable, "undefined"); // TODO
	// t.not(typeof Tablesaw.ModeSwitch, "undefined"); // TODO
	t.not(typeof Tablesaw.MiniMap, "undefined");
	// t.not(typeof Tablesaw.Btn, "undefined"); // TODO
	t.not(typeof Tablesaw.CheckAll, "undefined");
});

test('MiniMap.show returns false when attribute is not set', t => {
	var table = document.createElement( "table" );
	t.is(Tablesaw.MiniMap.show(table), false);
});

test('MiniMap.show returns true when attribute is set (but value-less)', t => {
	var table = document.createElement( "table" );
	table.setAttribute( Tablesaw.MiniMap.attr.init, "" );
	t.is(Tablesaw.MiniMap.show(table), true);
});