Canvas - A QUnit addon for testing Canvas rendering
================================

This addon for QUnit adds a `QUnit.pixelEqual` method that allows you to assert
individual pixel values in a given canvas.

### Usage ###

```js
QUnit.pixelEqual(canvas, x, y, r, g, b, a, message);
```

Where:
 - `canvas`: Reference to a canvas element
 - `x`, `y`: Coordinates of the pixel to test
 - `r`, `g`, `b`, `a`: The color and opacity value of the pixel that you except
 - `message`: Optional message, same as for other assertions
