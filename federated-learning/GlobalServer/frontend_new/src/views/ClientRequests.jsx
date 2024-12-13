import React from 'react';
import { Button, Divider, Typography, Row, Col } from 'antd';
import CustomCard from '../components/CustomCard'; // Import the CustomCard component
import { useClientContext } from '../context/ClientContext';
import { useSocket } from '../context/SocketContext';

const { Title } = Typography;

const ClientRequests = () => {

    const {clientRequests} = useClientContext();
    const {socket} = useSocket();

    // Sample data for client requests
    // const clientRequests = [
    //     { id: 1, clientName: 'Client A', requestDetails: 'Request details for Client A' },
    //     { id: 2, clientName: 'Client B', requestDetails: 'Request details for Client B' },
    //     { id: 3, clientName: 'Client C', requestDetails: 'Request details for Client C' },
    //     { id: 4, clientName: 'Client D', requestDetails: 'Request details for Client D' },
    //     { id: 5, clientName: 'Client E', requestDetails: 'Request details for Client E' },
    //     { id: 6, clientName: 'Client F', requestDetails: 'Request details for Client F' },
    // ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Client Requests</Title>
            <Row gutter={[16, 16]}>
                {clientRequests.map((request) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={request.id}>
                        <CustomCard title={request.username}>
                            <p>{request.description}</p>
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => {
                                socket.emit('approve', request)
                                }} type="primary" style={{ width: '48%' }}>
                                    Approve
                                </Button>
                                <Button type="danger" style={{ width: '48%' }}>
                                    Reject
                                </Button>
                            </div>
                        </CustomCard>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ClientRequests;
