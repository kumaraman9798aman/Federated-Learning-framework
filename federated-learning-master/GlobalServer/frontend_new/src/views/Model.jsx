import React, { useState } from "react";
import { Card, Typography, List } from "antd";

const { Title } = Typography;

function Model() {
  const [modelsData, setModelsData] = useState([
    {
      name: "Dummy Neural Network 1",
      extension: ".keras",
      clientName: "Client A",
      clientId: "12345",
      optimizer: "Adam",
      loss_function: "Categorical Crossentropy",
    },
    {
      name: "Dummy Neural Network 2",
      extension: ".h5",
      clientName: "Client B",
      clientId: "67890",
      optimizer: "SGD",
      loss_function: "Mean Squared Error",
    },
  ]);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Models</Title>
      <List
        dataSource={modelsData}
        renderItem={(model) => (
          <List.Item>
            <Card
              title={`${model.name}${model.extension}`}
              bordered={true}
              style={{
                width: "100%",
                marginBottom: "16px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p>
                <strong>Client Name:</strong> {model.clientName}
              </p>
              <p>
                <strong>Client ID:</strong> {model.clientId}
              </p>
              <p>
                <strong>Optimizer:</strong> {model.optimizer}
              </p>
              <p>
                <strong>Loss Function:</strong> {model.loss_function}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Model;
