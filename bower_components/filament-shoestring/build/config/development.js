requirejs.config({
	pragmasOnSave: {
		exclude: true,
		development: true
	},
	findNestedDependencies: true,
	skipModuleInsertion: true,
	optimize: 'none',
	wrap: {
		start: "(function( w, undefined ){",
		end: "})( this );"
	}
});
