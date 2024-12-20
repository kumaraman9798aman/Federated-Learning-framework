import tensorflow as tf
from tensorflow.keras import layers, models

# Function to build the CNN model
def create_mnist_model():
    model = models.Sequential([
        layers.InputLayer(input_shape=(28, 28, 1)),  # Input layer (28x28 grayscale images)
        layers.Conv2D(32, (3, 3), activation='relu'),  # First convolutional layer
        layers.MaxPooling2D((2, 2)),                  # MaxPooling layer
        layers.Conv2D(64, (3, 3), activation='relu'),  # Second convolutional layer
        layers.MaxPooling2D((2, 2)),                  # MaxPooling layer
        layers.Conv2D(64, (3, 3), activation='relu'),  # Third convolutional layer
        layers.Flatten(),                             # Flatten the output for the fully connected layer
        layers.Dense(64, activation='relu'),          # Fully connected layer
        layers.Dense(10, activation='softmax')        # Output layer with 10 classes (for MNIST digits)
    ])
    return model

# Create the model
mnist_model = create_mnist_model()

# Save the model architecture (no weights) to a .keras file
mnist_model.save('model.keras', save_format='keras')

print("MNIST model architecture saved as 'model.keras'")
