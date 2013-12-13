# Tablesaw

A set of plugins for responsive tables.

## Table Modes

### Stack

The Stack Table reflows the table headers to a two column layout with headers on the left.

    <table data-mode="reflow">

* [Stack Table Demo](demo/stack.html)

### Toggle

The Column Toggle Table allows the user to select which columns they want to be visible.

    <table data-mode="columntoggle">

* [Column Toggle Demo](demo/toggle.html)

### Swipe

    <table data-mode="swipe">

* [Swipe Demo](demo/swipe.html)

## Mode Switcher

* [Mode Switcher Demo](demo/modeswitch.html)

## Sortable

* [Sortable Demo](demo/sort.html)

## Kitchen ~~Table~~ Sink

* [Kitchen Sink Demo](demo/kitchensink.html)

## Getting Started

```html
<link rel="stylesheet" href="tablesaw.css"></script>
<script src="jquery.js"></script>
<script src="dist/tablesaw.js"></script>
<script>

</script>
```

## Release History
_(Nothing yet)_

## TODO

* Generate a zip file that can be downloaded (includes minified/full sources, icons)
* Make the colors themeable
* Tests
* Add to bower
* Extra CSS/JS in btnmarkup, controlgroup
* Prune/cleanup non-scoped CSS
* Remove libs/ move everything into bower
* Fix issue with sortable switcher not updating
* These docs suck