class CreatureControl {
	constructor (creature) {
		this.creature = creature;
		this.target = { x: 0, y: 0 };
		this.range = 100;
		this.disabled = false;

		this.updateTarget();
	}

	updateTarget () {
		const x = Math.random() * 400 - 200;
		const y = Math.random() * 400 - 200;

		this.target.x = x;
		this.target.y = y;
	}

	draw (ctx) {
		ctx.fillStyle = this.creature.color;
		ctx.fillRect(this.target.x - 10, this.target.y - 10, 20, 20);
	}

	update () {
		if (this.disabled) return;

		const dx = this.creature.position.x - this.target.x;
		const dy = this.creature.position.y - this.target.y;
		const distance = dx * dx + dy * dy;

		if (distance < this.range * this.range) {
			this.creature.controls.move = false;
			this.updateTarget();
			return;
		}

		const angleTarget = Math.atan2(dy, dx);
		const angleCreature = this.creature.rotation;
		let deltaAngle = (angleCreature - angleTarget);
		deltaAngle = -Math.atan2(Math.sin(deltaAngle), Math.cos(deltaAngle));

		if (Math.abs(deltaAngle) < 0.1) {
			this.updateTarget();
			return;
		}

		this.creature.controls.move = true;

		if (deltaAngle > 0.2) {
			this.creature.controls.turnLeft = true;
			this.creature.controls.turnRight = false;
		} else if (deltaAngle < -0.2) {
			this.creature.controls.turnLeft = false;
			this.creature.controls.turnRight = true;
		} else {
			this.creature.controls.turnLeft = false;
			this.creature.controls.turnRight = false;
		}
	}
}
