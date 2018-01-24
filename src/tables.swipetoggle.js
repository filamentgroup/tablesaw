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
			// Calculate initial widths
			$headerCells.each(function() {
				headerWidths.push(this.offsetWidth);
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
			var prefix = "#" + tableId + ".tablesaw-swipe ",
				styles = [],
				tableWidth = $table.width(),
				hash = [],
				newHash;

			// save persistent column widths (as long as they take up less than 75% of table width)
			$headerCells.each(function(index) {
				var width;
				if (isPersistent(this)) {
					width = this.offsetWidth;

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
		}

		function getNext() {
			var next = [],
				checkFound;

			$headerCellsNoPersist.each(function(i) {
				var $t = $(this),
					isHidden = $t.css("display") === "none" || $t.is("." + classes.hiddenCol);

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

		function nextpair(fwd) {
			return fwd ? getNext() : getPrev();
		}

		function canAdvance(pair) {
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

			$headerCells.each(function(index) {
				if (persist[index]) {
					// for visual box-shadow
					persistColumn(this);
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

		function advance(fwd) {
			var pair = nextpair(fwd);
			if (canAdvance(pair)) {
				if (isNaN(pair[0])) {
					if (fwd) {
						pair[0] = 0;
					} else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				// TODO just blindly hiding the previous column and showing the next column can result in
				// column content overflow
				maintainWidths();
				hideColumn($headerCellsNoPersist.get(pair[0]));
				tblsaw.updateColspanCells(classes.hiddenCol, $headerCellsNoPersist.get(pair[0]), false);

				showColumn($headerCellsNoPersist.get(pair[1]));
				tblsaw.updateColspanCells(classes.hiddenCol, $headerCellsNoPersist.get(pair[1]), true);

				$table.trigger("tablesawcolumns");
			}
		}

		$prevBtn.add($nextBtn).on("click", function(e) {
			advance(!!$(e.target).closest($nextBtn).length);
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
								advance(true);
							}
							if (x - originX > horizontalThreshold) {
								advance(false);
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
				var canGoPrev = canAdvance(getPrev());
				var canGoNext = canAdvance(getNext());
				$prevBtn[canGoPrev ? "removeClass" : "addClass"](classes.hideBtn);
				$nextBtn[canGoNext ? "removeClass" : "addClass"](classes.hideBtn);

				tblsaw.$toolbar[!canGoPrev && !canGoNext ? "addClass" : "removeClass"](
					classes.allColumnsVisible
				);
			})
			.on("tablesawnext.swipetoggle", function() {
				advance(true);
			})
			.on("tablesawprev.swipetoggle", function() {
				advance(false);
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
