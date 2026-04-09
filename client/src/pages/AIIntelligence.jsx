import React, { useState } from 'react';
import axios from 'axios';

const AIIntelligence = () => {
  const [lostItem, setLostItem] = useState({ name: '', location: '', desc: '' });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!lostItem.name || !lostItem.desc) {
      alert("SYSTEM ERROR: Please fill name and description! 📝");
      return;
    }
    
    setLoading(true);
    setMatches([]); // Purane matches clear karein
    
    try {
      // Step 1: Get data from Node.js Backend
      const dbResponse = await axios.get('http://localhost:5000/api/items/all-items');
      const foundItems = dbResponse.data;

      // Step 2: Send to Flask AI Engine
      const aiResponse = await axios.post('http://localhost:5001/match', {
        item_name: lostItem.name,
        location: lostItem.location,
        lost_desc: lostItem.desc,
        found_items: foundItems
      });

      // Backend se matches array nikalna
      if (aiResponse.data.success) {
        setMatches(aiResponse.data.matches);
      }
    } catch (error) {
      console.error("AI CONNECTION ERROR:", error);
      alert("AI OFFLINE: Make sure Flask (5001) is running! 🔌");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-2 mt-10 text-center">
        AI <span className="text-neon-pink">MATCHING</span> ENGINE
      </h1>
      <p className="text-bright-cyan text-[10px] font-black uppercase tracking-[0.5em] mb-12 shadow-neon text-center">
        Powered by TF-IDF & Cosine Similarity
      </p>

      {/* Input Module */}
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
          disabled={loading}
          className="w-full mt-10 py-5 bg-bright-cyan text-royal-blue rounded-3xl font-black uppercase text-xs tracking-[0.5em] shadow-neon hover:bg-white transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "SCANNING NETWORK..." : "INITIATE AI SCAN"}
        </button>
      </div>

      {/* Results Display */}
      <div className="max-w-6xl w-full">
        <h2 className="text-xl font-black text-white italic uppercase tracking-widest mb-8 border-l-4 border-neon-pink pl-4">
          Scan <span className="text-bright-cyan">Results</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.length > 0 ? matches.map((item, index) => (
            <div key={index} className="bg-[#1a1a4b] border-2 border-white/5 p-6 rounded-[30px] relative hover:border-neon-pink transition-all duration-300">
              
              {/* FIXED SCORE DISPLAY */}
              <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg border-2 border-[#0f0c29]">
                {item.score ? `${(item.score * 100).toFixed(0)}% MATCH` : "MATCH FOUND"}
              </div>

              <h3 className="text-xl font-black text-white uppercase italic mb-2">{item.title}</h3>
              <p className="text-[10px] text-bright-cyan font-bold uppercase mb-4 italic">Found @ {item.location || "Unknown"}</p>
              
              <div className="h-[2px] w-full bg-white/5 mb-4"></div>

              <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-royal-blue transition-all">
                Claim Intelligence
              </button>
            </div>
          )) : !loading && (
            <div className="col-span-full text-center py-10 text-gray-600 font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[40px]">
              No High-Frequency Matches Detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;