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
    if (!token || !itemId || !otherUserId) return;
    
    try {
      const itemRes = await fetch(`http://localhost:5000/api/items/details/${itemId}`);
      if (itemRes.ok) {
        const itemData = await itemRes.json();
        setItemDetails(itemData);
      }

      const msgRes = await fetch(`http://localhost:5000/api/messages/history/${itemId}/${otherUserId}`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      });
      
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login');
        return;
      }
    }

    fetchChatData();
    const interval = setInterval(fetchChatData, 3000);

    return () => clearInterval(interval);
  }, [itemId, otherUserId, token, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) return;

    const messageText = newMessage;
    setNewMessage(""); 

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
          text: messageText
        })
      });

      if (res.ok) {
        await fetchChatData(); 
      } else {
        setNewMessage(messageText);
      }
    } catch (err) {
      setNewMessage(messageText);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#0f0c29] flex items-center justify-center z-50">
      <div className="text-cyan-400 font-black animate-pulse text-[10px] tracking-[0.5em]">INITIALIZING SIGNAL...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0f0c29] flex flex-col items-center justify-start p-4 md:p-8 font-sans overflow-hidden">
        
        {/* Main Interface Container */}
        <div className="w-full max-w-4xl bg-[#1a1a4b]/80 backdrop-blur-xl rounded-[40px] border-2 border-cyan-400/50 flex flex-col h-full max-h-[85vh] shadow-[0_0_80px_rgba(0,212,255,0.15)] relative mt-8">
            
            {/* Cyber Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#ff007a] to-cyan-400 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(255,0,122,0.3)]">
                  {itemDetails?.title ? itemDetails.title.charAt(0) : "S"}
                </div>
                <div>
                  <h1 className="text-white font-black uppercase italic tracking-tighter text-lg leading-none">Signal Hub</h1>
                  <p className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest mt-1 opacity-80">Connected: {itemDetails?.title || "Data Stream"}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(-1)} 
                className="text-white/40 hover:text-[#ff007a] font-black uppercase text-[10px] tracking-widest transition-all hover:scale-110"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Encryption/Messages Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                {messages.length > 0 ? messages.map((msg, i) => {
                    const senderId = msg.sender?._id || msg.sender;
                    const currentUserId = user?._id || user;
                    const isMe = String(senderId) === String(currentUserId);
                    const senderName = msg.sender?.name || "User";

                    return (
                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                            {/* Simple Label: No Brackets */}
                            <span className={`text-[8px] font-black uppercase tracking-[0.3em] mb-2 px-1 ${isMe ? 'text-pink-400' : 'text-cyan-400'}`}>
                                {isMe ? `YOU` : senderName}
                            </span>

                            <div className={`max-w-[75%] p-5 rounded-3xl text-[13px] font-bold shadow-xl leading-relaxed ${
                                isMe 
                                ? 'bg-gradient-to-br from-[#ff007a] to-[#b00055] text-white rounded-tr-none' 
                                : 'bg-[#12123d] text-cyan-100 rounded-tl-none border border-cyan-400/20'
                            }`}>
                                {msg.text}
                                <div className={`text-[7px] mt-2 opacity-30 font-mono ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <div className="w-12 h-1 bg-cyan-400 mb-4 animate-pulse"></div>
                        <p className="text-white text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Signals...</p>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Neural Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/10 shrink-0">
                <div className="flex gap-4">
                    <input 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      placeholder="Enter signal text..."
                      className="flex-1 bg-[#0f0c29] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-[#ff007a] transition-all placeholder:opacity-20" 
                    />
                    <button 
                      type="submit" 
                      className="bg-cyan-500 hover:bg-[#ff007a] text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] active:scale-95"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Chat;