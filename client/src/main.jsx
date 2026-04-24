import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import 'leaflet/dist/leaflet.css';
// 1. Service Worker registration ko import karein
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

// 2. Service Worker ko register karein
// Is se browser mein "Install App" ka option enable ho jayega
serviceWorkerRegistration.register();