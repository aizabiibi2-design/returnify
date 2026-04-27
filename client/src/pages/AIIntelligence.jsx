import React, { useState, useContext } from 'react'; // Added useContext
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

const AIIntelligence = () => {
  const { token } = useContext(AuthContext); // Get Token
  const [lostItem, setLostItem] = useState({ name: '', location: '', desc: '' });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!lostItem.name || !lostItem.desc) {
      alert("SYSTEM ERROR: Please fill name and description! 📝");
      return;
    }
    setLoading(true);
    setMatches([]);
    try {
      // Laptop par test karne ke liye localhost hi rehne diya hai
      const dbResponse = await axios.get('http://localhost:5000/api/items/all-items');
      const foundItems = dbResponse.data;

      const aiResponse = await axios.post('http://localhost:5001/match', {
        item_name: lostItem.name,
        location: lostItem.location,
        lost_desc: lostItem.desc,
        found_items: foundItems
      });

      if (aiResponse.data.success) {
        setMatches(aiResponse.data.matches);
      }
    } catch (error) {
      alert("AI OFFLINE: Make sure Flask (5001) is running! 🔌");
    }
    setLoading(false);
  };

  // REAL CLAIM LOGIC - Updated ONLY the data object for validation
  const handleClaim = async (item) => {
    try {
      // Check karein ke item owner ka data populate ho raha hai
      if (!item.user || !item.user.email) {
        alert("Wait: Owner data is missing. Make sure your backend uses .populate('user')");
        return;
      }

      const response = await axios.post('http://localhost:5000/api/items/claim', 
        { 
          itemId: item.item_id || item._id, // Validation fix: uses item_id from AI engine
          ownerId: item.user._id,      
          ownerEmail: item.user.email,  
          itemName: item.title,
          message: `Match notification for ${item.title}` // Validation fix: sends required 'message' field
        }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`CLAIM LOGGED: Our AI has notified the founder via Email & Inbox! ✉️`);
      }
    } catch (error) {
      console.error("Claim Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to log claim");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex flex-col items-center">
      <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-2 mt-10 text-center">
        AI <span className="text-neon-pink">MATCHING</span> ENGINE
      </h1>
      <p className="text-bright-cyan text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-center">
        Powered by TF-IDF & Cosine Similarity
      </p>

      <div className="max-w-4xl w-full bg-white/5 border-2 border-white/10 rounded-[40px] p-10 backdrop-blur-md shadow-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input type="text" placeholder="Item Name" className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-bold outline-none focus:border-neon-pink uppercase" onChange={(e) => setLostItem({...lostItem, name: e.target.value})} />
          <input type="text" placeholder="Location Context" className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-bold outline-none focus:border-bright-cyan uppercase" onChange={(e) => setLostItem({...lostItem, location: e.target.value})} />
          <textarea rows="3" placeholder="Detailed Features..." className="md:col-span-2 w-full p-4 bg-white/5 border-2 border-white/10 rounded-3xl text-white font-bold outline-none focus:border-neon-pink uppercase" onChange={(e) => setLostItem({...lostItem, desc: e.target.value})} />
        </div>
        <button onClick={handleMatch} disabled={loading} className="w-full mt-10 py-5 bg-bright-cyan text-royal-blue rounded-3xl font-black uppercase text-xs tracking-[0.5em] shadow-neon hover:bg-white transition-all disabled:opacity-50">
          {loading ? "SCANNING NETWORK..." : "INITIATE AI SCAN"}
        </button>
      </div>

      <div className="max-w-6xl w-full">
        <h2 className="text-xl font-black text-white italic uppercase mb-8 border-l-4 border-neon-pink pl-4">Scan <span className="text-bright-cyan">Results</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.length > 0 ? matches.map((item, index) => (
            <div key={index} className="bg-[#1a1a4b] border-2 border-white/5 p-6 rounded-[30px] relative hover:border-neon-pink transition-all">
              <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-[10px] font-black px-4 py-2 rounded-full border-2 border-[#0f0c29]">
                {(item.score * 100).toFixed(0)}% MATCH
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">{item.title}</h3>
              <p className="text-[10px] text-bright-cyan font-bold uppercase mb-4 italic">Found @ {item.location}</p>
              
              <button onClick={() => handleClaim(item)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-royal-blue transition-all">
                Claim Intelligence
              </button>
            </div>
          ) ) : !loading && <div className="col-span-full text-center py-10 text-gray-600 font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[40px]">No High-Frequency Matches Detected</div>}
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;