import tensorflow as tf
from tensorflow.keras import layers, models

# Define a simple CNN model
def create_cnn_model():
    model = models.Sequential([
        layers.InputLayer(input_shape=(32, 32, 3)),  # Example input shape (32x32 RGB images)
        layers.Conv2D(32, (3, 3), activation='relu'),  # First convolutional layer
        layers.MaxPooling2D((2, 2)),                  # MaxPooling layer
        layers.Conv2D(64, (3, 3), activation='relu'),  # Second convolutional layer
        layers.MaxPooling2D((2, 2)),                  # MaxPooling layer
        layers.Conv2D(64, (3, 3), activation='relu'),  # Third convolutional layer
        layers.Flatten(),                             # Flatten the output for the fully connected layer
        layers.Dense(64, activation='relu'),          # Fully connected layer
        layers.Dense(10, activation='softmax')        # Output layer with 10 classes (example)
    ])
    return model

# Create the CNN model
cnn_model = create_cnn_model()

# Save the model architecture (no weights) to a .keras file
cnn_model.save('model.keras', save_format='keras')

print("Model architecture saved as 'model.keras'")
