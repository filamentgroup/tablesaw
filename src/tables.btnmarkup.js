/*
* tablesaw: A set of plugins for responsive tables
* Button component
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

(function() {
	var pluginName = "tablesawbtn",
		methods = {
			_create: function() {
				return $(this).each(function() {
					$(this)
						.trigger("beforecreate." + pluginName)
						[pluginName]("_init")
						.trigger("create." + pluginName);
				});
			},
			_init: function() {
				var oEl = $(this),
					sel = this.getElementsByTagName("select")[0];

				if (sel) {
					// TODO next major version: remove .btn-select
					$(this)
						.addClass("btn-select tablesaw-btn-select")
						[pluginName]("_select", sel);
				}
				return oEl;
			},
			_select: function(sel) {
				var update = function(oEl, sel) {
					var opts = $(sel).find("option");
					var label = document.createElement("span");
					var el;
					var children;
					var found = false;

					label.setAttribute("aria-hidden", "true");
					label.innerHTML = "&#160;";

					opts.each(function() {
						var opt = this;
						if (opt.selected) {
							label.innerHTML = opt.text;
						}
					});

					children = oEl.childNodes;
					if (opts.length > 0) {
						for (var i = 0, l = children.length; i < l; i++) {
							el = children[i];

							if (el && el.nodeName.toUpperCase() === "SPAN") {
								oEl.replaceChild(label, el);
								found = true;
							}
						}

						if (!found) {
							oEl.insertBefore(label, oEl.firstChild);
						}
					}
				};

				update(this, sel);
				// todo should this be tablesawrefresh?
				$(this).on("change refresh", function() {
					update(this, sel);
				});
			}
		};

	// Collection method.
	$.fn[pluginName] = function(arrg, a, b, c) {
		return this.each(function() {
			// if it's a method
			if (arrg && typeof arrg === "string") {
				return $.fn[pluginName].prototype[arrg].call(this, a, b, c);
			}

			// don't re-init
			if ($(this).data(pluginName + "active")) {
				return $(this);
			}

			$(this).data(pluginName + "active", true);

			$.fn[pluginName].prototype._create.call(this);
		});
	};

	// add methods
	$.extend($.fn[pluginName].prototype, methods);

	// TODO OOP this and add to Tablesaw object
})();
