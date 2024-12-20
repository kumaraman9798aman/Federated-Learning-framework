import tensorflow as tf
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.utils import to_categorical
import numpy as np

# Function to simulate federated learning training across multiple nodes
def simulate_federated_learning():
    # Load CIFAR-10 dataset
    (x_train, y_train), (x_test, y_test) = cifar10.load_data()

    # Normalize the data to be in the range [0, 1]
    x_train, x_test = x_train / 255.0, x_test / 255.0

    # One-hot encode the labels
    y_train = to_categorical(y_train, 10)
    y_test = to_categorical(y_test, 10)

    # Split the training data into 5 parts (5 nodes)
    num_nodes = 5
    x_split = np.array_split(x_train, num_nodes)
    y_split = np.array_split(y_train, num_nodes)

    # Load the model architecture from the saved 'model.keras' file
    node_model = tf.keras.models.load_model('model.keras')

    # Compile the model before training
    node_model.compile(optimizer='adam',  # Adam optimizer
                       loss='categorical_crossentropy',  # Categorical crossentropy loss function for multi-class classification
                       metrics=['accuracy'])  # Accuracy metric for evaluation

    # Iterate over each node (split of the dataset)
    for i in range(num_nodes):
        print(f"Training on Node {i+1}...")
        
        # Create a new instance of the model for each node (this is to prevent model contamination across nodes)
        node_model = tf.keras.models.load_model('model.keras')
        
        # Compile the model for the current node
        node_model.compile(optimizer='adam', 
                           loss='categorical_crossentropy', 
                           metrics=['accuracy'])
        
        # Train the model on the data split for this node
        node_model.fit(x_split[i], y_split[i], epochs=5, batch_size=64, validation_data=(x_test, y_test))
        
        # Save the trained model after training on this node's data
        node_model.save(f"node_{i+1}_model.keras")
        print(f"Model for Node {i+1} saved as 'node_{i+1}_model.keras'.")

# Run the federated learning simulation
if __name__ == "__main__":
    simulate_federated_learning()
