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
    },
    maxHttpBufferSize: 1e8
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

    socket.on('test', data => {
        console.log(data)
    })

    let fileBuffers = {}; // Store chunks for each file temporarily

    socket.on('upload-model', (data) => {
        const { fileName, chunk, chunkIndex, totalChunks } = data;

        // Initialize file buffer for this file if it's not already done
        if (!fileBuffers[fileName]) {
            fileBuffers[fileName] = { chunks: [], totalChunks: totalChunks };
        }

        // Append the chunk to the file buffer
        fileBuffers[fileName].chunks[chunkIndex] = chunk;

        // Check if all chunks have been received
        if (fileBuffers[fileName].chunks.length === totalChunks) {
            // Combine all chunks into a single buffer
            const fileBuffer = Buffer.concat(fileBuffers[fileName].chunks);

            // Save the file to disk
            fs.writeFile(path.join(__dirname, 'uploads', fileName), fileBuffer, (err) => {
                if (err) {
                    console.log('Error saving the file:', err);
                    socket.emit('upload-response', { status: 'fail', message: 'Error saving file' });
                } else {
                    console.log('File uploaded successfully');
                    // Reset the file buffer for future uploads
                    delete fileBuffers[fileName];

                    socket.emit('upload-response', { status: 'success', message: 'File uploaded successfully' });
                }
            });
        }
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
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
