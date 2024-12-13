import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Divider } from 'antd';

const { Title } = Typography;

function Model() {
  const [modelData, setModelData] = useState({
    "model": {
      "name": "Dummy Neural Network",
      "layers": [
        {
          "layer": "Input Layer",
          "units": 32,
          "activation": "None"
        },
        {
          "layer": "Dense Layer 1",
          "units": 64,
          "activation": "ReLU"
        },
        {
          "layer": "Dense Layer 2",
          "units": 10,
          "activation": "Softmax"
        }
      ],
      "optimizer": "Adam",
      "loss_function": "Categorical Crossentropy",
      "metrics": ["Accuracy"]
    }
  }
  );

//   useEffect(() => {
//     // Fetch the dummy model JSON data
//     fetch('/modelData.json')
//       .then((response) => response.json())
//       .then((data) => setModelData(data.model));
//   }, []);

  return (
    <div style={{ padding: '24px' }}>
      {modelData ? (
        <>
          <Title level={2}>{modelData.name}</Title>
          <Card
            title="Model Summary"
            bordered={true}
            style={{ marginBottom: '16px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <p><strong>Optimizer:</strong> {modelData.optimizer}</p>
            <p><strong>Loss Function:</strong> {modelData.loss_function}</p>
          </Card>
          <Divider />
          <Title level={4}>Layers</Title>
          <List
            dataSource={modelData.layers}
            renderItem={(layer) => (
              <List.Item>
                <Card
                  style={{
                    width: '100%',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <p><strong>{layer.layer}:</strong></p>
                  <p><strong>Units:</strong> {layer.units}</p>
                  <p><strong>Activation:</strong> {layer.activation}</p>
                </Card>
              </List.Item>
            )}
          />
        </>
      ) : (
        <p>Loading model details...</p>
      )}
    </div>
  );
}

export default Model;
