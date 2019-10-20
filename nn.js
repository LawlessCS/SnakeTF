class NeuralNetwork {
	constructor(a, b, c, d) {
		if (a instanceof tf.Sequential) {
			this.input_nodes = b;
			this.hidden_nodes = c;
			this.output_nodes = d;
			this.model = a;
		} else {
			this.input_nodes = a;
			this.hidden_nodes = b;
			this.output_nodes = c;
			this.model = this.createModel();
		}
	}

	createModel() {
		return tf.sequential({
			layers: [
				tf.layers.dense({
					inputShape: [this.input_nodes],
					units: this.hidden_nodes,
					activation: "sigmoid"
				}),
				tf.layers.dense({
					units: this.hidden_nodes,
					activation: "sigmoid"
				}),
				tf.layers.dense({
					units: this.output_nodes,
					activation: "relu"
				})
			]
		});
	}

	predict(input) {
		return tf.tidy(() => {
			let tf_xs = tf.tensor2d([input]);
			let output = this.model.predict(tf_xs).dataSync();

			let max = -1;
			let maxIndex = -1;

			for (let i = 0; i < output.length; i++) {
				if (output[i] > max) {
					max = output[i];
					maxIndex = i;
				}
			}

			return maxIndex;
		});
	}

	copy() {
		return tf.tidy(() => {
			let modelCopy = this.createModel();
			let modelWeights = this.model.getWeights();
			let weightCopies = [];

			for (let i = 0; i < modelWeights.length; i++) {
				weightCopies[i] = modelWeights[i].clone();
			}

			modelCopy.setWeights(weightCopies);

			return new NeuralNetwork(modelCopy, this.input_nodes, this.hidden_nodes, this.output_nodes);
		});
	}

	mutate(rate) {
		tf.tidy(() => {
			let weights = this.model.getWeights();
			let mutatedWeights = [];

			for (let i = 0; i < weights.length; i++) {
				let tensor = weights[i];
				let shape = weights[i].shape;
				let values = tensor.dataSync().slice();

				for (let j = 0; j < values.length; j++) {
					if (random(1) < rate) {
						let w = values[j];
						values[i] = w + randomGaussian();
					}
				}

				let newTensor = tf.tensor(values, shape);
				mutatedWeights[i] = newTensor;
			}

			this.model.setWeights(mutatedWeights);
		});
	}

	dispose() {
		this.model.dispose();
	}
}
