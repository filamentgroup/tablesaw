requirejs.config({
	pragmasOnSave: {
		exclude: true,
		development: false
	},
	findNestedDependencies: true,
	skipModuleInsertion: true,
	optimize: 'none',
	wrap: {
		start: "(function( w, undefined ){",
		end: "})( this );"
	}
});
