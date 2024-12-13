import React, { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
    BellOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import { Button, Layout as AntLayout, Menu, Row, Col, Statistic, Progress, Divider, List } from 'antd';
import CustomCard from './CustomCard';
import { PieChart, Pie, Cell, Tooltip, LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { Routes, useNavigate, Route } from 'react-router-dom'; // For routing (if applicable)
import Dashboard from '../views/Dashboard';
import ClientRequests from '../views/ClientRequests';
import Model from './Model';
import { useSocket } from '../context/SocketContext';
import { useClientContext } from '../context/ClientContext';

const { Header, Sider, Content } = AntLayout;

const CustomLayout = () => {
    const { addClientRequest } = useClientContext(); // Access the addClientRequest function


    const { socket, connected } = useSocket(); // Access socket and connected state


    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate(); // React Router navigation

    useEffect(() => {
        if (connected) {
          // Listen for events from the server
          
            socket.on('request-model-admin', clientInfo => {
                addClientRequest(clientInfo)
            })

          socket.on('response', (data) => {
            console.log('Response from server:', data);
          });
        }
        
        return () => {
          // Cleanup the socket event listener
          socket.off('response');
        };
      }, [connected, socket]);

    const handleMenuClick = ({ key }) => {
        switch (key) {
            case '1':
                console.log('Dashboard clicked');
                navigate('/'); // Navigate to dashboard (if routing is set up)
                break;
            case '2':
                console.log('Client Requests clicked');
                navigate('/client-requests'); // Navigate to client requests
                break;
            case '3':
                console.log('Model clicked');
                navigate('/model'); // Navigate to model
                break;
            default:
                console.log('Unknown menu item clicked');
        }
    };

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={handleMenuClick} // Handle menu click here
                    items={[
                        {
                            key: '1',
                            icon: <BarChartOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: '2',
                            icon: <BellOutlined />,
                            label: 'Client Requests',
                        },
                        {
                            key: '3',
                            icon: <DatabaseOutlined />,
                            label: 'Model',
                        },
                    ]}
                />
            </Sider>
            <AntLayout>
                <Header
                    style={{
                        padding: 0,
                        background: '#f0f2f5',
                        borderBottom: '1px solid #ddd',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    {connected ? "Connected" : "Offline :("}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        borderRadius: '8px',
                    }}
                >
                    <Routes>
                        <Route exact path='/' element={<Dashboard />} />
                        <Route exact path='/client-requests' element={<ClientRequests />} />
                        <Route exact path='/model' element={<Model />} />


                    </Routes>
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default CustomLayout;
