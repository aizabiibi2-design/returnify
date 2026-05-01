import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import 'leaflet/dist/leaflet.css';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Isay comment karein

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

// serviceWorkerRegistration.register(); // Is line ko bhi comment kar dein