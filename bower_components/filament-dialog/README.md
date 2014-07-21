# dialog

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

Just a simple, minimal, Responsive jQuery dialog with typical interactivity

Demo page here: http://filamentgroup.github.com/dialog/example.html

[![Build Status](https://travis-ci.org/filamentgroup/dialog.svg)](https://travis-ci.org/filamentgroup/dialog)

## How-to

The dialog itself is an element with a class of dialog.  It'll auto-initialize on dom-ready.


### Full typical markup

````
Dialog:
<div class="dialog" id="mydialog">
	<p>This is a dialog</p>
	<a href="#mydialog-btn" class="dialog-close">Close</a>
</div>

Any number of links to open dialog:
<a href="#mydialog" id="mydialog-btn">Open Dialog</a>
````

### Markup broken down

The dialog itself is an element with a class of dialog:

````
<div class="dialog">Content here...</div>
````

To open it via a link, give the dialog an `id` and link to that ID somewhere on the page:

````
Dialog:
<div class="dialog" id="mydialog">Content here....</div>

Link to dialog:
<a href="#mydialog">Open Dialog</a>
````

Once open, the dialog can be closed via back button, escape key, clicking or tapping the overlay screen (if styled to be visible).

You can also add a close link by adding a link with a class of `dialog-close`.

````
<div class="dialog" id="mydialog">
	<p>This is a dialog</p>
	<a href="#" class="dialog-close">Close</a>
</div>
````

Rather than a null `#` href, we find it's nice to link back to the link that opened the dialog, just in case the user scrolled away from that place while the dialog was open. You can do this by giving the opener link an `id` attribute and linking to that ID from the close link:

````
Dialog:
<div class="dialog" id="mydialog">
	<p>This is a dialog</p>
	<a href="#mydialog-btn" class="dialog-close">Close</a>
</div>

Any number of links to open dialog:
<a href="#mydialog" id="mydialog-btn">Open Dialog</a>
````

### Modal and non-modal

Much of the presentation of the dialog is configured in CSS. If you don't want a modal appearance, you can set the `.dialog` element's background to transparent.

````
.dialog {
	background: transparent;
}
````


### Opening and closing programatically

You can open and close the dialog via JavaScript by triggering an open or close event:

````
open:
$( "#mydialog" ).trigger( "dialog-open" );
close:
$( "#mydialog" ).trigger( "dialog-close" );
````
