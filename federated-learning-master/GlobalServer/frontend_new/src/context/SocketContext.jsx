// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useClientContext } from './ClientContext';

// Create a context for the Socket
const SocketContext = createContext();

// Establish a Socket.io connection here
const socket = io('http://localhost:3000'); // Replace with your server's URL if needed

export const useSocket = () => {
  return useContext(SocketContext); // Custom hook to access socket in any component
};

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  const {setClientOnline} = useClientContext();
  // On mount, handle socket events
  useEffect(() => {

    socket.emit('admin-access', 'admin');

    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socket.on('client-count', (count) => {
      setClientOnline(count)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Cleanup the socket connection on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
