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
      
      <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white items-center">
        <Link to="/" className="hover:text-neon-pink transition">Home</Link>
        <Link to="/discovery" className="hover:text-neon-pink transition">Discovery</Link>
        
        {/* Normal User Link */}
        {user && <Link to="/post" className="hover:text-neon-pink transition">Post Item</Link>}
        
        <Link to="/leaderboard" className="hover:text-neon-pink transition text-bright-cyan">Community</Link>

        {/* ADMIN SPECIAL LINK - Sirf Admin ko nazar ayega */}
        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            className="bg-neon-pink/10 border border-neon-pink text-neon-pink px-4 py-1 rounded-lg hover:bg-neon-pink hover:text-white transition-all animate-pulse shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            Admin Panel
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
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
          <div className="flex items-center gap-4">
            {/* User Name Display for Professional Look */}
            <span className="text-[10px] text-gray-400 font-bold uppercase italic">Hi, {user.name}</span>
            
            <button 
              onClick={handleLogout}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;