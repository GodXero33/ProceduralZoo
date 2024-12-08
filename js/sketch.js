const ctx = canvas.getContext('2d');
const creatures = Array.from({ length: 3 }, () => {
	const x = Math.random() * 400 - 200;
	const y = Math.random() * 400 - 200;
	return new Creature(x, y);
});
const controls = creatures.map(creature => new CreatureControl(creature));
let width = 0;
let height = 0;
let animating = true;

controls[0].disabled = true;

function draw () {
	const transforms = ctx.getTransform();
	ctx.clearRect(0, 0, width, height);
	ctx.translate(width / 2, height / 2);

	/* controls.forEach(control => {
		control.draw(ctx);
	}); */

	creatures.forEach(creature => {
		creature.draw(ctx);
	});

	ctx.setTransform(transforms);
}

function update () {
	controls.forEach(control => {
		control.update();
	});

	creatures.forEach(creature => {
		creature.update();
	});
}

function animate () {
	if (!animating) return;

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
window.addEventListener('keydown', (event) => {
	if (event.code == 'Space') {
		animating = !animating;
		if (animating) animate();
	} else if (event.code == 'ArrowUp') {
		creatures[0].controls.move = true;
	} else if (event.code == 'ArrowLeft') {
		creatures[0].controls.turnLeft = true;
	} else if (event.code == 'ArrowRight') {
		creatures[0].controls.turnRight = true;
	}
});
window.addEventListener('keyup', (event) => {
	if (event.code == 'ArrowUp') {
		creatures[0].controls.move = false;
	} else if (event.code == 'ArrowLeft') {
		creatures[0].controls.turnLeft = false;
	} else if (event.code == 'ArrowRight') {
		creatures[0].controls.turnRight = false;
	}
});
