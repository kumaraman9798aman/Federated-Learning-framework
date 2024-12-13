import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import mnist
from sklearn.metrics import accuracy_score

# Directory containing model.keras files
UPLOADS_DIR = './uploads'

# Function to load models from the uploads directory
def load_models(directory):
    models = []
    for file_name in os.listdir(directory):
        if file_name.endswith('.keras'):
            model_path = os.path.join(directory, file_name)
            models.append(load_model(model_path))
            print(f"Loaded model: {model_path}")
    return models

# Function to average model weights
def aggregate_models(models):
    # Extract weights from all models
    weights_list = [model.get_weights() for model in models]
    # Average weights across all models
    avg_weights = [np.mean(np.array(w), axis=0) for w in zip(*weights_list)]
    # Create a new model and set the averaged weights
    aggregated_model = tf.keras.models.clone_model(models[0])
    aggregated_model.set_weights(avg_weights)
    return aggregated_model

# Function to evaluate a model
def evaluate_model(model, x_test, y_test):
    predictions = np.argmax(model.predict(x_test), axis=1)
    return accuracy_score(y_test, predictions)

# Load MNIST dataset for evaluation
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_test = x_test.astype('float32') / 255.0
x_test = np.expand_dims(x_test, -1)

# Main function
def main():
    # Load all models from the uploads directory
    models = load_models(UPLOADS_DIR)
    
    if len(models) < 2:
        print("At least two models are required for aggregation.")
        return
    
    # Aggregate models
    aggregated_model = aggregate_models(models)
    print("Aggregated model created.")

    # Evaluate individual models
    model_accuracies = []
    for i, model in enumerate(models):
        accuracy = evaluate_model(model, x_test, y_test)
        model_accuracies.append((f"Model {i+1}", accuracy))
        print(f"Model {i+1} Accuracy: {accuracy:.4f}")

    # Evaluate aggregated model
    aggregated_accuracy = evaluate_model(aggregated_model, x_test, y_test)
    model_accuracies.append(("Aggregated Model", aggregated_accuracy))
    print(f"Aggregated Model Accuracy: {aggregated_accuracy:.4f}")

    # Find the best model
    best_model_name, best_accuracy = max(model_accuracies, key=lambda x: x[1])
    print(f"Best Model: {best_model_name} with Accuracy: {best_accuracy:.4f}")

    return best_model_name, best_accuracy

if __name__ == '__main__':
    best_model = main()
