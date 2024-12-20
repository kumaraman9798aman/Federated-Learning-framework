import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical
import json

# Load the MNIST dataset and preprocess it
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_test = x_test.astype('float32') / 255.0  # Normalize the test images
x_test = x_test.reshape(-1, 28, 28, 1)  # Reshape to (num_samples, 28, 28, 1)
y_test = to_categorical(y_test, 10)  # One-hot encode the labels

# Define a function to evaluate a model and return its accuracy and loss
def evaluate_model(model_path, x_test, y_test):
    model = load_model(model_path)  # Load the saved model
    loss, accuracy = model.evaluate(x_test, y_test, verbose=0)  # Evaluate the model on the test set
    return accuracy, loss

# Paths to the saved models for each node and the aggregated model
node_model_paths = [
    'model_node_1.keras',
    'model_node_2.keras',
    'model_node_3.keras',
    'model_node_4.keras',
    'model_node_5.keras'
]

aggregated_model_path = 'aggregated_model.keras'

# Dictionary to store the evaluation results
evaluation_results = {}

# Evaluate the individual node models
for i, model_path in enumerate(node_model_paths, 1):
    accuracy, loss = evaluate_model(model_path, x_test, y_test)
    evaluation_results[f"Node {i}"] = {
        'accuracy': accuracy,
        'loss': loss
    }

# Evaluate the aggregated model
aggregated_accuracy, aggregated_loss = evaluate_model(aggregated_model_path, x_test, y_test)
evaluation_results['Aggregated Model'] = {
    'accuracy': aggregated_accuracy,
    'loss': aggregated_loss
}

# Save the evaluation results to a JSON file
with open('evaluation_results.json', 'w') as f:
    json.dump(evaluation_results, f, indent=4)

print("Evaluation complete. Results saved to 'evaluation_results.json'.")
