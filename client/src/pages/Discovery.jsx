import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Token ke liye context

const Discovery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  
  // Messaging States
  const [showChat, setShowChat] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [messageText, setMessageText] = useState('');

  const { token, user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const pkCities = ["Rawalpindi", "Islamabad", "Lahore", "Karachi", "Peshawar"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items/all-items');
        const data = await response.json();
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    if (filterType !== 'All') result = result.filter(item => item.type === filterType);
    if (filterCity !== 'All') result = result.filter(item => item.city === filterCity);
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [searchTerm, filterType, filterCity, items]);

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!token) { alert("Please login to send a message!"); return; }

    try {
      const response = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          receiver: selectedItem.user._id, // Owner ki ID
          itemId: selectedItem._id,
          text: messageText
        }),
      });

      if (response.ok) {
        alert("🚀 Message Sent Successfully!");
        setMessageText('');
        setShowChat(false);
      }
    } catch (err) {
      alert("📡 Connection Error!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 relative">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">
          Discovery <span className="text-pink-500">Portal</span>
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">Search through lost and found reports</p>
      </div>

      {/* Filter Section (Same as your code) */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          type="text" 
          placeholder="SEARCH ITEMS..." 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-cyan-400 outline-none transition-all uppercase text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold focus:border-pink-500 outline-none transition-all uppercase text-sm cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>

        <select 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold focus:border-cyan-400 outline-none transition-all uppercase text-sm cursor-pointer"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          {pkCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>

        <div className="bg-cyan-400/10 border-2 border-cyan-400/20 p-4 rounded-2xl text-cyan-400 font-black text-center uppercase text-xs flex items-center justify-center">
          {filteredItems.length} Reports Found
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-20 text-white font-black animate-pulse uppercase tracking-widest">Loading Reports...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item._id} className="group relative bg-[#1a1a4b] border-2 border-white/5 rounded-[40px] overflow-hidden hover:border-pink-500 transition-all duration-500">
              <div className="h-64 overflow-hidden">
                {item.image ? (
                  <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 font-bold">NO IMAGE</div>
                )}
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'Lost' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.city}</span>
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors mb-2">{item.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-4">Posted By: {item.user?.name || 'Anonymous'}</p>
                
                <p className="text-gray-400 text-sm line-clamp-2 h-12">{item.description}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <button onClick={() => navigate(`/item/${item._id}`)} className="py-4 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all">
                    Details
                  </button>
                  
                  {/* MESSAGING BUTTON ADDED */}
                  <button 
                    onClick={() => { setSelectedItem(item); setShowChat(true); }}
                    className="py-4 bg-pink-500 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CHAT MODAL UI --- */}
      {showChat && selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a4b] w-full max-w-lg rounded-[30px] border-2 border-pink-500 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase italic">Chat with <span className="text-cyan-400">{selectedItem.user?.name}</span></h2>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            
            <p className="text-pink-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Re: {selectedItem.title}</p>
            
            <textarea 
              className="w-full h-40 bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-gray-600 mb-6"
              placeholder="Type your message here... (e.g. I think I found your wallet!)"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
            
            <button 
              onClick={handleSendMessage}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all"
            >
              Send Signal 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discovery;