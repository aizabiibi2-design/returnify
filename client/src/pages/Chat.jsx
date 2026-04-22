import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Discovery = () => {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/items');
        const data = await res.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // 2. Open Chat Modal logic
  const openChat = (item) => {
    setSelectedItem(item);
    setShowChatModal(true);
  };

  // 3. Send Signal Logic (FIXED)
  const handleSendSignal = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedItem) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: selectedItem.user._id || selectedItem.user, // Get seller ID
          itemId: selectedItem._id, // Get item ID
          text: newMessage
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signal Sent! 🚀");
        setNewMessage("");
        setShowChatModal(false);
      } else {
        alert(data.message || "Failed to send signal");
      }
    } catch (err) {
      alert("Connection Error! Backend server check karein.");
    }
  };

  if (loading) return <div className="text-white text-center mt-20 font-black italic uppercase animate-pulse">Scanning Network...</div>;

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8">
      <h1 className="text-white text-4xl font-black uppercase italic mb-10 tracking-tighter text-center">
        Discovery <span className="text-bright-cyan">Network</span>
      </h1>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="bg-white/5 border border-white/10 rounded-[30px] overflow-hidden group hover:border-bright-cyan transition-all">
            <img src={`http://localhost:5000/uploads/${item.image}`} className="h-48 w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="item" />
            <div className="p-6">
              <h3 className="text-white font-black uppercase text-lg">{item.title}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 mb-4">📍 {item.location}</p>
              
              <div className="flex gap-2">
                <button onClick={() => window.location.href=`/item/${item._id}`} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-black text-[10px] uppercase">Details</button>
                <button onClick={() => openChat(item)} className="flex-1 bg-neon-pink text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">Chat</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHAT MODAL (The Popup) --- */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a4b] w-full max-w-md rounded-[40px] border-2 border-bright-cyan p-8 relative shadow-[0_0_50px_rgba(0,212,255,0.3)]">
            <button onClick={() => setShowChatModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white font-black">✕</button>
            
            <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-1">Signal Transmission</h2>
            <p className="text-bright-cyan text-[10px] font-bold uppercase mb-6 opacity-60">RE: {selectedItem?.title}</p>

            <form onSubmit={handleSendSignal}>
              <textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your message..."
                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-white font-medium text-sm outline-none focus:border-neon-pink transition-all resize-none mb-4"
              />
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-bright-cyan to-royal-blue text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-neon hover:scale-[1.02] active:scale-95 transition-all">
                Send Signal 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discovery;