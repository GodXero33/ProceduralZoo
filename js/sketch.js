const ctx = canvas.getContext('2d');
const creatures = Array.from({ length: 1 }, () => new Creature());
let width = 0;
let height = 0;

function draw () {
	const transforms = ctx.getTransform();
	ctx.clearRect(0, 0, width, height);
	ctx.translate(width / 2, height / 2);

	creatures.forEach(creature => {
		creature.draw(ctx);
	});

	ctx.setTransform(transforms);
}

function update () {
	creatures.forEach(creature => {
		creature.update();
	});
}

function animate () {
	draw();
	update();
	window.requestAnimationFrame(animate);
}

function resize () {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
}

resize();
animate();

window.addEventListener('resize', resize);
