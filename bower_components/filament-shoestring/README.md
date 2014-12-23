# Shoestring

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

A lightweight, simple DOM utility made to run on a tight budget.

Shoestring is part of the [Southstreet workflow](https://github.com/filamentgroup/southstreet) at Filament Group.

You can find more details in the [API documentation](http://filamentgroup.github.io/shoestring/dist/docs/).

[![Build Status](https://travis-ci.org/filamentgroup/shoestring.svg?branch=master)](https://travis-ci.org/filamentgroup/shoestring) [![devDependency Status](https://david-dm.org/filamentgroup/shoestring/dev-status.svg)](https://david-dm.org/filamentgroup/shoestring#info=devDependencies)

## Philosophy


Shoestring is a lightweight, modular DOM framework intended for developers who need their code to download and run as fast as possible. It is intended to be "just enough" of a tool to efficently write maintainable cross-browser JavaScript. The API is modeled after jQuery but we intentionally implement a tiny subset of the API to cover only the methods we commonly need in our projects.  Each feature is built as an optional extension to a minimal core so each can be removed from the production build (dependencies between extensions are rare). The selector engine delegates to modern browsers' native `document.querySelectorAll`, which means it requires browsers that support that feature, such as IE8. For projects that require deeper compatibility or a richer set of features, it is simple to swap in jQuery instead. As a rule, anything that works with Shoestring should work with jQuery, but not the converse.

Our goal is to strike a good balance of code weight, runtime speed, browser support, and developer convenience. 


## Features

Shoestring's API is inspired by jQuery.

Technically, shoestring.js is a very small, extendable core function. That core function doesn't come with much more than a means of finding and/or generating HTML elements, a DOM-ready handler, and a few essential element-traversal methods like `each`, `find`, `children`. Using its `shoestring.fn` API, its core is easy to extend further, and many extensions are available for you to include in your build – the default build includes all extensions, but it's still very small (~3kb compressed).

If you are concerned about compatibility issues/pitfalls consider using the development build releases (`-dev` in the [releases](https://github.com/filamentgroup/shoestring/releases)). We've endeavored to throw exceptions where a particular invocation pattern or feature isn't supported as a means to document the disparity. We recommend that you use the development version in development and the regular non-`-dev` version in production.

There are three sets of extensions to the Shoestring core: DOM manipulation, events, and ajax.

### DOM

If you've used jQuery, the structure and behavior of the DOM manipulation methods will be immediately familiar:

```javascript
shoestring( ".foo" ).addClass( "bar" ).attr( "data-baz", "bak" );
```

That is, construct a sequence of elements from the DOM and invoke each method on all the elements of the sequence in turn. You can find a full list of the supported DOM methods and their arguments in the [API docs](http://filamentgroup.github.io/shoestring/dist/docs/) under the `dom/*` subdirectory.

### Events

Shoestring supports most of the jQuery events API including: custom events that bubble, event namespaces, a normalized event object, event arguments, DOM Ready, a `.one` method, comprehensive `.unbind`, etc. The major difference here is that Shoestring does not support the event delegation helpers built into jQuery, like `.delegate` or `.on` with a selector argument.

```javascript
shoestring( ".foo" ).bind( "click", function( event ) { ... });
```

Or with a custom event triggered on a child element:


```javascript
shoestring( ".foo" ).bind( "bar", function( event, arg ) {
  ...
  if(arg == 1) { ... }
  ...
});

// ...

shoestring( ".foo" ).children().first().trigger( "bar", 1 );
```

You can find a full list of the supported event methods and their arguments in the [API docs](http://filamentgroup.github.io/shoestring/dist/docs/) under the `events/*` subdirectory.


### Ajax

Shoestring supports a full `shoestring.ajax` method as well as some shorthand helpers like `shoestring.get` and `shoestring.post`.

```javascript
shoestring.ajax( "/foo", {
  success: function(){ ... },
  method: "GET",
  ...
});
```

Which could also be accomplished using `shoestring.get`

```javascript
shoestring.get( "/foo", function(){ ... });
```

You can find a full list of the supported ajax methods and their arguments in the [API docs](http://filamentgroup.github.io/shoestring/dist/docs/) under the `ajax/*` subdirectory.


## Extensions

Extending Shoestring is done in nearly the same fashion as jQuery. There is an object on which you can define properties using functions and those functions will have access to the Shoestring DOM element sequence during invocation using `this`. As an example the `remove` method:

```javascript
/**
 * Remove the current set of elements from the DOM.
 *
 * @return shoestring
 * @this shoestring
 */
shoestring.fn.remove = function(){
  return this.each(function(){
    if( this.parentNode ) {
      this.parentNode.removeChild( this );
    }
  });
};
```

It uses the `each` method to handle the DOM elements in the current sequence in turn.

**NOTE** these definitions must be made before a Shoestring object that depends on them is constructed. This is in contrast with jQuery where each object has access to new methods through the prototype chain.

### Modules

Each extension to Shoestring included in the repository is defined as an AMD module, but only for build purposes. We don't support, or plan to support, loading the library as modules in the browser.

```javascript
//>>excludeStart("exclude", pragmas.exclude);
define([ "shoestring", "dom/remove" ], function(){
//>>excludeEnd("exclude");

shoestring.fn.foo = function(){ ... };

//>>excludeStart("exclude", pragmas.exclude);
});
//>>excludeEnd("exclude");
```

Note that the AMD wrapper is removed during the process of the build and that the dependencies are defined from the `src` subdirectory. More on custom builds below.

### Dependencies

Browsing the modules in Shoestring you'll notice that very few have explicit dependencies in their module definitions. This is by design. We are interested in being able to select the minimum number of methods necessary for a given project to reduce load and parse times.

## Builds

Shoestring releases include two different builds, one for development and one for production. The development build is larger. It is intended to help with jQuery compatibility issues and includes other development utilities like the method tracker. The production build is meant to be shipped in production and does not include the extra dev-time helpers.

### Custom

This repository supports custom builds through creating a meta-module in the `build/custom/` directory and running the default Grunt task. To get started building a custom production build, do the following:

1. make sure the project dependencies are installed with `npm install`
2. copy `build/development.js` to `build/custom/foo.js`
3. run `grunt` or `node node_modules/.bin/grunt`
4. use `dist/foo.js`

### Tracker

Included in the development build is a method tracker. It works by proxying all calls to `shoestring.fn` methods through a corresponding method that records the invocation in local storage. **NOTE** this does not include methods defined on `shoestring`. Then the methods being used across pages by your application can be inspected.

```javascript
JSON.parse( window.localStorage.getItem(shoestring.trackedMethodsKey) );
```

If the method tracker is included during a significant portion of development this list can be used to remove unused functions from your Shoestring build with a custom meta-module.

## Contributing

Please see the [contribution guidelines](CONTRIBUTING.md).
