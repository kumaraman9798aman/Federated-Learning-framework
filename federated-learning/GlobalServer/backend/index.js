const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create an Express app
const app = express();

// Allow CORS for all domains
app.use(cors());

// Create HTTP server using Express
const server = http.createServer(app);

// Set up Socket.io server
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

const adminId = 'admin';
let adminSocketID = '';
let clientCount = 0;

// Handle a connection event
io.on('connection', (socket) => {
    console.log('A user connected');
    clientCount++;

    socket.to(adminSocketID).emit('client-count', clientCount)

    //for server frontend
    socket.on('admin-access', (data) => {
        if (data === adminId)
            adminSocketID = socket.id

        else
            socket.emit('admin-access-response', "Invalid adminID")

        console.log(adminSocketID)
    })

    socket.on('request-model', (clientInfo) => {
        socket.to(adminSocketID).emit('request-model-admin', (clientInfo));//send it to admin 
    })

    socket.on('upload-model', (data, callback) => {
        const { fileName, binaryData } = data;

        if (!fileName || !binaryData) {
            return callback({ status: 'error', message: 'Invalid data received' });
        }

        // Convert the binary data (ArrayBuffer) to a Buffer object for writing to a file
        const buffer = Buffer.from(binaryData);

        // Define the file path to save the model file
        const modelPath = path.join(__dirname, 'uploads', fileName);

        // Write the buffer to a file on the server
        fs.writeFile(modelPath, buffer, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                callback({ status: 'error', message: 'Error uploading the file' });
            } else {
                console.log('File uploaded successfully:', modelPath);
                callback({ status: 'success' });
            }
        });
    });

    socket.on('approve', (clientInfo) => {
        //send the model to client
        const modelFilePath = path.join(__dirname, "pythonUtils", "model.keras");
        fs.readFile(modelFilePath, (err, data) => {
            if (err) {
                console.error('Error reading model file:', err);
                socket.emit('error', { message: 'Error reading model file' });
                return;
            }

            // Send the file content to the client
            socket.to(clientInfo.id).emit('model', { file: data.toString('base64') }); // Send as base64
            console.log('Model sent to client : ' + clientInfo.username);
        })
    })

    // Handle disconnection event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
