class Creature {
	constructor () {
		this.joinGap = 10;
		this.length = 20;
		this.chain = Array.from({ length: this.length }, (_, i) => {
			return { x: -i * this.joinGap, y: 0 };
		});
		this.controls = {
			move: false,
			turnLeft: false,
			turnRight: false
		};
		this.position = { x: 0, y: 0 };
		this.speed = 3;
		this.rotation = 0;
		this.rotationFact = 0.05;
		this.minimumRotationAngle = Math.PI * 0.05;
	}

	draw (ctx) {
		ctx.fillStyle = '#fff';

		this.chain.forEach(join => {
			ctx.fillRect(join.x - 5, join.y - 5, 10, 10);
		});
	}

	updateChain () {
		this.chain[0].x = this.position.x;
		this.chain[0].y = this.position.y;

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
			}
		}
	}

	movement () {
		if (this.controls.move) {
			
		}

		const cos = Math.cos(this.rotation);
		const sin = Math.sin(this.rotation);

		this.position.x += cos * this.speed;
		this.position.y += sin * this.speed;

		if (this.controls.turnLeft) {
			this.rotation -= this.rotationFact;
		}

		if (this.controls.turnRight) {
			this.rotation += this.rotationFact;
		}
	}

	update () {
		this.movement();
		this.updateChain();
	}
}
