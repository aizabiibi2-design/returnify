import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend api call
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage("Reset link sent to your email!");
    } catch (err) {
      setMessage("User not found or Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-royal-blue to-[#1a1a4b] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-black text-royal-blue mb-4 uppercase">Reset Access</h2>
        <p className="text-gray-500 text-xs mb-6 uppercase tracking-widest">Enter email to receive reset link</p>
        {message && <p className="text-neon-pink text-xs font-bold mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="USER@NETWORK.COM" 
            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-100 outline-none focus:border-neon-pink text-xs font-bold"
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" className="w-full bg-royal-blue text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-neon-pink transition-all">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;