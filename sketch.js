const gridSize = 10;

let snake;
let apple;

let loop;

let populationSize = 1500;

let activeSnakes = [];
let deadSnakes = [];
let apples = [];

let applesEaten = 0;
let allApplesEaten = 0;
let applesP;
let allApplesP;

let maxEverFitness = 0;
let maxEverFitnessP;
let maxFitness = 0;
let maxFitnessP;



function setup() {
	createCanvas(500, 500);
	//frameRate(8);
	tf.setBackend("cpu");

	maxFitnessP = createP("Max fitness: xx");
	maxEverFitnessP = createP("Max fitness: xx");
	applesP = createP("Apples eaten: 0");
	allApplesP = createP("All apples eaten: 0");

	for (let i = 0; i < populationSize; i++) {
		activeSnakes.push(new Snake(5, i));
		apples.push(new Apple(i));
	}
}

function draw() {
	// clear screen
	background(0);

	// if snakes are still alive
	if (activeSnakes.length != 0) {
		// for every snake alive
		for (let i = 0; i < activeSnakes.length; i++) {
			// show their apple
			apples[activeSnakes[i].index].show();

			// change snake direction
			activeSnakes[i].think();

			// if the snake is moving
			if (activeSnakes[i].dx + activeSnakes[i].dy != 0) {
				// move the snake, returning if it ate apple in this frame
				if (activeSnakes[i].move()) {
					// create new apple to repace eaten one
					apples[activeSnakes[i].index] = new Apple(i);
					// increase snake apples eaten
					activeSnakes[i].applesEaten++;
					activeSnakes[i].lifeTimer = 300;

					applesEaten++;
					allApplesEaten++;
					applesP.html("Apples eaten: " + applesEaten);
					allApplesP.html("All epples Eaten: " + allApplesEaten);
				}
			}

			// Show the snake
			activeSnakes[i].show();

			if (activeSnakes[i].fitness > maxFitness) {
				maxFitness = activeSnakes[i].fitness;
				if (maxFitness > maxEverFitness) {
					maxEverFitness = maxFitness;
				}
			}
			
			maxFitnessP.html("Max fitness: " + maxFitness);
			maxEverFitnessP.html("Best ever fitness: " + maxEverFitness);

			// if the snake died
			if (activeSnakes[i].checkDeath()) {
				// run game over function
				gameOver(i);
			}
		}
		// if no snakes alive
	} else {
		// reset max fitness and apples eaten
		maxFitness = 0;
		applesEaten = 0;
		// create the next generation
		nextGeneration();
	}
}

function gameOver(i) {
	activeSnakes[i].stop();
	deadSnakes.push(activeSnakes[i]);
	activeSnakes.splice(i, 1);

	//clearInterval(loop);
}

function keyPressed() {
	for (let i = 0; i < activeSnakes.length; i++) {
		switch (keyCode) {
			case LEFT_ARROW:
				activeSnakes[i].changeDirection(0);
				break;
			case RIGHT_ARROW:
				activeSnakes[i].changeDirection(1);
				break;
			case UP_ARROW:
				activeSnakes[i].changeDirection(2);
				break;
			case DOWN_ARROW:
				activeSnakes[i].changeDirection(3);
				break;
		}
	}
}
