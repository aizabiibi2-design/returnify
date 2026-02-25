import React, { useState } from 'react';
import axios from 'axios';

const AIIntelligence = () => {
  const [lostItem, setLostItem] = useState({ name: '', location: '', desc: '' });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!lostItem.name || !lostItem.desc) {
      alert("SYSTEM ERROR: Data fields cannot be empty! 白");
      return;
    }
    
    setLoading(true);
    try {
      // Step 1: Backend (Port 5000) se data lana
      const dbResponse = await axios.get('http://localhost:5000/api/items/all-items');
      const foundItems = dbResponse.data;

      // Step 2: AI Flask (Port 5001) ko processing ke liye bhejna
      const aiResponse = await axios.post('http://localhost:5001/match', {
        item_name: lostItem.name,
        location: lostItem.location,
        lost_desc: lostItem.desc,
        found_items: foundItems
      });

      setMatches(aiResponse.data.matches);
    } catch (error) {
      console.error("AI OFFLINE:", error);
      alert("AI ENGINE CONNECTION FAILED: Check if Flask is running on 5001.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex flex-col items-center">
      {/* Header - Styled like Home.jsx */}
      <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-2 mt-10">
        AI <span className="text-neon-pink">MATCHING</span> ENGINE
      </h1>
      <p className="text-bright-cyan text-[10px] font-black uppercase tracking-[0.5em] mb-12 shadow-neon">
        Powered by TF-IDF & Cosine Similarity
      </p>

      {/* Input Module - Styled like PostItem.jsx but Neon */}
      <div className="max-w-4xl w-full bg-white/5 border-2 border-white/10 rounded-[40px] p-10 backdrop-blur-md shadow-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black text-bright-cyan uppercase mb-3 tracking-widest italic">Item Name</label>
            <input 
              type="text" 
              placeholder="E.G. STUDENT CARD" 
              className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-bold outline-none focus:border-neon-pink transition-all uppercase"
              onChange={(e) => setLostItem({...lostItem, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-bright-cyan uppercase mb-3 tracking-widest italic">Location Context</label>
            <input 
              type="text" 
              placeholder="E.G. ADMIN BLOCK" 
              className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-bold outline-none focus:border-bright-cyan transition-all uppercase"
              onChange={(e) => setLostItem({...lostItem, location: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-bright-cyan uppercase mb-3 tracking-widest italic">Item Intelligence/Description</label>
            <textarea 
              rows="3" 
              placeholder="DETAILED FEATURES..." 
              className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-3xl text-white font-bold outline-none focus:border-neon-pink transition-all uppercase"
              onChange={(e) => setLostItem({...lostItem, desc: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={handleMatch}
          className="w-full mt-10 py-5 bg-bright-cyan text-royal-blue rounded-3xl font-black uppercase text-xs tracking-[0.5em] shadow-neon hover:bg-white transition-all active:scale-95"
        >
          {loading ? "SCANNING NETWORK..." : "INITIATE AI SCAN"}
        </button>
      </div>

      {/* Results Display - Similar to Discovery.jsx cards */}
      <div className="max-w-6xl w-full">
        <h2 className="text-xl font-black text-white italic uppercase tracking-widest mb-8 border-l-4 border-neon-pink pl-4">
          Scan <span className="text-bright-cyan">Results</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.length > 0 ? matches.map((item, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[30px] relative hover:border-neon-pink transition-all">
              <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                {(item.score * 100).toFixed(0)}% MATCH
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">{item.title}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Found @ {item.location || "N/A"}</p>
              <button className="mt-6 w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bright-cyan hover:text-royal-blue transition-all">
                Claim Intelligence
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-10 text-gray-600 font-black uppercase tracking-widest">
              No Data Found in Current Frequency
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;