test("Canvas pixels", function () {
	var canvas = document.getElementById('qunit-canvas'), context;
	try {
		context = canvas.getContext('2d');
	} catch(e) {
		// propably no canvas support, just exit
		return;
	}
	context.fillStyle = 'rgba(0, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 255, 0, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 255, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 255, 153);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 0, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 255, 0, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 255, 0, 153);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0.6)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 0, 255, 153);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 0, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 255, 0, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 255, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 0, 255, 255);
	context.clearRect(0,0,5,5);
});
