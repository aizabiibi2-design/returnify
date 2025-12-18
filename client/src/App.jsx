import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple Imports
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<h1 className="text-center mt-20 text-3xl font-bold text-royal-blue">Returnify Home</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<div className="text-center mt-20">Leaderboard</div>} />
            <Route path="/post" element={<div className="text-center mt-20">Post Item</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;