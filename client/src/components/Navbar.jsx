import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-royal-blue border-b-2 border-neon-pink/30 py-4 px-10 flex justify-between items-center shadow-xl">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-bright-cyan text-3xl font-black italic uppercase">Returnify</Link>
      </div>
      
      <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white">
        <Link to="/" className="hover:text-neon-pink transition">Home</Link>
        {/* Sirf Login user ko Post Item dikhao - Route path /post rakha hai */}
        {user && <Link to="/post" className="hover:text-neon-pink transition">Post Item</Link>}
        <Link to="/leaderboard" className="hover:text-neon-pink transition text-bright-cyan">Community</Link>
      </div>

      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login" className="px-6 py-2 border border-bright-cyan text-bright-cyan rounded-full text-xs font-bold hover:bg-bright-cyan hover:text-royal-blue transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-neon-pink text-white rounded-full text-xs font-bold shadow-lg hover:opacity-90 transition">
              Sign Up
            </Link>
          </>
        ) : (
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border border-red-500 text-red-500 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition uppercase tracking-widest"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;