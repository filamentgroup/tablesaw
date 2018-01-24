/*
* tablesaw: A set of plugins for responsive tables
* Mode Switch: UI element to allow the user to change table modes: stack/swipe/columntoggle
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function() {
	var S = {
		selectors: {
			init: "table[data-tablesaw-mode-switch]"
		},
		attributes: {
			excludeMode: "data-tablesaw-mode-exclude"
		},
		classes: {
			main: "tablesaw-modeswitch",
			toolbar: "tablesaw-bar-section"
		},
		modes: ["stack", "swipe", "columntoggle"],
		init: function(table) {
			var $table = $(table);
			var tblsaw = $table.data("tablesaw");
			var ignoreMode = $table.attr(S.attributes.excludeMode);
			var $toolbar = tblsaw.$toolbar;
			var $switcher = $("<div>").addClass(S.classes.main + " " + S.classes.toolbar);

			var html = [
					'<label><span class="abbreviated">' +
						Tablesaw.i18n.modeSwitchColumnsAbbreviated +
						'</span><span class="longform">' +
						Tablesaw.i18n.modeSwitchColumns +
						"</span>:"
				],
				dataMode = $table.attr("data-tablesaw-mode"),
				isSelected;

			// TODO next major version: remove .btn
			html.push('<span class="btn tablesaw-btn"><select>');
			for (var j = 0, k = S.modes.length; j < k; j++) {
				if (ignoreMode && ignoreMode.toLowerCase() === S.modes[j]) {
					continue;
				}

				isSelected = dataMode === S.modes[j];

				html.push(
					"<option" +
						(isSelected ? " selected" : "") +
						' value="' +
						S.modes[j] +
						'">' +
						Tablesaw.i18n.modes[j] +
						"</option>"
				);
			}
			html.push("</select></span></label>");

			$switcher.html(html.join(""));

			var $otherToolbarItems = $toolbar.find(".tablesaw-advance").eq(0);
			if ($otherToolbarItems.length) {
				$switcher.insertBefore($otherToolbarItems);
			} else {
				$switcher.appendTo($toolbar);
			}

			$switcher.find(".tablesaw-btn").tablesawbtn();
			$switcher.find("select").on("change", function(event) {
				return S.onModeChange.call(table, event, $(this).val());
			});
		},
		onModeChange: function(event, val) {
			var $table = $(this);
			var tblsaw = $table.data("tablesaw");
			var $switcher = tblsaw.$toolbar.find("." + S.classes.main);

			$switcher.remove();
			tblsaw.destroy();

			$table.attr("data-tablesaw-mode", val);
			$table.tablesaw();
		}
	};

	$(document).on(Tablesaw.events.create, function(e, Tablesaw) {
		if (Tablesaw.$table.is(S.selectors.init)) {
			S.init(Tablesaw.table);
		}
	});

	// TODO OOP this and add to Tablesaw object
})();
