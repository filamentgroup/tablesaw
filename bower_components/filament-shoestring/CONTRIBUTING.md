# Contributing to Shoestring

Contributions are appreciated. In order for us to consider including a contribution, it does have to meet a few criteria:

* Code is specific to one issue (eg. feature, extension or bug)
* Code is formatted according to JavaScript Style Guide.
* Code has full test coverage and all tests pass.

## Feature Parity

Shoestring isn't attempting to reach feature parity with jQuery but even at the method level it may not support the same profusion of invocation patterns that the corresponding jQuery method does. To prevent surprises we've started adding exceptions into the `-dev` builds so that when a feature isn't supported it's immediately clear. If you find a feature missing (other than an absent method/object) please consider adding an `error` call and a descriptive error message. For example, in `src/extensions/dom/prev.js`:

```javascript
shoestring.fn.prev = function(selectors){
	var ret = [],	next;

	//>>includeStart("development", pragmas.development);
	if( selectors ){
		shoestring.error( 'prev-selector' );
	}
	//>>includeEnd("development");

	this.each(function(){
		next = this.previousElementSibling;
		if( next ){
			ret = ret.concat( next );
		}
	});

	return shoestring(ret);
};
```

Here, we're throwing an error if the selectors argument is passed since we don't support that invocation pattern. **Note** the pragmas are defined so that they are only included in development builds and should be duplicated at other locations. To define or change the message associated with `prev-selector` see `src/util/errors.js`:

```javascript
  shoestring.enUS = {
    errors: {

      ...

      'prev-selector' : "Shoestring does not support passing selectors into .prev, try .prev().filter(selector)"

      ...

    }
  };

```

## Code relates to issue

Use a separate git branch for each contribution. Give the branch a meaningful name.
When you are contributing a new extensions use the name of this extension, like `dom-toggleclass`.
Otherwise give it a descriptive name like `doc-generator` or reference a specific issue like `issues-12`.
When the issue is resolved create a pull request to allow us to review and accept your contribution.

**NOTE** All changes are considered carefully but additions especially so. We are particularly interested in retaining a small footprint and if a method is present, history tells us that someone will use it.

## JavaScript Style Guide

Code should be formatted according to the [jQuery JavaScript Style Guide](http://contribute.jquery.org/style-guide/).

## Test coverage

Code should be covered by unit tests. The tests are located in `test/unit/` and written in [QUnit](http://qunitjs.com/).
When you add a new feature like an extension. Make sure to also add tests for your new code, for this case in `test/unit/extensions.js`.
To check if all tests pass run `grunt qunit`. You can use `grunt watch` to continuously run the tests while you develop.
