import tensorflow as tf
import numpy as np
from tensorflow.keras import models
from sklearn.model_selection import train_test_split
from tensorflow.keras.datasets import mnist
import matplotlib.pyplot as plt

# Load the MNIST dataset
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Preprocess the data: Normalize and reshape for the model
x_train = np.expand_dims(x_train, axis=-1).astype('float32') / 255.0  # Shape: (60000, 28, 28, 1)
x_test = np.expand_dims(x_test, axis=-1).astype('float32') / 255.0    # Shape: (10000, 28, 28, 1)

# Split the dataset into 5 parts for 5 nodes (simulating federated learning)
num_nodes = 5
x_train_split = np.array_split(x_train, num_nodes)
y_train_split = np.array_split(y_train, num_nodes)

# Load the pre-defined model architecture
model = models.load_model('model.keras')

# Function to compile and train a model on a specific node's data
def train_on_node(node_num, x_data, y_data):
    print(f"Training on Node {node_num}...")

    # Compile the model before training
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    # Initialize lists to store loss and accuracy for plotting
    history = model.fit(x_data, y_data, epochs=5, batch_size=64, validation_data=(x_test, y_test), verbose=1)
    
    # Plot the training loss and accuracy
    plot_training_progress(history, node_num)

    # Save the trained model for this node
    #model.save(f'model_node_{node_num}.keras')
    print(f"Node {node_num} model saved as 'model_node_{node_num}.keras'")

# Function to plot training progress (accuracy and loss)
def plot_training_progress(history, node_num):
    # Plot training and validation accuracy
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title(f"Node {node_num} - Accuracy")
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()

    # Plot training and validation loss
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title(f"Node {node_num} - Loss")
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()

    # Show the plot
    plt.tight_layout()
    plt.show()

# Train on each node's split of the dataset
for i in range(num_nodes):
    train_on_node(i + 1, x_train_split[i], y_train_split[i])
