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
        const response = await fetch(`http://localhost:5000/api/items/${id}`);
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0c29] flex flex-col justify-center items-center text-white">
      <div className="w-12 h-12 border-4 border-bright-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest text-[10px]">Loading Item Intelligence...</p>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen bg-[#0f0c29] flex justify-center items-center text-white font-black uppercase tracking-widest">
      Item not found!
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex justify-center items-center">
      <div className="max-w-6xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Image Section */}
        <div className="md:w-1/2 h-[400px] md:h-auto relative group">
          <img 
            src={`http://localhost:5000/uploads/${item.image}`} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29]/80 to-transparent md:hidden"></div>
        </div>
        
        {/* Right Side: Details Section */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative">
          {/* Status Badge */}
          <span className={`w-fit px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl border-2 ${
            item.type === 'Lost' ? 'bg-neon-pink/20 border-neon-pink text-neon-pink' : 'bg-bright-cyan/20 border-bright-cyan text-bright-cyan'
          }`}>
            {item.type} Report
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-4 tracking-tighter leading-none">
            {item.title}
          </h1>
          
          <div className="flex items-center text-bright-cyan font-black mb-8 uppercase tracking-[0.2em] text-[10px]">
            <span className="mr-3 text-xl">📍</span> {item.location}
          </div>
          
          {/* Description Box */}
          <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 mb-8 backdrop-blur-md">
            <p className="text-gray-300 leading-relaxed font-medium text-sm italic">
              "{item.description}"
            </p>
          </div>

          {/* Poster Intelligence Section */}
          <div className="bg-white/5 p-6 rounded-[25px] border-l-4 border-bright-cyan mb-10 flex items-center gap-5">
            <div className="w-12 h-12 bg-bright-cyan rounded-full flex items-center justify-center font-black text-royal-blue text-xl shadow-neon">
              {item.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Reported Intelligence By</p>
              <p className="text-white font-black uppercase text-sm tracking-wider">{item.user?.name || "Verified Member"}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <a 
              href={`mailto:${item.user?.email}`}
              className="w-full py-5 bg-bright-cyan text-royal-blue rounded-2xl font-black uppercase text-xs tracking-[0.3em] text-center shadow-lg hover:bg-white transition-all active:scale-95"
            >
              Contact Agent ✉️
            </a>

            <button 
              onClick={() => navigate('/discovery')}
              className="w-full py-5 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 transition-all"
            >
              Back to Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;