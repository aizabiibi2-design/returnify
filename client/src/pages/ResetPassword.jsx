import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { id } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend api call
      await axios.post(`http://localhost:5000/api/auth/reset-password/${id}`, { password });
      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage("Error updating password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a4b] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-black text-royal-blue mb-4 uppercase leading-tight">
          New Password
        </h2>
        
        {message && (
          <p className="text-neon-pink text-xs font-bold mb-4 animate-pulse">
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="ENTER NEW PASSWORD" 
            // text-black class se ab aapka password dots black nazar ayenge
            className="w-full p-4 bg-gray-100 rounded-xl border-2 border-gray-100 outline-none focus:border-royal-blue text-sm font-bold text-black"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-[#1a1a4b] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-royal-blue transition-all shadow-lg"
          >
            Update Password
          </button>
        </form> 
      </div>
    </div>
  );
};

export default ResetPassword;