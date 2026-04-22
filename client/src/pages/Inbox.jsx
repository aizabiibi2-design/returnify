import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setConversations(data);
      } catch (err) { console.error(err); }
    };
    fetchInbox();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 text-white">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">
        Your <span className="text-cyan-400">Signals</span>
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {conversations.length > 0 ? conversations.map((chat, index) => (
          <div key={index} className="bg-[#1a1a4b] border-2 border-white/5 p-6 rounded-[30px] hover:border-pink-500 transition-all flex justify-between items-center group">
            <div>
              <h3 className="text-pink-500 font-black uppercase text-xs tracking-widest mb-1">
                RE: {chat.item?.title || "Deleted Item"}
              </h3>
              <p className="text-xl font-bold italic">{chat.otherUser.name}</p>
              <p className="text-gray-400 text-sm mt-1">{chat.lastMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-3">
                {new Date(chat.date).toLocaleDateString()}
              </p>
              <button className="px-6 py-2 bg-cyan-500 text-black font-black uppercase text-[10px] rounded-full group-hover:bg-white transition-all">
                Open Chat
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 opacity-20 font-black uppercase tracking-[0.5em]">No Signals Found</div>
        )}
      </div>
    </div>
  );
};

export default Inbox;