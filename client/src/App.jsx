import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PostItem from './components/PostItem';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Ab sirf ek "/" path hai jo aapka naya design dikhayega */}
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<PostItem />} />
            <Route path="/leaderboard" element={<div className="text-center mt-20">Community Leaderboard</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;