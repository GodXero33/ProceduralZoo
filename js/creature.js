class Creature {
	constructor () {
		this.joinGap = 10;
		this.length = 20;
		this.chain = Array.from({ length: this.length }, (_, i) => {
			const x = -i * this.joinGap;
			const width = 20;
			return { x, y: 0, angle: 0, left: { x, y: width / 2 }, right: { x, y: -width / 2 }, width };
		});
		this.controls = {
			move: false,
			turnLeft: false,
			turnRight: false
		};
		this.position = { x: 0, y: 0 };
		this.speed = 0;
		this.rotation = 0;
		this.rotationFact = 0.05;
		// this.minimumRotationAngle = Math.PI * 0.05;
		this.maxSpeed = 5;
	}

	draw (ctx) {
		const joinSize = 5;
		ctx.lineWidth = 2;
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#f55';

		ctx.beginPath();
		ctx.lineTo(this.chain[0].x, this.chain[0].y);

		for (let i = 1; i < this.chain.length; i++) {
			ctx.lineTo(this.chain[i].x, this.chain[i].y);
		}

		ctx.stroke();

		/* this.chain.forEach(join => {
			ctx.fillRect(join.x - joinSize / 2, join.y - joinSize / 2, joinSize, joinSize);

			ctx.translate(join.x, join.y);
			ctx.rotate(join.angle);
			ctx.beginPath();
			ctx.moveTo(0, 20);
			ctx.lineTo(0, -20);
			ctx.stroke();
			ctx.rotate(-join.angle);
			ctx.translate(-join.x, -join.y);
		}); */
		this.chain.forEach(join => {
			ctx.fillRect(join.x - joinSize / 2, join.y - joinSize / 2, joinSize, joinSize);

			ctx.beginPath();
			ctx.moveTo(join.left.x, join.left.y);
			ctx.lineTo(join.right.x, join.right.y);
			ctx.stroke();
		});
	}

	calculateBody() {
		this.chain.forEach(join => {
			const angle = join.angle;
			const x = join.x;
			const y = join.y;
			const width = join.width / 2;

			join.left.x = x - width * Math.sin(angle);
			join.left.y = y + width * Math.cos(angle);

			join.right.x = x + width * Math.sin(angle);
			join.right.y = y - width * Math.cos(angle);
		});
	}

	updateChain () {
		this.chain[0].x = this.position.x;
		this.chain[0].y = this.position.y;
		this.chain[0].angle = this.rotation;

		for (let i = 1; i < this.chain.length; i++) {
			const dx = this.chain[i].x - this.chain[i - 1].x;
			const dy = this.chain[i].y - this.chain[i - 1].y;
			const distance = dx * dx + dy * dy;

			if (distance > this.joinGap ** 2) {
				let angle = Math.atan2(dy, dx);

				/* if (i != 1) {
					const prevDx = this.chain[i - 1].x - this.chain[i - 2].x;
					const prevDy = this.chain[i - 1].y - this.chain[i - 2].y;
					const prevAngle = Math.atan2(prevDy, prevDx);
					const angDif = angle - prevAngle;

					if (Math.abs(angDif) <= this.minimumRotationAngle) {
						angle = prevAngle + Math.sign(angDif) * this.minimumRotationAngle;
					}
				} */

				this.chain[i].x = this.chain[i - 1].x + Math.cos(angle) * this.joinGap;
				this.chain[i].y = this.chain[i - 1].y + Math.sin(angle) * this.joinGap;
				this.chain[i].angle = angle;
			}
		}
	}

	movement () {
		if (this.controls.move) {
			this.speed += 0.1;

			if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
		} else {
			this.speed -= 0.1;

			if (this.speed < 0) this.speed = 0;
		}

		const cos = Math.cos(this.rotation);
		const sin = Math.sin(this.rotation);

		this.position.x += cos * this.speed;
		this.position.y += sin * this.speed;

		if (this.controls.turnLeft) {
			this.rotation -= this.rotationFact * Math.min(this.speed, 1);
		}

		if (this.controls.turnRight) {
			this.rotation += this.rotationFact * Math.min(this.speed, 1);
		}
	}

	update () {
		this.movement();
		this.updateChain();
		this.calculateBody();
	}
}
