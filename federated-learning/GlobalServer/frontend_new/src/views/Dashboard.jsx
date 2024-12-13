import { Col, Divider, List, Progress, Row, Statistic, Tooltip } from 'antd'
import React from 'react'
import CustomCard from '../components/CustomCard'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useClientContext } from '../context/ClientContext'

function Dashboard() {

    const {clientOnline} = useClientContext();

  return (
    <>
        <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CustomCard title="Clients Online">
                                <Statistic title="Active Clients" value={clientOnline} suffix="/ 50" />
                                <Progress percent={46} size="small" />
                            </CustomCard>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={18}>
                            <CustomCard title="Training Status">
                                <div>

                                    <List
                                        size="small"
                                        bordered
                                        dataSource={[
                                            { client: 'Client A', status: 'idle' },
                                            { client: 'Client B', status: 'training...' },
                                            { client: 'Client C', status: 'idle' },
                                            { client: 'Client D', status: 'training...' },
                                        ]}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <strong>{item.client}</strong>: <span>{item.status}</span>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </CustomCard>
                        </Col>

                    </Row>
                    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                        <Col xs={24} sm={24} md={24}>
                            <CustomCard title="Model Accuracy">
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <LineChart
                                            data={[
                                                { name: 'Client A', accuracy: 65 },
                                                { name: 'Client B', accuracy: 70 },
                                                { name: 'Client C', accuracy: 72 },
                                                { name: 'Client D', accuracy: 75 },
                                                { name: 'Client E', accuracy: 78 },
                                            ]}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="accuracy"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <Divider />
                                <Statistic
                                    title="Overall Accuracy"
                                    value={75}
                                    suffix="%"
                                    style={{ textAlign: 'center' }}
                                />
                            </CustomCard>
                        </Col>
                    </Row>
    </>
  )
}

export default Dashboard