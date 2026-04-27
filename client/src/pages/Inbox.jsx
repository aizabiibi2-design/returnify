import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/inbox', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setChats(data);
        }
      } catch (err) {
        console.error("Inbox data fetch failed");
      }
    };
    if (token) fetchInbox();
  }, [token]);

  const handleChatClick = (chat) => {
    // Navigating using the correct IDs
    const itemId = chat.item?._id;
    const otherUserId = chat.otherUser?._id;

    if (itemId && otherUserId) {
      navigate(`/chat/${itemId}/${otherUserId}`);
    } else {
      alert("Error: Link corrupted. The item might have been deleted.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black text-white uppercase italic mb-12 tracking-tighter">
          Signal <span className="text-cyan-400">Inbox</span>
        </h1>
        
        <div className="grid gap-6">
          {chats.length > 0 ? chats.map((chat) => (
            <div 
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className="bg-[#1a1a4b]/50 backdrop-blur-xl border-2 border-white/5 p-6 rounded-[40px] flex items-center gap-8 hover:border-pink-500 hover:bg-[#1a1a4b] cursor-pointer transition-all duration-500 group shadow-2xl"
            >
              {/* Item Photo */}
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-pink-500 transition-all shadow-lg flex-shrink-0">
                {chat.item?.image ? (
                  <img 
                    src={`http://localhost:5000/uploads/${chat.item.image}`} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500" 
                    alt="item"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20">NO IMAGE</div>
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white font-black uppercase text-lg tracking-tight group-hover:text-pink-500 transition-colors truncate">
                    {chat.item?.title || "Item Information Restricted"}
                  </h3>
                  <span className="text-[10px] text-white/20 font-black italic uppercase tracking-[0.2em] whitespace-nowrap">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
                  Signal From: {chat.otherUser?.name || "Anonymous User"}
                </p>
                
                <div className="bg-black/20 p-3 rounded-2xl inline-block w-full">
                  <p className="text-gray-400 text-xs italic truncate">
                    "{chat.lastMessage}"
                  </p>
                </div>
              </div>

              {/* Action Arrow (Navigation) */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:rotate-[360deg] transition-all duration-700">
                  <span className="text-white text-xl">→</span>
                </div>
                <span className="text-[8px] text-white/10 font-bold uppercase tracking-widest group-hover:text-white/40">Connect</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[60px]">
              <div className="animate-pulse mb-4 text-4xl">📡</div>
              <p className="text-white/20 uppercase font-black tracking-[0.6em] text-sm">No active signals in range</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;