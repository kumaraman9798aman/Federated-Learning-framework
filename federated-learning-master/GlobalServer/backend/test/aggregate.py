import tensorflow as tf
import numpy as np
from tensorflow.keras import models
from tensorflow.keras.datasets import mnist

# Load the MNIST dataset (we'll use the test set as the evaluation dataset)
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Preprocess the data: Normalize and reshape for the model
x_test = np.expand_dims(x_test, axis=-1).astype('float32') / 255.0  # Shape: (10000, 28, 28, 1)

# Function to load the models trained on different nodes
def load_models():
    models_list = []
    for i in range(1, 6):  # Assuming there are 5 models
        model_path = f'../uploads/model_node_{i}.keras'  # Adjust the path to the uploads folder
        model = models.load_model(model_path)
        models_list.append(model)
    return models_list

# Function to aggregate the model weights (federated averaging)
def aggregate_weights(models_list):
    # Get the weights of the first model
    aggregated_weights = models_list[0].get_weights()
    
    # Perform federated averaging (average the weights)
    for i in range(1, len(models_list)):
        model_weights = models_list[i].get_weights()
        aggregated_weights = [np.add(aggregated_weights[j], model_weights[j]) for j in range(len(aggregated_weights))]

    # Average the weights
    aggregated_weights = [weights / len(models_list) for weights in aggregated_weights]
    
    return aggregated_weights

# Function to save the aggregated model
def save_aggregated_model(aggregated_weights):
    # Load a fresh model to apply the aggregated weights
    model = models.load_model('../uploads/model.keras')  # Load the original architecture (no weights)
    
    # Set the aggregated weights to the model
    model.set_weights(aggregated_weights)
    
    # Save the aggregated model
    model.save('../uploads/aggregated_model.keras')  # Save in the uploads folder
    print("Aggregated model saved as '../uploads/aggregated_model.keras'.")

# Function to evaluate the aggregated model
def evaluate_aggregated_model():
    # Load the aggregated model
    model = models.load_model('../uploads/aggregated_model.keras')
    
    # Compile the model
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    # Evaluate the model on the dummy test dataset
    test_loss, test_acc = model.evaluate(x_test, y_test)
    
    return test_loss, test_acc

# Main function to aggregate models, save and evaluate the aggregated model
def main():
    print("Loading models...")
    models_list = load_models()
    
    print("Aggregating weights...")
    aggregated_weights = aggregate_weights(models_list)
    
    print("Saving aggregated model...")
    save_aggregated_model(aggregated_weights)
    
    print("Evaluating aggregated model...")
    test_loss, test_acc = evaluate_aggregated_model()
    
    print(f"Test Loss: {test_loss}, Test Accuracy: {test_acc}")

# Run the aggregation, saving, and evaluation
if __name__ == "__main__":
    main()
