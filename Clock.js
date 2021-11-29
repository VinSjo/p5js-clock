class Clock {
	onsecondchange = null;
	onminutechange = null;
	onhourchange = null;
	constructor(radius = 200, colorful = false) {
		this._date = new Date();
		this.radius = radius;
		this.colorful = colorful;
		this.indexes = {
			quarter: {
				width: 16,
				length: this.radius * 0.2,
			},
			hour: {
				width: 8,
				length: this.radius * 0.1,
			},
			minute: {
				width: 4,
				length: this.radius * 0.05,
			},
		};
		this.hands = {
			hour: {
				width: this.indexes.quarter.width,
				length: this.radius - this.indexes.quarter.length * 2,
			},
			minute: {
				width: this.indexes.hour.width,
				length: this.radius - this.indexes.quarter.length,
			},
			second: {
				width: this.indexes.minute.width,
				length: this.radius - this.indexes.minute.length,
			},
		};
	}

	getTime() {
		return {
			h: this._date.getHours(),
			m: this._date.getMinutes(),
			s: this._date.getSeconds(),
			ms: this._date.getMilliseconds(),
		};
	}

	getExactTime() {
		const time = this.getTime();
		time.s += time.ms / 1000 || 0;
		time.m += time.s / 60 || 0;
		time.h += time.m / 60 || 0;
		return time;
	}

	getAngles(exact = true) {
		const time = exact ? this.getExactTime() : this.getTime();
		return {
			h: (map(time.h, 0, 24, 0, 720) % 360) - 90,
			m: (map(time.m, 0, 60, 0, 360) % 360) - 90,
			s: (map(time.s, 0, 60, 0, 360) % 360) - 90,
		};
	}

	update() {
		const prev = this.getTime();
		this._date.setTime(Date.now());
		const curr = this.getTime();
		if (prev.s !== curr.s && this.onsecondchange !== null) {
			this.onsecondchange();
		}
		if (prev.m !== curr.m && this.onhourchange !== null) {
			this.onhourchange();
		}
		if (prev.h !== curr.h && this.onhourchange !== null) {
			this.onhourchange();
		}
		if (prev.s !== curr.s && curr.s % 15 === 0) {
			console.log(curr);
		}
	}

	draw() {
		push();
		rectMode(CENTER);
		translate(width / 2, height / 2);
		noStroke();
		this._drawIndexes();
		this._drawHands();
		pop();
	}

	_drawIndexes() {
		console.log(this.indexes);
		fill(255);
		for (let i = 0; i < 60; i++) {
			push();
			const angle = radians(i * 6);
			const pos = p5.Vector.fromAngle(angle);
			pos.mult(this.radius);
			const current =
				i % 15 === 0
					? this.indexes.quarter
					: i % 5 === 0
					? this.indexes.hour
					: this.indexes.minute;
			if (this.colorful) {
				switch (current) {
					case this.indexes.quarter:
						fill(255, 0, 255);
						break;
					case this.indexes.hour:
						fill(0, 255, 255);
						break;
					case this.indexes.minute:
						fill(255, 255, 0);
						break;
				}
			}

			rotate(pos.heading());
			translate(pos.mag() - current.length / 2, 0);
			rect(
				current.length / 2,
				0,
				current.length,
				current.width,
				current.width / 2
			);
			pop();
		}
	}

	_drawHands() {
		const angles = this.getAngles();
		const pos = {
			h: p5.Vector.fromAngle(radians(angles.h)),
			m: p5.Vector.fromAngle(radians(angles.m)),
			s: p5.Vector.fromAngle(radians(angles.s)),
		};
		pos.h.mult(this.hands.hour.length);
		pos.m.mult(this.hands.minute.length);
		pos.s.mult(this.hands.second.length);

		this.colorful ? fill(0, 0, 255) : fill(255);

		push();
		rotate(pos.h.heading());
		translate(
			pos.h.mag() -
				this.hands.hour.length / 2 -
				this.hands.hour.width / 2,
			0
		);
		rect(
			0,
			0,
			this.hands.hour.length,
			this.hands.hour.width,
			this.hands.hour.width / 2
		);
		pop();

		this.colorful ? fill(0, 255, 0) : fill(255);
		push();
		rotate(pos.m.heading());
		translate(
			pos.m.mag() -
				this.hands.minute.length / 2 -
				this.hands.minute.width / 2,
			0
		);
		rect(
			0,
			0,
			this.hands.minute.length,
			this.hands.minute.width,
			this.hands.minute.width / 2
		);
		pop();

		this.colorful ? fill(255, 0, 0) : fill(255);
		ellipse(0, 0, this.hands.hour.width, this.hands.hour.width);
		push();
		rotate(pos.s.heading());
		translate(
			pos.s.mag() -
				this.hands.second.length / 2 -
				this.hands.second.width / 2,
			0
		);
		rect(
			0,
			0,
			this.hands.second.length,
			this.hands.second.width,
			this.hands.second.width / 2
		);
		pop();
	}
}
