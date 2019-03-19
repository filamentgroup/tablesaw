/*
 * tablesaw: A set of plugins for responsive tables
 * Swipe Toggle: swipe gesture (or buttons) to navigate which columns are shown.
 * Copyright (c) 2013 Filament Group, Inc.
 * MIT License
 */

(function() {
	var classes = {
		hideBtn: "disabled",
		persistWidths: "tablesaw-fix-persist",
		hiddenCol: "tablesaw-swipe-cellhidden",
		persistCol: "tablesaw-swipe-cellpersist",
		allColumnsVisible: "tablesaw-all-cols-visible"
	};
	var attrs = {
		disableTouchEvents: "data-tablesaw-no-touch",
		ignorerow: "data-tablesaw-ignorerow",
		subrow: "data-tablesaw-subrow"
	};

	function createSwipeTable(tbl, $table) {
		var tblsaw = $table.data("tablesaw");

		var $btns = $("<div class='tablesaw-advance'></div>");
		// TODO next major version: remove .btn
		var $prevBtn = $(
			"<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro left'>" +
				Tablesaw.i18n.swipePreviousColumn +
				"</a>"
		).appendTo($btns);
		// TODO next major version: remove .btn
		var $nextBtn = $(
			"<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro right'>" +
				Tablesaw.i18n.swipeNextColumn +
				"</a>"
		).appendTo($btns);

		var $headerCells = tbl._getPrimaryHeaderCells();
		var $headerCellsNoPersist = $headerCells.not('[data-tablesaw-priority="persist"]');
		var headerWidths = [];
		var headerWidthsNoPersist = [];
		var $head = $(document.head || "head");
		var tableId = $table.attr("id");

		if (!$headerCells.length) {
			throw new Error("tablesaw swipe: no header cells found.");
		}

		$table.addClass("tablesaw-swipe");

		function initMinHeaderWidths() {
			$table.css({
				width: "1px"
			});

			// remove any hidden columns
			$table.find("." + classes.hiddenCol).removeClass(classes.hiddenCol);

			headerWidths = [];
			headerWidthsNoPersist = [];
			// Calculate initial widths
			$headerCells.each(function() {
				var width = this.offsetWidth;
				headerWidths.push(width);
				if (!isPersistent(this)) {
					headerWidthsNoPersist.push(width);
				}
			});

			// reset props
			$table.css({
				width: ""
			});
		}

		initMinHeaderWidths();

		$btns.appendTo(tblsaw.$toolbar);

		if (!tableId) {
			tableId = "tableswipe-" + Math.round(Math.random() * 10000);
			$table.attr("id", tableId);
		}

		function showColumn(headerCell) {
			tblsaw._$getCells(headerCell).removeClass(classes.hiddenCol);
		}

		function hideColumn(headerCell) {
			tblsaw._$getCells(headerCell).addClass(classes.hiddenCol);
		}

		function persistColumn(headerCell) {
			tblsaw._$getCells(headerCell).addClass(classes.persistCol);
		}

		function isPersistent(headerCell) {
			return $(headerCell).is('[data-tablesaw-priority="persist"]');
		}

		function unmaintainWidths() {
			$table.removeClass(classes.persistWidths);
			$("#" + tableId + "-persist").remove();
		}

		function maintainWidths() {
			var prefix = "#" + tableId + ".tablesaw-swipe ";
			var styles = [];
			var tableWidth = $table.width();
			var tableWidthNoPersistantColumns = tableWidth;
			var hash = [];
			var newHash;

			// save persistent column widths (as long as they take up less than 75% of table width)
			$headerCells.each(function(index) {
				var width;
				if (isPersistent(this)) {
					width = this.offsetWidth;
					tableWidthNoPersistantColumns -= width;

					if (width < tableWidth * 0.75) {
						hash.push(index + "-" + width);
						styles.push(
							prefix +
								" ." +
								classes.persistCol +
								":nth-child(" +
								(index + 1) +
								") { width: " +
								width +
								"px; }"
						);
					}
				}
			});
			newHash = hash.join("_");

			if (styles.length) {
				$table.addClass(classes.persistWidths);
				var $style = $("#" + tableId + "-persist");
				// If style element not yet added OR if the widths have changed
				if (!$style.length || $style.data("tablesaw-hash") !== newHash) {
					// Remove existing
					$style.remove();

					$("<style>" + styles.join("\n") + "</style>")
						.attr("id", tableId + "-persist")
						.data("tablesaw-hash", newHash)
						.appendTo($head);
				}
			}

			return tableWidthNoPersistantColumns;
		}

		function getNext() {
			var next = [];
			var checkFound;
			$headerCellsNoPersist.each(function(i) {
				var $t = $(this);
				var isHidden = $t.css("display") === "none" || $t.is("." + classes.hiddenCol);

				if (!isHidden && !checkFound) {
					checkFound = true;
					next[0] = i;
				} else if (isHidden && checkFound) {
					next[1] = i;

					return false;
				}
			});

			return next;
		}

		function getPrev() {
			var next = getNext();
			return [next[1] - 1, next[0] - 1];
		}

		function canNavigate(pair) {
			return pair[1] > -1 && pair[1] < $headerCellsNoPersist.length;
		}

		function matchesMedia() {
			var matchMedia = $table.attr("data-tablesaw-swipe-media");
			return !matchMedia || ("matchMedia" in window && window.matchMedia(matchMedia).matches);
		}

		function fakeBreakpoints() {
			if (!matchesMedia()) {
				return;
			}

			var containerWidth = $table.parent().width(),
				persist = [],
				sum = 0,
				sums = [],
				visibleNonPersistantCount = $headerCells.length;

			$headerCells.each(function(index) {
				var $t = $(this),
					isPersist = $t.is('[data-tablesaw-priority="persist"]');

				persist.push(isPersist);
				sum += headerWidths[index];
				sums.push(sum);

				// is persistent or is hidden
				if (isPersist || sum > containerWidth) {
					visibleNonPersistantCount--;
				}
			});

			// We need at least one column to swipe.
			var needsNonPersistentColumn = visibleNonPersistantCount === 0;

			$headerCells.each(function(index) {
				if (sums[index] > containerWidth) {
					hideColumn(this);
				}
			});

			var firstPersist = true;
			$headerCells.each(function(index) {
				if (persist[index]) {
					// for visual box-shadow
					persistColumn(this);

					if (firstPersist) {
						tblsaw._$getCells(this).css("width", sums[index] + "px");
						firstPersist = false;
					}
					return;
				}

				if (sums[index] <= containerWidth || needsNonPersistentColumn) {
					needsNonPersistentColumn = false;
					showColumn(this);
					tblsaw.updateColspanCells(classes.hiddenCol, this, true);
				}
			});

			unmaintainWidths();

			$table.trigger("tablesawcolumns");
		}

		function goForward() {
			navigate(true);
		}
		function goBackward() {
			navigate(false);
		}

		function navigate(isNavigateForward) {
			var pair;
			if (isNavigateForward) {
				pair = getNext();
			} else {
				pair = getPrev();
			}

			if (canNavigate(pair)) {
				if (isNaN(pair[0])) {
					if (isNavigateForward) {
						pair[0] = 0;
					} else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				var roomForColumnsWidth = maintainWidths();
				var hideColumnIndex = pair[0];
				var showColumnIndex = pair[1];

				// Hide one column, show one or more based on how much space was freed up
				var columnToShow;
				var columnToHide = $headerCellsNoPersist.get(hideColumnIndex);
				var wasAtLeastOneColumnShown = false;
				var atLeastOneColumnIsVisible = false;

				hideColumn(columnToHide);
				tblsaw.updateColspanCells(classes.hiddenCol, columnToHide, true);

				var columnIndex = hideColumnIndex + (isNavigateForward ? 1 : -1);
				while (columnIndex >= 0 && columnIndex < headerWidthsNoPersist.length) {
					roomForColumnsWidth -= headerWidthsNoPersist[columnIndex];

					var $columnToShow = $headerCellsNoPersist.eq(columnIndex);
					if ($columnToShow.is(".tablesaw-swipe-cellhidden")) {
						if (roomForColumnsWidth > 0) {
							columnToShow = $columnToShow.get(0);
							wasAtLeastOneColumnShown = true;
							atLeastOneColumnIsVisible = true;
							showColumn(columnToShow);
							tblsaw.updateColspanCells(classes.hiddenCol, columnToShow, false);
						}
					} else {
						atLeastOneColumnIsVisible = true;
					}

					if (isNavigateForward) {
						columnIndex++;
					} else {
						columnIndex--;
					}
				}

				if (!atLeastOneColumnIsVisible) {
					// if no columns are showing, at least show the first one we were aiming for.
					columnToShow = $headerCellsNoPersist.get(showColumnIndex);
					showColumn(columnToShow);
					tblsaw.updateColspanCells(classes.hiddenCol, columnToShow, false);
				} else if (
					!wasAtLeastOneColumnShown &&
					canNavigate(isNavigateForward ? getNext() : getPrev())
				) {
					// if our one new column was hidden but no new columns were shown, let’s navigate again automatically.
					navigate(isNavigateForward);
				}
				$table.trigger("tablesawcolumns");
			}
		}

		$prevBtn.add($nextBtn).on("click", function(e) {
			if (!!$(e.target).closest($nextBtn).length) {
				goForward();
			} else {
				goBackward();
			}
			e.preventDefault();
		});

		function getCoord(event, key) {
			return (event.touches || event.originalEvent.touches)[0][key];
		}

		if (!$table.is("[" + attrs.disableTouchEvents + "]")) {
			$table.on("touchstart.swipetoggle", function(e) {
				var originX = getCoord(e, "pageX");
				var originY = getCoord(e, "pageY");
				var x;
				var y;
				var scrollTop = window.pageYOffset;

				$(window).off(Tablesaw.events.resize, fakeBreakpoints);

				$(this)
					.on("touchmove.swipetoggle", function(e) {
						x = getCoord(e, "pageX");
						y = getCoord(e, "pageY");
					})
					.on("touchend.swipetoggle", function() {
						var cfg = tbl.getConfig({
							swipeHorizontalThreshold: 30,
							swipeVerticalThreshold: 30
						});

						// This config code is a little awkward because shoestring doesn’t support deep $.extend
						// Trying to work around when devs only override one of (not both) horizontalThreshold or
						// verticalThreshold in their TablesawConfig.
						// @TODO major version bump: remove cfg.swipe, move to just use the swipePrefix keys
						var verticalThreshold = cfg.swipe
							? cfg.swipe.verticalThreshold
							: cfg.swipeVerticalThreshold;
						var horizontalThreshold = cfg.swipe
							? cfg.swipe.horizontalThreshold
							: cfg.swipeHorizontalThreshold;

						var isPageScrolled = Math.abs(window.pageYOffset - scrollTop) >= verticalThreshold;
						var isVerticalSwipe = Math.abs(y - originY) >= verticalThreshold;

						if (!isVerticalSwipe && !isPageScrolled) {
							if (x - originX < -1 * horizontalThreshold) {
								goForward();
							}
							if (x - originX > horizontalThreshold) {
								goBackward();
							}
						}

						window.setTimeout(function() {
							$(window).on(Tablesaw.events.resize, fakeBreakpoints);
						}, 300);

						$(this).off("touchmove.swipetoggle touchend.swipetoggle");
					});
			});
		}

		$table
			.on("tablesawcolumns.swipetoggle", function() {
				var canGoPrev = canNavigate(getPrev());
				var canGoNext = canNavigate(getNext());
				$prevBtn[canGoPrev ? "removeClass" : "addClass"](classes.hideBtn);
				$nextBtn[canGoNext ? "removeClass" : "addClass"](classes.hideBtn);

				tblsaw.$toolbar[!canGoPrev && !canGoNext ? "addClass" : "removeClass"](
					classes.allColumnsVisible
				);
			})
			.on("tablesawnext.swipetoggle", function() {
				goForward();
			})
			.on("tablesawprev.swipetoggle", function() {
				goBackward();
			})
			.on(Tablesaw.events.destroy + ".swipetoggle", function() {
				var $t = $(this);

				$t.removeClass("tablesaw-swipe");
				tblsaw.$toolbar.find(".tablesaw-advance").remove();
				$(window).off(Tablesaw.events.resize, fakeBreakpoints);

				$t.off(".swipetoggle");
			})
			.on(Tablesaw.events.refresh, function() {
				unmaintainWidths();
				initMinHeaderWidths();
				fakeBreakpoints();
			});

		fakeBreakpoints();
		$(window).on(Tablesaw.events.resize, fakeBreakpoints);
	}

	// on tablecreate, init
	$(document).on(Tablesaw.events.create, function(e, tablesaw) {
		if (tablesaw.mode === "swipe") {
			createSwipeTable(tablesaw, tablesaw.$table);
		}
	});

	// TODO OOP this and add to Tablesaw object
})();
