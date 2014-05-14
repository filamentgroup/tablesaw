Composite - A QUnit addon for running multiple test files
================================

Composite is a QUnit addon that, when handed an array of files, will
open each of those files inside of an iframe, run the tests, and
display the results as a single suite of QUnit tests.

The "Rerun" link next to each suite allows you to quickly rerun that suite,
outside the composite runner.

If you want to see what assertion failed in a long list of assertions,
just use the regular "Hide passed tests" checkbox.

### Usage ###

Load QUnit itself as usual _plus_ `qunit-composite.css` and `qunit-composite.js`,
then specify the test suites to load using `QUnit.testSuites`:

```js
QUnit.testSuites([
    "test-file-1.html",
    "test-file-2.html",
    // optionally provide a name and path
    { name: "Test File 3", path: "test-file-3.html" }
]);
```
