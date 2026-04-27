import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Clean data before sending
      const cleanEmail = email.trim().toLowerCase();

      const response = await axios.post('http://192.168.0.112:5000/api/auth/login', { 
        email: cleanEmail, 
        password 
      });
      
      if (response.data.success && response.data.token) {
        // Step 1: Save to LocalStorage for persistence
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Step 2: Update Global Context
        login(response.data.token, response.data.user); 
        
        // Step 3: Hard Refresh to sync Navbar/Admin Status
        window.location.href = '/'; 
      }
    } catch (err) {
      console.error("Login Error Details:", err.response?.data);
      setError(err.response?.data?.message || "Invalid Credentials. Access Denied.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0c29] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-pink-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full"></div>

      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 overflow-hidden relative border-b-8 border-pink-500">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#1a1a4b] uppercase italic tracking-tighter">
            Return<span className="text-pink-500">ify</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase mt-2 tracking-[0.3em]">Neural Link Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="group">
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span> Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="HERO@RETURNIFY.COM" 
              className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-cyan-400 focus:bg-white outline-none text-[#1a1a4b] text-xs font-bold transition-all duration-300" 
            />
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] font-black text-[#1a1a4b] uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span> Password
              </label>
              <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-pink-500 uppercase hover:underline">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-pink-500 focus:bg-white outline-none text-[#1a1a4b] text-xs font-bold transition-all duration-300" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1a1a4b] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.5em] shadow-xl hover:bg-pink-600 hover:shadow-pink-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Authenticate 🚀
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            New to the network? <Link to="/register" className="text-cyan-500 hover:text-pink-500 transition-colors underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  ); 
};

export default Login;