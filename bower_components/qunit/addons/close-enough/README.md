Close-Enough - A QUnit addon for testing number approximations
================================

This addon for QUnit adds `QUnit.close` and `QUnit.notClose` assertion methods to test that
numbers are close enough (or different enough) from an expected number, with
a specified accuracy.

### Usage ###

```js
QUnit.close(actual, expected, maxDifference, message);
QUnit.notClose(actual, expected, minDifference, message);
```

Where:
 - `maxDifference`: the maximum inclusive difference allowed between the `actual` and `expected` numbers
 - `minDifference`: the minimum exclusive difference allowed between the `actual` and `expected` numbers
 - `actual`, `expected`, `message`: The usual
