function nextGeneration() {
	console.log("Next generation!");
	normalizeFitness();
	activeSnakes = generate(deadSnakes);

	for (let i = 0; i < populationSize; i++) {
		deadSnakes[i].dispose();
		apples[i] = new Apple(i);
	}

	deadSnakes = [];
}

function normalizeFitness() {
	let sum = 0;

	for (let i = 0; i < populationSize; i++) {
		deadSnakes[i].fitnes *= deadSnakes[i].fitnes;
		sum += deadSnakes[i].fitnes;
	}

	for (let i = 0; i < populationSize; i++) {
		deadSnakes[i].fitness /= sum;
	}
}

function generate(deadSnakes) {
	let newSnakes = [];

	for (let i = 0; i < populationSize; i++) {
		let snake = naturallySelect(i, deadSnakes);
		newSnakes.push(snake);
	}

	return newSnakes;
}

function naturallySelect(i, snakes) {
	let index = 0;
	let r = random(1);

	while (r > 0) {
		r -= snakes[index].fitness;
		index++;
	}

	index--;

	return snakes[index].copy(i);
}
