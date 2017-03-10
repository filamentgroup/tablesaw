/*
* tablesaw: A set of plugins for responsive tables
* Check all Checkbox: checkbox in header cell selects all checkboxes in the same table column.
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function(){
	var pluginName = "tablesawCheckAll";

	function CheckAll( tablesaw ) {
		this.tablesaw = tablesaw;
		this.$table = tablesaw.$table;
		this.checkboxAllSelector = "input[type=\"checkbox\"][data-tablesaw-checkall]";
		this.checkboxSelector = "input[type=\"checkbox\"]";

		this.$checkbox = null;
		this.$checkboxes = null;

		if( this.$table.data( pluginName ) ) {
			return;
		}
		this.$table.data( pluginName, this );
		this.init();
	}

	CheckAll.prototype.init = function() {
		this.$checkbox = this.$table.find( "thead" ).find( this.checkboxAllSelector );

		if( this.$checkbox.length ) {
			this.$checkboxes = $( this.$checkbox.closest( "th" )[ 0 ].cells ).filter(function() {
				return !$( this ).closest( "tr" ).is( "[data-tablesaw-subrow],[data-tablesaw-ignorerow]" );
			}).find( this.checkboxSelector ).not( this.checkboxAllSelector );

			this.addEvents();
		}
	};

	CheckAll.prototype.addEvents = function() {
		var self = this;

		// Update body checkboxes when header checkbox is changed
		this.$checkbox.on( "change", function() {
			var setChecked = this.checked;

			// TODO? filter only visible checkboxes
			self.$checkboxes.each(function() {
				this.checked = setChecked;
			});
		});

		// Update header checkbox when body checkboxes are changed
		
		this.$checkboxes.on( "change", function() {
			var checkedCount = 0;
			self.$checkboxes.each(function() {
				if( this.checked ) {
					checkedCount++;
				}
			});

			var allSelected = checkedCount === self.$checkboxes.length;

			self.$checkbox[ 0 ].checked = allSelected;

			// only indeterminate if some are selected (not all and not none)
			self.$checkbox[ 0 ].indeterminate = checkedCount !== 0 && !allSelected;
		});
	};

	// on tablecreate, init
	$( document ).on( Tablesaw.events.create, function( e, tablesaw ){
		new CheckAll( tablesaw );
	});

}());
