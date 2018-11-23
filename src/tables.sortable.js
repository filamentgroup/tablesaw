/*
* tablesaw: A set of plugins for responsive tables
* Sortable column headers
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function() {
	function getSortValue(cell) {
		var text = [];
		$(cell.childNodes).each(function() {
			var $el = $(this);
			if ($el.is("input, select")) {
				text.push($el.val());
			} else if ($el.is(".tablesaw-cell-label")) {
			} else {
				text.push(($el.text() || "").replace(/^\s+|\s+$/g, ""));
			}
		});

		return text.join("");
	}

	var pluginName = "tablesaw-sortable",
		initSelector = "table[data-" + pluginName + "]",
		sortableSwitchSelector = "[data-" + pluginName + "-switch]",
		defaultAutoSortSelector = "[data-" + pluginName + "-default-autosort]",
		memorizeSortSelector = "[data-" + pluginName + "-memorize]",
		attrs = {
			sortCol: "data-tablesaw-sortable-col",
			defaultCol: "data-tablesaw-sortable-default-col",
			numericCol: "data-tablesaw-sortable-numeric",
			subRow: "data-tablesaw-subrow",
			ignoreRow: "data-tablesaw-ignorerow",
			forceOrder: "data-tablesaw-sortable-forceorder",
			noHint: "data-tablesaw-sortable-nohint"
		},
		classes = {
			head: pluginName + "-head",
			ascend: pluginName + "-ascending",
			descend: pluginName + "-descending",
			switcher: pluginName + "-switch",
			tableToolbar: "tablesaw-bar-section",
			sortButton: pluginName + "-btn"
		},
		methods = {
			_create: function(o) {
				return $(this).each(function() {
					var init = $(this).data(pluginName + "-init");
					if (init) {
						return false;
					}
					$(this)
						.data(pluginName + "-init", true)
						.trigger("beforecreate." + pluginName)
						[pluginName]("_init", o)
						.trigger("create." + pluginName);
				});
			},
			_init: function() {
				var el = $(this);
				var tblsaw = el.data("tablesaw");
				var heads;
				var $switcher;

				function addClassToHeads(h) {
					$.each(h, function(i, v) {
						$(v).addClass(classes.head);
					});
				}

				function makeHeadsActionable(h, fn) {
					$.each(h, function(i, col) {
						var b = $("<button class='" + classes.sortButton + "'/>");
						b.on("click", fn);
						$(col).wrapInner(b);
						if (!$(col).is("[" + attrs.noHint + "]")) {
							$(col)
								.find("button")
								.append("<span class='tablesaw-sortable-arrow'>");
						}
					});
				}

				function clearOthers(headcell) {
					$.each(headcell.siblings(), function(i, v) {
						var col = $(v);
						col.removeAttr(attrs.defaultCol);
						col.removeClass(classes.ascend);
						col.removeClass(classes.descend);
					});
				}

				function headsOnAction(e) {
					if ($(e.target).is("a[href]")) {
						return;
					}

					e.stopPropagation();

					var headCell = $(e.target).closest("[" + attrs.sortCol + "]");
					toggleSort(headCell);

					if (el.is(memorizeSortSelector)) {
						memorizeSort({
							label: headCell.text(),
							order: headCell.is("." + classes.descend) ? "desc" : "asc"
						});
					}

					e.preventDefault();
				}

				/**
				 * Updates table by flipping sort order (if allowed) of column whose head is headcell.
				 * @param {jQuery} headcell
				 */
				function toggleSort(headcell) {
					var newSortValue = heads.index(headcell[0]);
					clearOthers(headcell);

					var inAscState = headcell.is("." + classes.ascend),
						forcedDesc = headcell.is("[" + attrs.forceOrder + '="desc"]'),
						forcedAsc = headcell.is("[" + attrs.forceOrder + '="asc"]');
					if (forcedAsc || (!forcedDesc && !inAscState)) {
						//sort asc by default
						el[pluginName]("sortBy", headcell[0], true);
						newSortValue += "_asc";
					} else if (forcedDesc || (!forcedAsc && inAscState)) {
						el[pluginName]("sortBy", headcell[0]);
						newSortValue += "_desc";
					}

					updateSwitcher(newSortValue);
				}

				/**
				 * Updates table using sort order of column whose head is headcell.
				 * Effecively a refresh.
				 * @param {*} headcell
				 */
				function resort(headcell) {
					var newSortValue = heads.index(headcell[0]);
					clearOthers(headcell);

					var inDescState = headcell.is("." + classes.descend),
						forcedDesc = headcell.is("[" + attrs.forceOrder + '="desc"]'),
						forcedAsc = headcell.is("[" + attrs.forceOrder + '="asc"]');
					if (forcedAsc || (!forcedDesc && !inDescState)) {
						//sort asc by default
						el[pluginName]("sortBy", headcell[0], true);
						newSortValue += "_asc";
					} else if (forcedDesc || (!forcedAsc && inDescState)) {
						el[pluginName]("sortBy", headcell[0]);
						newSortValue += "_desc";
					}

					updateSwitcher(newSortValue);
				}

				function updateSwitcher(newsortvalue) {
					if ($switcher) {
						$switcher
							.find("select")
							.val(newsortvalue)
							.trigger("refresh");
					}
				}

				function suggestDefault(heads) {
					var past = retrieveSort();
					var pastDefaultCol = heads.filter(function(index) {
						return heads.eq(index).text() === past.label;
					});
					if (pastDefaultCol.length > 0) {
						el[pluginName]("makeColDefault", pastDefaultCol, past.order === "desc" ? false : true);
						clearOthers(pastDefaultCol); //no more than two default columns
					}
				}

				function handleDefault(defaultCol) {
					if (defaultCol.is("[" + attrs.forceOrder + '="asc"]')) {
						defaultCol.addClass(classes.ascend);
					} else if (defaultCol.is("[" + attrs.forceOrder + '="desc"]')) {
						defaultCol.addClass(classes.descend);
					} else if (!defaultCol.is("." + classes.descend)) {
						defaultCol.addClass(classes.ascend);
					}
				}

				function addSwitcher(heads) {
					$switcher = $("<div>")
						.addClass(classes.switcher)
						.addClass(classes.tableToolbar);

					var html = ["<label>" + Tablesaw.i18n.sort + ":"]; //TODO: Move some Captions here?

					// TODO next major version: remove .btn
					html.push('<span class="btn tablesaw-btn"><select>');
					heads.each(function(j) {
						var $t = $(this);
						var isDefaultCol = $t.is("[" + attrs.defaultCol + "]");
						var isDescending = $t.is("." + classes.descend);
						var nohint = $t.is("[" + attrs.noHint + "]");
						var forceAsc = $t.is("[" + attrs.forceOrder + '="asc"]');
						var forceDesc = $t.is("[" + attrs.forceOrder + '="desc"]');
						var hasNumericAttribute = $t.is("[" + attrs.numericCol + "]");
						var numericCount = 0;
						// Check only the first four rows to see if the column is numbers.
						var numericCountMax = 5;

						$(this.cells.slice(0, numericCountMax)).each(function() {
							if (!isNaN(parseInt(getSortValue(this), 10))) {
								numericCount++;
							}
						});
						var isNumeric = numericCount === numericCountMax;
						if (!hasNumericAttribute) {
							$t.attr(attrs.numericCol, isNumeric ? "" : "false");
						}

						if (!forceDesc) {
							html.push(
								"<option" +
									(isDefaultCol && !isDescending ? " selected" : "") +
									' value="' +
									j +
									'_asc">' +
									$t.text() +
									(nohint ? "" : " " + (isNumeric ? "&#x2191;" : "(A-Z)")) +
									"</option>"
							);
						}
						if (!forceAsc) {
							html.push(
								"<option" +
									(isDefaultCol && isDescending ? " selected" : "") +
									' value="' +
									j +
									'_desc">' +
									$t.text() +
									(nohint ? "" : " " + (isNumeric ? "&#x2193;" : "(Z-A)")) +
									"</option>"
							);
						}
					});
					html.push("</select></span></label>");

					$switcher.html(html.join(""));

					var $firstChild = tblsaw.$toolbar.children().eq(0);
					if ($firstChild.length) {
						$switcher.insertBefore($firstChild);
					} else {
						$switcher.appendTo(tblsaw.$toolbar);
					}
					$switcher.find(".tablesaw-btn").tablesawbtn();
					$switcher.find("select").on("change", function() {
						var val = $(this)
								.val()
								.split("_"),
							head = heads.eq(val[0]);

						if (el.is(memorizeSortSelector)) {
							memorizeSort({
								label: head.text(),
								order: val[1]
							});
						}
						clearOthers(head.siblings());
						el[pluginName]("sortBy", head.get(0), val[1] === "asc");
					});
				}

				function memorizeSort(obj) {
					var d = new Date();
					d.setTime(d.getTime() + 1 * 24 * 60 * 1000);
					for (var key in obj) {
						document.cookie = [key + "=" + obj[key], "path=/", "expires=" + d.toUTCString()].join(
							";"
						);
					}
				}

				function retrieveSort() {
					var pastSort = {};
					document.cookie.split(";").forEach(function(cookie) {
						var tokens = cookie.split("=");
						if (tokens.length == 2) {
							pastSort[tokens[0].trim()] = tokens[1].trim();
						} //else no or bad cookie
					});
					return pastSort;
				}

				el.addClass(pluginName);

				heads = el
					.children()
					.filter("thead")
					.find("th[" + attrs.sortCol + "]");

				if (el.is(memorizeSortSelector)) {
					suggestDefault(heads); //merely suggest, handleDefault will consider forced order
					el.attr(defaultAutoSortSelector.replace(/[\[\]]/g, ""), ""); //implied by memorizeSortSelector
				}

				var defaultcol = heads.filter("[" + attrs.defaultCol + "]").eq(0); //pitfall: "find" searches in descendants!
				addClassToHeads(heads);
				makeHeadsActionable(heads, headsOnAction); //sortable columns have actionable <th> by default
				handleDefault(defaultcol);

				if (el.is(sortableSwitchSelector)) {
					addSwitcher(heads);
				}

				if (el.is(defaultAutoSortSelector)) {
					resort(defaultcol);
				}
			},
			sortRows: function(rows, colNum, ascending, col, tbody) {
				function convertCells(cellArr, belongingToTbody) {
					var cells = [];
					$.each(cellArr, function(i, cell) {
						var row = cell.parentNode;
						var $row = $(row);
						// next row is a subrow
						var subrows = [];
						var $next = $row.next();
						while ($next.is("[" + attrs.subRow + "]")) {
							subrows.push($next[0]);
							$next = $next.next();
						}

						var tbody = row.parentNode;

						// current row is a subrow
						if ($row.is("[" + attrs.subRow + "]")) {
						} else if (tbody === belongingToTbody) {
							cells.push({
								element: cell,
								cell: getSortValue(cell),
								row: row,
								subrows: subrows.length ? subrows : null,
								ignored: $row.is("[" + attrs.ignoreRow + "]")
							});
						}
					});
					return cells;
				}

				function getSortFxn(ascending, forceNumeric) {
					var fn,
						regex = /[^\-\+\d\.]/g;
					if (ascending) {
						fn = function(a, b) {
							if (a.ignored || b.ignored) {
								return 0;
							}
							if (forceNumeric) {
								return (
									parseFloat(a.cell.replace(regex, "")) - parseFloat(b.cell.replace(regex, ""))
								);
							} else {
								return a.cell.toLowerCase() > b.cell.toLowerCase() ? 1 : -1;
							}
						};
					} else {
						fn = function(a, b) {
							if (a.ignored || b.ignored) {
								return 0;
							}
							if (forceNumeric) {
								return (
									parseFloat(b.cell.replace(regex, "")) - parseFloat(a.cell.replace(regex, ""))
								);
							} else {
								return a.cell.toLowerCase() < b.cell.toLowerCase() ? 1 : -1;
							}
						};
					}
					return fn;
				}

				function convertToRows(sorted) {
					var newRows = [],
						i,
						l;
					for (i = 0, l = sorted.length; i < l; i++) {
						newRows.push(sorted[i].row);
						if (sorted[i].subrows) {
							newRows.push(sorted[i].subrows);
						}
					}
					return newRows;
				}

				var fn;
				var sorted;
				var cells = convertCells(col.cells, tbody);

				var customFn = $(col).data("tablesaw-sort");

				fn =
					(customFn && typeof customFn === "function" ? customFn(ascending) : false) ||
					getSortFxn(
						ascending,
						$(col).is("[" + attrs.numericCol + "]") &&
							!$(col).is("[" + attrs.numericCol + '="false"]')
					);

				sorted = cells.sort(fn);

				rows = convertToRows(sorted);

				return rows;
			},
			makeColDefault: function(col, a) {
				var c = $(col);
				c.attr(attrs.defaultCol, "true");
				if (a) {
					c.removeClass(classes.descend);
					c.addClass(classes.ascend);
				} else {
					c.removeClass(classes.ascend);
					c.addClass(classes.descend);
				}
			},
			sortBy: function(col, ascending) {
				var el = $(this);
				var colNum;
				var tbl = el.data("tablesaw");
				tbl.$tbody.each(function() {
					var tbody = this;
					var $tbody = $(this);
					var rows = tbl.getBodyRows(tbody);
					var sortedRows;
					var map = tbl.headerMapping[0];
					var j, k;

					// find the column number that we’re sorting
					for (j = 0, k = map.length; j < k; j++) {
						if (map[j] === col) {
							colNum = j;
							break;
						}
					}

					sortedRows = el[pluginName]("sortRows", rows, colNum, ascending, col, tbody);

					// replace Table rows
					for (j = 0, k = sortedRows.length; j < k; j++) {
						$tbody.append(sortedRows[j]);
					}
				});

				el[pluginName]("makeColDefault", col, ascending);

				el.trigger("tablesaw-sorted");
			}
		};

	// Collection method.
	$.fn[pluginName] = function(arrg) {
		var args = Array.prototype.slice.call(arguments, 1),
			returnVal;

		// if it's a method
		if (arrg && typeof arrg === "string") {
			returnVal = $.fn[pluginName].prototype[arrg].apply(this[0], args);
			return typeof returnVal !== "undefined" ? returnVal : $(this);
		}
		// check init
		if (!$(this).data(pluginName + "-active")) {
			$(this).data(pluginName + "-active", true);
			$.fn[pluginName].prototype._create.call(this, arrg);
		}
		return $(this);
	};
	// add methods
	$.extend($.fn[pluginName].prototype, methods);

	$(document).on(Tablesaw.events.create, function(e, Tablesaw) {
		if (Tablesaw.$table.is(initSelector)) {
			Tablesaw.$table[pluginName]();
		}
	});

	// TODO OOP this and add to Tablesaw object
})();
