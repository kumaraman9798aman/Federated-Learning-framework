import React from 'react';
import { Card } from 'antd';

const CustomCard = ({ title, children }) => (
  <Card
    title={title}
    bordered={true}
    style={{
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}
  >
    {children}
  </Card>
);

export default CustomCard;
