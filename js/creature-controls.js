class CreatureControl {
	constructor (creature) {
		this.creature = creature;
		this.target = { x: 0, y: 0 };
		this.range = 100;
		this.da = 0;
		this.ta = 0;
		this.ca = 0;

		this.updateTarget();
	}

	updateTarget () {
		const x = Math.random() * 400 - 200;
		const y = Math.random() * 400 - 200;

		this.target.x = x;
		this.target.y = y;
	}

	draw (ctx) {
		ctx.fillStyle = '#0f0';
		ctx.fillRect(this.target.x - 10, this.target.y - 10, 20, 20);

		ctx.fillStyle = '#f86';
		ctx.fillRect(-10, -10, 20, 20);

		ctx.strokeStyle = '#ff0';
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(Math.cos(this.da) * this.range, Math.sin(this.da) * this.range);
		ctx.stroke();

		ctx.strokeStyle = '#f0f';
		ctx.beginPath();
		ctx.moveTo(this.target.x, this.target.y);
		ctx.lineTo(this.target.x + Math.cos(this.ta) * this.range, this.target.y + Math.sin(this.ta) * this.range);
		ctx.stroke();

		ctx.strokeStyle = '#0ff';
		ctx.beginPath();
		ctx.moveTo(this.target.x, this.target.y);
		ctx.lineTo(this.target.x + Math.cos(this.ca) * this.range, this.target.y + Math.sin(this.ca) * this.range);
		ctx.stroke();
	}

	update () {
		const dx = this.creature.position.x - this.target.x;
		const dy = this.creature.position.y - this.target.y;
		const distance = dx * dx + dy * dy;

		if (distance < this.range * this.range) {
			this.creature.controls.move = false;
			this.updateTarget();
			return;
		}

		const angleTarget = Math.atan2(this.target.y, this.target.x);
		const angleCreature = Math.atan2(this.creature.position.y, this.creature.position.x);
		const deltaAngle = (angleCreature - angleTarget);
		this.da = deltaAngle;
		this.ta = angleTarget;
		this.ca = angleCreature;

		this.creature.controls.move = true;

		if (deltaAngle > 0.1) {
			this.creature.controls.turnLeft = true;
			this.creature.controls.turnRight = false;
		} else if (deltaAngle < -0.1) {
			this.creature.controls.turnLeft = false;
			this.creature.controls.turnRight = true;
		} else {
			this.creature.controls.turnLeft = false;
			this.creature.controls.turnRight = false;
			console.log(true);
		}
	}
}
