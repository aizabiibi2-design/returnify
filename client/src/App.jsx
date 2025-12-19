import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components (Jo har jagah nazar aate hain)
import Navbar from './components/Navbar'; 

// Pages (Jo alag alag screens hain - ab inka path './pages/' hai)
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Saare Raste (Routes) bilkul sahi hain */}
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<PostItem />} />
            <Route path="/leaderboard" element={<div className="text-center mt-20">Community Leaderboard coming soon!</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;