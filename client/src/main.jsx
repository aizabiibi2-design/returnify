import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' // 1. AuthProvider ko import kiya

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App ko AuthProvider mein wrap kar diya */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)