class Creature {
	constructor (x, y) {
		this.joinGap = 5;
		this.length = Math.floor(Math.random() * 50 + 20);
		this.width = this.length * 0.2;
		this.controls = {
			move: false,
			turnLeft: false,
			turnRight: false
		};
		this.speed = 0;
		this.rotation = 0;
		this.rotationFact = 0.05;
		// this.minimumRotationAngle = Math.PI * 0.05;
		this.maxSpeed = this.length * 0.1;
		this.color = '#' + Math.floor(Math.random() * 256 ** 3).toString(16);
		this.regainedStamin = true;
		this.maximumStamina = Math.floor(Math.random() * 900 + 100);
		this.stamina = this.maximumStamina;

		this.initPosition(x, y);
	}

	initPosition (px, py) {
		this.chain = Array.from({ length: this.length }, (_, i) => {
			const x = px - i * this.joinGap;
			return { x, y: py, angle: 0, left: { x, y: py + this.width / 2 }, right: { x, y: py - this.width / 2 }, width: this.width };
		});

		this.position = { x: px, y: py };
	}

	draw (ctx) {
		const joinSize = 5;
		ctx.lineWidth = 2;
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = this.color;

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
		if (!this.regainedStamin) {
			this.stamina += 2;

			if (this.stamina >= this.maximumStamina) {
				this.stamina = this.maximumStamina;
				this.regainedStamin = true;
			}
		}

		if (this.controls.move && this.regainedStamin) {
			this.speed += 0.1;
			this.stamina -= 1;

			if (this.stamina == 0) {
				this.regainedStamin = false;
			}

			if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
		} else {
			this.speed -= 0.02;
			this.stamina += 2;

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
