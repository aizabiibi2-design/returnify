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
    // Updated: px-10 ko responsive banaya (mobile pe px-4, desktop pe px-10)
    <nav className="bg-royal-blue border-b-2 border-neon-pink/30 py-4 px-4 md:px-10 flex justify-between items-center shadow-xl sticky top-0 z-50">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link 
          to="/" 
          // Updated: Mobile pe text-2xl aur desktop pe text-3xl taake space bache
          className="text-bright-cyan text-2xl md:text-3xl font-black italic uppercase tracking-tighter shrink-0"
        >
          Returnify
        </Link>
      </div>
      
      {/* Middle Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white items-center">
        <Link to="/" className="hover:text-neon-pink transition">Home</Link>
        <Link to="/discovery" className="hover:text-neon-pink transition">Discovery</Link>
        
        {user && (
          <Link to="/inbox" className="relative flex items-center gap-1 hover:text-neon-pink transition">
            Signals
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </Link>
        )}
        
        {user && <Link to="/post" className="hover:text-neon-pink transition">Post Item</Link>}
        
        <Link to="/leaderboard" className="hover:text-neon-pink transition text-bright-cyan">Community</Link>

        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            className="bg-neon-pink/10 border border-neon-pink text-neon-pink px-4 py-1 rounded-lg hover:bg-neon-pink hover:text-white transition-all animate-pulse shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            Admin Panel
          </Link>
        )}
      </div>

      {/* Right Section (Login/Logout/Register) */}
      {/* Updated: gap ko responsive banaya taake mobile pe chipke nahi */}
      <div className="flex gap-2 md:gap-4 items-center shrink-0">
        {!user ? (
          <>
            <Link 
              to="/login" 
              // Updated: Mobile pe padding kam (px-3) aur desktop pe (px-6)
              className="px-3 md:px-6 py-2 border border-bright-cyan text-bright-cyan rounded-full text-[10px] md:text-xs font-bold hover:bg-bright-cyan hover:text-royal-blue transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-3 md:px-6 py-2 bg-neon-pink text-white rounded-full text-[10px] md:text-xs font-bold shadow-lg hover:opacity-90 transition whitespace-nowrap"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-[10px] text-gray-400 font-bold uppercase italic">Hi, {user.name}</span>
               <span className="text-[8px] text-bright-cyan/50 font-black uppercase tracking-widest">{user.role}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-4 md:px-6 py-2 border border-red-500 text-red-500 rounded-full text-[10px] md:text-xs font-bold hover:bg-red-500 hover:text-white transition uppercase tracking-widest"
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