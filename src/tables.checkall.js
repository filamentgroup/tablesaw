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

		if( this.$table.data( pluginName ) ) {
			return;
		}
		this.$table.data( pluginName, this );
		this.init();
	}

	CheckAll.prototype.init = function() {
		this.$checkbox = this.$table.find( "thead" ).find( this.checkboxAllSelector );

		if( this.$checkbox.length ) {
			this.addEvents();
		}
	};

	CheckAll.prototype.addEvents = function() {
		var self = this;
		// Update body checkboxes when header checkbox is changed
		this.$checkbox.on( "change", function() {
			var setChecked = this.checked;
			var $th = $( this ).closest( "th" );
			if( $th.length ) {
				$( $th[ 0 ].cells ).find( self.checkboxSelector ).each(function() {
					this.checked = setChecked;
				});
			}
		});

		// Update header checkbox when body checkboxes are changed
		this.$table.find( "tbody " + this.checkboxSelector ).on( "change", function() {
			var cells;
			var checkedCount = 0;

			var $td = $( this ).closest( "th,td" );
			if( $td.length ) {
				cells = $td[ 0 ].headerCell.cells;

				$( cells ).find( self.checkboxSelector ).not( self.checkboxAllSelector ).each(function() {
					if( this.checked ) {
						checkedCount++;
					}
				});

				$( $td[ 0 ].headerCell ).find( self.checkboxSelector ).each(function() {
					var allSelected = checkedCount === cells.length;
					this.checked = allSelected;

					// only indeterminate if some are selected (not all and not none)
					this.indeterminate = checkedCount !== 0 && !allSelected;
				});
			}
		});
	};

	// on tablecreate, init
	$( document ).on( Tablesaw.events.create, function( e, tablesaw ){
		new CheckAll( tablesaw );
	});

}());
