import { useState, useEffect } from 'react';
import { Input, Button, Space, Card, notification, Upload, message } from 'antd';  // Import Ant Design components
import { UploadOutlined } from '@ant-design/icons';  // For the upload icon
import './App.css';
import { useSocket } from './context/SocketContext';

function App() {
  const [username, setUsername] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [description, setDescription] = useState('');
  const [modelData, setModelData] = useState(null);  // State to hold the model data
  const [file, setFile] = useState(null); // State to hold the uploaded file

  const { socket, connected } = useSocket();

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    if (username.trim()) {
      setIsNameSet(true);
    }

    socket.emit('request-model', {
      username, description, id: socket.id
    });

    notification.info({
      message: 'Request Sent',
      description: 'Your request for the model has been sent to the server.',
    });
  };

  useEffect(() => {
    if (!isNameSet) {
      setIsNameSet(false);
    }
  }, [isNameSet]);

  useEffect(() => {
    if (connected) {
      socket.on('model', (data) => {
        console.log('Received model data:', data);

        // Convert the base64 string back to binary data
        const modelFileData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0)); // Decode base64 to bytes

        // Set the model data in state (so it can be passed to the card)
        setModelData(modelFileData);
      });
    }

    return () => {
      socket.off('model');
    };
  }, [connected, socket]);

  const handleDownload = () => {
    if (modelData) {
      // Create a Blob from the byte array
      const blob = new Blob([modelData], { type: 'application/octet-stream' });

      // Create a link to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'model.keras';  // Set the download file name
      link.click();  // Trigger the download
    }
  };

  const handleFileChange = (info) => {
    // Check if the file is valid (e.g., it has a `.keras` or `.h5` extension)
    
     
      setFile(info.file.originFileObj); // Store the selected file
   
  };

  const handleUploadModel = () => {
    if (file) {
      console.log("File selected:", file); // Debugging line
      
      // Create a FileReader to read the file as ArrayBuffer
      const reader = new FileReader();
  
      reader.onload = () => {
        // Once the file is read, send the ArrayBuffer as a binary message over the socket
        const binaryData = reader.result;
  
        // Emit the socket event to upload the binary file
        socket.emit('upload-model', { fileName: file.name, binaryData }, (response) => {
          if (response.status === 'success') {
            notification.success({
              message: 'Model Uploaded Successfully',
              description: 'The model file has been uploaded to the server.',
            });
          } else {
            notification.error({
              message: 'Model Upload Failed',
              description: 'There was an issue uploading the model file.',
            });
          }
        });
      };
  
      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    } else {
      message.error('Please select a file to upload.');
    }
  };
  
  

  return (
    <div className="App">
      <div>
        <h2>Please enter your name:</h2>
        <Space direction="vertical" size="middle">
          <Input
            value={username}
            onChange={handleInputChange}
            placeholder="Enter your name"
            size="large"
          />
        </Space>
      </div>

      <div>
        <h2>Please provide a description for the Model:</h2>
        <Space direction="vertical" size="middle">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            size="large"
          />
          <Button type="primary" onClick={handleSubmit} size="large">
            Request Model from Server
          </Button>
        </Space>
      </div>

      {modelData && (
        <Card
          title="Model Ready for Download"
          style={{ marginTop: 20 }}
          actions={[
            <Button type="primary" onClick={handleDownload}>
              Download Model
            </Button>,
          ]}
        >
          <p>Your model is ready! Click below to download the model file.</p>
        </Card>
      )}

      <div style={{ marginTop: 30 }}>
        <h3>Upload Your Trained Model (.keras)</h3>
        <Upload
          name="modelFile"
          accept=".keras,.h5"
          showUploadList={false}
          action=""  // The action is empty, we'll use socket to handle the upload
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Select Model File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUploadModel}
          style={{ marginTop: 10 }}
          disabled={!file}
        >
          Upload Model to Server
        </Button>
      </div>
    </div>
  );
}

export default App;
