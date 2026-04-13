import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { token, user } = useContext(AuthContext);
    const { receiverId } = useParams(); // URL se receiver ki ID uthayega
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // 1. Messages Fetch Karne ka Function
    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/messages/${receiverId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Messages nahi aa sakay:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Har 3 second baad auto-refresh (Initial stage ke liye)
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    // 2. Message Bhejne ka Function
    const handleSendMessage = async (e) => {
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
                    receiverId: receiverId,
                    text: newMessage
                })
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(); // List update karein
            }
        } catch (err) {
            alert("Message send nahi hua!");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0c29] p-6 flex flex-col items-center">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="bg-[#1a1a4b] p-4 text-white font-bold text-center">
                    Chat with User
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
                    {messages.map((msg, index) => (
                        <div key={index} className={`max-w-[70%] p-3 rounded-2xl font-bold text-sm ${
                            msg.senderId === user._id 
                            ? "bg-[#ff007a] text-white self-end rounded-tr-none" 
                            : "bg-gray-200 text-[#1a1a4b] self-start rounded-tl-none"
                        }`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                    <input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border-2 rounded-xl outline-none focus:border-[#00d4ff] text-black font-semibold"
                    />
                    <button type="submit" className="bg-[#1a1a4b] text-white px-6 py-2 rounded-xl font-black uppercase text-xs">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;