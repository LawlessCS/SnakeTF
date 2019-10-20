class Apple {
	constructor(a) {
		this.index = a;
		for (let i = 0; i < activeSnakes[this.index].body.length; i++) {
			this.x = gridSize * floor(random(width / gridSize));
			this.y = gridSize * floor(random(height / gridSize));

			if (
				(this.x == activeSnakes[this.index].body[i].x &&
					this.y == activeSnakes[this.index].body[i].y) ||
				(this.x == width / 2 || this.y == height / 2)
			) {
				i = 0;
			}
		}
	}

	show() {
		fill(255, 0, 0);
		rect(this.x, this.y, gridSize, gridSize);
	}
}
