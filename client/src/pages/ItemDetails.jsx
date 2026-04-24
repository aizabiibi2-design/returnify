import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/items/details/${id}`);
        const data = await res.json();
        if (res.ok) {
          setItem(data);
        } else {
          console.error("Item not found in database");
        }
        setLoading(false);
      } catch (err) {
        console.error("Connection failed");
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-cyan-400 font-black animate-pulse uppercase">Accessing Database...</div>;

  if (!item) return (
    <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-black mb-4 uppercase italic text-pink-500">404: Signal Lost</h1>
      <p className="text-gray-400 mb-8">The requested item does not exist in the network.</p>
      <button onClick={() => navigate('/discovery')} className="bg-cyan-500 px-8 py-3 rounded-xl font-black uppercase text-xs">Back to Discovery</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex justify-center items-center">
      <div className="max-w-6xl w-full bg-[#1a1a4b] rounded-[50px] border-2 border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full"></div>

        {/* Image Section */}
        <div className="md:w-1/2 h-[400px] md:h-auto border-r border-white/5">
          <img 
            src={`http://localhost:5000/uploads/${item.image}`} 
            alt={item.title} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
          />
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${item.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {item.type} Report
            </span>
            <span className="text-white/20 font-black uppercase text-[9px] tracking-widest italic">ID: {item._id.slice(-6)}</span>
          </div>

          <h1 className="text-5xl font-black text-white uppercase italic mb-2 leading-none tracking-tighter">
            {item.title}
          </h1>
          
          {/* Identity Logic: Showing name, keeping phone hidden for privacy */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.2em]">
              Verified Source: <span className="text-white ml-1">{item.user?.name || "System Member"}</span>
            </p>
          </div>

          <p className="text-gray-400 font-bold text-xs uppercase mb-8 flex items-center gap-2">
            <span className="text-pink-500 text-lg">📍</span> {item.location}, {item.city}
          </p>
          
          <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 mb-10 backdrop-blur-sm">
            <h4 className="text-white/30 font-black uppercase text-[9px] mb-3 tracking-widest italic">Data Logs / Description</h4>
            <p className="text-gray-300 text-sm leading-relaxed font-medium italic">"{item.description}"</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              Back to Portal
            </button>
            <button 
              onClick={() => navigate(`/chat/${item._id}/${item.user?._id || item.user}`)}
              className="py-5 bg-gradient-to-r from-pink-500 to-[#ff007a] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_10px_30px_rgba(255,0,122,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initiate Chat 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;