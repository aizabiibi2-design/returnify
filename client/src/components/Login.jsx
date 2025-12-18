import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials. Access Denied.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-royal-blue via-[#1a1a4b] to-[#2d1b4d] relative">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink to-bright-cyan"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-royal-blue uppercase italic tracking-tighter">Returnify</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Access Your Network</p>
        </div>

        {error && <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest">{error}</div>}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-1.5 ml-1 tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></span> EMAIL
            </label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@network.com" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-neon-pink outline-none text-royal-blue text-xs font-bold transition" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-1.5 ml-1 tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></span> PASSWORD
            </label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-neon-pink outline-none text-royal-blue text-xs font-bold transition" />
          </div>

          <button type="submit" className="w-full bg-royal-blue text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:bg-neon-pink transition-all active:scale-95">login</button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-50 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            New here? <Link to="/register" className="text-neon-pink hover:text-royal-blue transition-colors underline">Register Now</Link>
           </p>
        </div>
      </div>
    </div>
  ); 
};

export default Login;