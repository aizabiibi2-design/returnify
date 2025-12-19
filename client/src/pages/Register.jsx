import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', role: 'individual', password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      // Backend ko request bhejte waqt console check karein
      console.log("Submitting:", formData);
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        // 2 second baad login par bhejna
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      // 400 error ka asli message yahan se pakra jayega
      const errorMsg = err.response?.data?.message || "Registration failed. Please check all fields.";
      setError(errorMsg);
      console.error("Registration Error:", err.response?.data);
    }
  };

  const StyledLabel = ({ text }) => (
    <label className="block text-[10px] font-black text-royal-blue uppercase mb-1.5 ml-1 tracking-wider flex items-center">
      <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mr-2"></span>
      {text}
    </label>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-royal-blue via-[#1a1a4b] to-[#2d1b4d] relative font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 overflow-hidden relative border border-white/20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bright-cyan via-neon-pink to-royal-blue"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-royal-blue uppercase italic tracking-tighter">Returnify</h2>
          <p className="text-neon-pink text-[10px] font-bold uppercase mt-1 tracking-[0.2em]">Secure Network Entry</p>
        </div>

        {/* Error Message Box */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest animate-bounce">
            ⚠️ {error}
          </div>
        )}

        {/* Success Message Box */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-bold uppercase tracking-widest">
            ✅ Registration Successful! Redirecting...
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleRegister}>
          <div className="md:col-span-2">
            <StyledLabel text="Full Name" />
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER FULL NAME" className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-bright-cyan outline-none text-royal-blue text-xs font-bold transition-all" />
          </div>
          <div className="md:col-span-2">
            <StyledLabel text="Email Address" />
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="MAIL@NETWORK.COM" className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-bright-cyan outline-none text-royal-blue text-xs font-bold transition-all" />
          </div>
          <div><StyledLabel text="Phone" /><input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+92..." className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-bright-cyan outline-none text-royal-blue text-xs font-bold transition-all" /></div>
          <div><StyledLabel text="City" /><input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="LOCATION" className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-bright-cyan outline-none text-royal-blue text-xs font-bold transition-all" /></div>
          
          <div className="md:col-span-2 bg-royal-blue/5 p-4 rounded-2xl border border-royal-blue/10">
            <StyledLabel text="Select Network Role" />
            <div className="flex gap-8 mt-2 ml-1">
              {['individual', 'organization'].map((r) => (
                <label key={r} className="flex items-center cursor-pointer">
                  <input type="radio" name="role" value={r} checked={formData.role === r} onChange={(e) => setFormData({...formData, role: e.target.value})} className="hidden" />
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${formData.role === r ? 'border-neon-pink bg-neon-pink/10' : 'border-gray-300'}`}>
                    {formData.role === r && <span className="w-2.5 h-2.5 bg-neon-pink rounded-full"></span>}
                  </span>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${formData.role === r ? 'text-royal-blue' : 'text-gray-400'}`}>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <StyledLabel text="Secure Password" />
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-neon-pink outline-none text-royal-blue text-xs font-bold transition-all" />
          </div>
          <button type="submit" className="md:col-span-2 bg-royal-blue text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-neon-pink hover:-translate-y-1 transition-all active:scale-95 mt-4">
            {success ? "Success!" : "Register"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-[2px] bg-gray-200 flex-grow rounded-full"></div>
          <span className="text-[12px] font-black text-royal-blue uppercase tracking-widest">OR</span>
          <div className="h-[2px] bg-gray-200 flex-grow rounded-full"></div>
        </div>

        <button type="button" className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 py-3.5 rounded-xl hover:bg-gray-50 transition-all group shadow-sm">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-[11px] font-black text-royal-blue uppercase tracking-widest group-hover:text-neon-pink">Sign up with Google</span>
        </button>

        <div className="mt-8 pt-6 border-t-2 border-gray-50 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Already in the network? <Link to="/login" className="text-neon-pink hover:text-royal-blue transition-colors underline">Login here</Link>
           </p>
        </div>
      </div>
    </div>
  ); 
};

export default Register;