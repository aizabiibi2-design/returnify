import React, { useEffect } from 'react'; // useEffect add kiya
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import Discovery from './pages/Discovery';
import ItemDetails from './pages/ItemDetails';
import Leaderboard from './pages/Leaderboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AIIntelligence from './pages/AIIntelligence'; 
import Admin from './pages/Admin'; 
import Chat from './pages/Chat'; 
import Inbox from './pages/Inbox';

function App() {

  // PWA Service Worker Registration logic
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('PWA: Service Worker Registered ✅', reg))
          .catch(err => console.log('PWA: Service Worker Failed ❌', err));
      });
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0f0c29]">
        <Navbar />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<PostItem />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:id" element={<ResetPassword />} />
            <Route path="/ai-intelligence" element={<AIIntelligence />} />
            <Route path="/admin" element={<Admin />} /> 
            <Route path="/chat/:itemId/:otherUserId" element={<Chat />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;