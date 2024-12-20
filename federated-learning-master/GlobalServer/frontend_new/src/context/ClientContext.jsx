import React, { createContext, useState, useContext } from 'react';
// Create the context to store client requests
const ClientContext = createContext();

// Custom hook to use ClientContext
export const useClientContext = () => {
  return useContext(ClientContext);
};

// Context provider component
export const ClientProvider = ({ children }) => {
  // Array to store client requests
  const [clientRequests, setClientRequests] = useState([]);
  const [clientOnline, setClientOnline] = useState(0);

  // Function to add a new client request to the array
  const addClientRequest = (clientInfo) => {
    setClientRequests((prevRequests) => [...prevRequests, clientInfo]);
  };

  // Value to provide to the rest of the app
  const value = {
    clientRequests,
    addClientRequest,
    clientOnline,
    setClientOnline
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
