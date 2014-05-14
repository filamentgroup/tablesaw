Step - A QUnit addon for testing execution order
================================

This addon for QUnit adds a `QUnit.step` method that allows you to assert
the proper sequence in which the code should execute.

### Example ###

```js
test("example test", function () {
  function x() {
    QUnit.step(2, "function y should be called first");
  }
  function y() {
    QUnit.step(1);
  }
  y();
  x();
});
```