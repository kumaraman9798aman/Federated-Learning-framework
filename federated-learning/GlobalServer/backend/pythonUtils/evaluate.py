import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import mnist
from sklearn.metrics import accuracy_score

# Path to the global (aggregated) model
GLOBAL_MODEL_PATH = './uploads/global_model.keras'

# Function to evaluate a model
def evaluate_global_model(model_path, x_test, y_test):
    # Load the global model
    global_model = load_model(model_path)
    print("Global model loaded successfully.")

    # Predict on the test dataset
    predictions = np.argmax(global_model.predict(x_test), axis=1)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, predictions)
    return accuracy

# Load MNIST dataset for evaluation
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_test = x_test.astype('float32') / 255.0
x_test = np.expand_dims(x_test, -1)  # Add channel dimension for compatibility

def main():
    if not os.path.exists(GLOBAL_MODEL_PATH):
        print("Global model not found. Ensure the path is correct.")
        return

    # Evaluate the global model
    accuracy = evaluate_global_model(GLOBAL_MODEL_PATH, x_test, y_test)
    print(f"Global Model Accuracy: {accuracy:.4f}")

if __name__ == '__main__':
    main()
