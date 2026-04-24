import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { itemId, otherUserId } = useParams(); 
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatData = async () => {
    try {
      // Fetch Item Details
      const itemRes = await fetch(`http://localhost:5000/api/items/details/${itemId}`);
      const itemData = await itemRes.json();
      setItemDetails(itemData);

      // Fetch Chat History
      const msgRes = await fetch(`http://localhost:5000/api/messages/history/${itemId}/${otherUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const msgData = await msgRes.json();
      setMessages(msgData);
      setLoading(false);
    } catch (err) {
      console.error("Connection error");
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    fetchChatData();

    // AUTO-POLLING: Har 3 seconds baad messages refresh karein
    const interval = setInterval(fetchChatData, 3000);
    return () => clearInterval(interval);
  }, [itemId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: otherUserId,
          itemId: itemId,
          text: newMessage
        })
      });

      if (res.ok) {
        setNewMessage("");
        fetchChatData(); 
      }
    } catch (err) {
      alert("Transmission failed!");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-cyan-400 font-black italic animate-pulse uppercase">Syncing Signals...</div>;

  return (
    <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-3xl bg-[#1a1a4b] rounded-[40px] border-2 border-cyan-400 overflow-hidden flex flex-col h-[85vh] shadow-[0_0_50px_rgba(0,212,255,0.15)]">
        
        {/* Header */}
        <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#ff007a] to-cyan-400 rounded-2xl flex items-center justify-center text-white font-black uppercase">
              {itemDetails?.title?.charAt(0)}
            </div>
            <div>
              <h1 className="text-white font-black uppercase italic tracking-tighter text-lg leading-none">Signal Hub</h1>
              <p className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest mt-1 italic">Talking about: {itemDetails?.title}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="text-white/30 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">✕ Close</button>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length > 0 ? messages.map((msg, i) => {
            const isMe = (msg.sender?._id || msg.sender) === (user?._id || user);
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-5 rounded-3xl text-xs font-bold leading-relaxed shadow-xl ${
                  isMe 
                  ? 'bg-gradient-to-br from-[#ff007a] to-[#b00055] text-white rounded-tr-none' 
                  : 'bg-white/10 text-cyan-100 rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
               <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Waiting for transmission...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/10">
          <div className="flex gap-3 relative">
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Inject message into the network..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold outline-none focus:border-cyan-400"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-[#ff007a] text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;