import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom"
import { SocketProvider } from './context/SocketContext.jsx';
import { ClientProvider } from './context/ClientContext.jsx';

createRoot(document.getElementById('root')).render(
  <ClientProvider>
    <SocketProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </ClientProvider>
)
