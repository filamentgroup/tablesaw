/*
* tablesaw: A set of plugins for responsive tables
* Check all Checkbox: checkbox in header cell selects all checkboxes in the same table column.
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function() {
	var pluginName = "tablesawCheckAll";

	function CheckAll(tablesaw) {
		this.tablesaw = tablesaw;
		this.$table = tablesaw.$table;

		this.attr = "data-tablesaw-checkall";
		this.checkAllSelector = "[" + this.attr + "]";
		this.forceCheckedSelector = "[" + this.attr + "-checked]";
		this.forceUncheckedSelector = "[" + this.attr + "-unchecked]";
		this.checkboxSelector = 'input[type="checkbox"]';

		this.$triggers = null;
		this.$checkboxes = null;

		if (this.$table.data(pluginName)) {
			return;
		}
		this.$table.data(pluginName, this);
		this.init();
	}

	CheckAll.prototype._filterCells = function($checkboxes) {
		return $checkboxes
			.filter(function() {
				return !$(this)
					.closest("tr")
					.is("[data-tablesaw-subrow],[data-tablesaw-ignorerow]");
			})
			.find(this.checkboxSelector)
			.not(this.checkAllSelector);
	};

	// With buttons you can use a scoping selector like: data-tablesaw-checkall="#my-scoped-id input[type='checkbox']"
	CheckAll.prototype.getCheckboxesForButton = function(button) {
		return this._filterCells($($(button).attr(this.attr)));
	};

	CheckAll.prototype.getCheckboxesForCheckbox = function(checkbox) {
		return this._filterCells($($(checkbox).closest("th")[0].cells));
	};

	CheckAll.prototype.init = function() {
		var self = this;
		this.$table.find(this.checkAllSelector).each(function() {
			var $trigger = $(this);
			if ($trigger.is(self.checkboxSelector)) {
				self.addCheckboxEvents(this);
			} else {
				self.addButtonEvents(this);
			}
		});
	};

	CheckAll.prototype.addButtonEvents = function(trigger) {
		var self = this;

		// Update body checkboxes when header checkbox is changed
		$(trigger).on("click", function(event) {
			event.preventDefault();

			var $checkboxes = self.getCheckboxesForButton(this);

			var allChecked = true;
			$checkboxes.each(function() {
				if (!this.checked) {
					allChecked = false;
				}
			});

			var setChecked;
			if ($(this).is(self.forceCheckedSelector)) {
				setChecked = true;
			} else if ($(this).is(self.forceUncheckedSelector)) {
				setChecked = false;
			} else {
				setChecked = allChecked ? false : true;
			}

			$checkboxes.each(function() {
				this.checked = setChecked;

				$(this).trigger("change." + pluginName);
			});
		});
	};

	CheckAll.prototype.addCheckboxEvents = function(trigger) {
		var self = this;

		// Update body checkboxes when header checkbox is changed
		$(trigger).on("change", function() {
			var setChecked = this.checked;

			self.getCheckboxesForCheckbox(this).each(function() {
				this.checked = setChecked;
			});
		});

		var $checkboxes = self.getCheckboxesForCheckbox(trigger);

		// Update header checkbox when body checkboxes are changed
		$checkboxes.on("change." + pluginName, function() {
			var checkedCount = 0;
			$checkboxes.each(function() {
				if (this.checked) {
					checkedCount++;
				}
			});

			var allSelected = checkedCount === $checkboxes.length;

			trigger.checked = allSelected;

			// only indeterminate if some are selected (not all and not none)
			trigger.indeterminate = checkedCount !== 0 && !allSelected;
		});
	};

	// on tablecreate, init
	$(document).on(Tablesaw.events.create, function(e, tablesaw) {
		new CheckAll(tablesaw);
	});

	Tablesaw.CheckAll = CheckAll;
})();
