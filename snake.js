class Snake {
	constructor(a, b, c) {
		if (a instanceof NeuralNetwork) {
			this.brain = a.copy();
			this.brain.mutate(0.1);
			this.startLength = b;
			this.index = c;
		} else {
			this.brain = new NeuralNetwork(12, 50, 4);
			this.startLength = a;
			this.index = b;
		}

		this.body = [];
		this.dx = 0;
		this.dy = 0;

		this.lifeTimer = 300;
		this.applesEaten = 0;
		this.fitness = 0;

		for (let i = 0; i < this.startLength; i++) {
			this.body.push({
				x: width / 2,
				y: height / 2 + i * gridSize
			});
		}
	}

	show() {
		fill(150);

		for (let i = this.body.length - 1; i > 0; i--) {
			rect(this.body[i].x, this.body[i].y, gridSize, gridSize);
		}

		fill(255);
		rect(this.body[0].x, this.body[0].y, gridSize, gridSize);
	}

	move() {
		let snake2 = [];

		for (let i = 0; i < this.body.length; i++) {
			snake2.push({
				x: this.body[i].x,
				y: this.body[i].y
			});
		}

		this.body[0].x += this.dx * gridSize;
		this.body[0].y += this.dy * gridSize;

		this.lifeTimer--;

		for (let i = 1; i < this.body.length; i++) {
			this.body[i].x = snake2[i - 1].x;
			this.body[i].y = snake2[i - 1].y;
		}

		let ateApple = this.checkEat();

		if (ateApple) {
			this.body.push({
				x: snake2[snake2.length - 1].x,
				y: snake2[snake2.length - 1].y
			});
		}

		let a = Math.abs(apples[this.index].x - this.body[0].x);
		let b = Math.abs(apples[this.index].y - this.body[0].y);
		if (a + b == 0) {
			a = 10;
		}

		this.fitness = this.applesEaten * 2500;
		this.fitness += this.inverseDistanceToApple();

		return ateApple;
	}

	think() {
		let inputs = this.generateInputs();
		let output = this.brain.predict(inputs);

		this.changeDirection(output);
	}

	generateInputs() {
		let inputs = [];

		let wg = width / gridSize;
		let hg = height / gridSize;

		// head position
		inputs.push(this.body[0].x / wg);
		inputs.push(this.body[0].y / hg);

		// apple position
		inputs.push(apples[this.index].x / wg);
		inputs.push(apples[this.index].y / hg);

		// distance from head to apple
		inputs.push(Math.pow(apples[this.index].x - this.body[0].x, 2));
		inputs.push(Math.pow(apples[this.index].y - this.body[0].y, 2));

		// snake direction
		inputs.push(this.dx);
		inputs.push(this.dy);

		//distance to walls
		inputs.push(this.body[0].x);
		inputs.push(this.body[0].y);
		inputs.push(width / this.body[0].x);
		inputs.push(height / this.body[0].y);

		return inputs;
	}

	checkDeath() {
		if (this.lifeTimer == 0) {
			return true;
		} else if (
			this.body[0].x < 0 ||
			this.body[0].x == width ||
			this.body[0].y < 0 ||
			this.body[0].y == height
		) {
			return true;
		}

		for (let i = 0; i < this.body.length; i++) {
			for (let j = 0; j < this.body.length; j++) {
				if (i != j) {
					if (this.body[i].x == this.body[j].x && this.body[i].y == this.body[j].y) {
						return true;
					}
				}
			}
		}

		return false;
	}

	stop() {
		this.dx = 0;
		this.dy = 0;
	}

	checkEat() {
		let xMatches = this.body[0].x / width / gridSize == apples[this.index].x / width / gridSize;
		let yMatches = this.body[0].y / height / gridSize == apples[this.index].y / height / gridSize;
		if(xMatches && yMatches) {
			return true;
		} else {
			return false;
		}
	}

	changeDirection(a) {
		switch (a) {
			case 0:
				if (this.dx != 1) {
					this.dx = -1;
					this.dy = 0;
				}
				break;
			case 1:
				if (this.dx != -1) {
					this.dx = 1;
					this.dy = 0;
				}
				break;
			case 2:
				if (this.dy != 1) {
					this.dx = 0;
					this.dy = -1;
				}
				break;
			case 3:
				if (this.dy != -1) {
					this.dx = 0;
					this.dy = 1;
				}
				break;
		}
	}

	inverseDistanceToApple() {
		let aSquared = apples[this.index].x - this.body[0].x;
		aSquared *= aSquared;
		let bSquared = apples[this.index].y - this.body[0].y;
		bSquared *= bSquared;

		let d = Math.sqrt(aSquared + bSquared);
		let maxD = Math.sqrt(((width * width) / height) * height);

		return map(d, 0, maxD, 0.1, 750);
	}

	copy(i) {
		return new Snake(this.brain, 5, i);
	}

	dispose() {
		this.brain.dispose();
	}
}
