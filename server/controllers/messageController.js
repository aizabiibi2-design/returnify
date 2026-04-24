const Message = require('../models/message');

// 1. Send Message: Naya message network mein inject karne ke liye
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, itemId, text } = req.body;
        const sender = req.user._id; // _id use karein as per MongoDB standard

        if (!receiver || !text || !itemId) {
            return res.status(400).json({ message: "Missing details: Receiver, Item, or Text" });
        }

        const newMessage = new Message({ sender, receiver, itemId, text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Chat History: Do users ke darmiyan aik specific item par baat cheet
exports.getChatHistory = async (req, res) => {
    try {
        const { itemId, otherUserId } = req.params;
        const messages = await Message.find({
            itemId,
            $or: [
                { sender: req.user._id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get User Inbox: Doosre user ko message kahan nazar ayega (Full Logic)
exports.getUserInbox = async (req, res) => {
    try {
        const userId = req.user._id;

        // Saray messages dhoondo jo aapne bheje ya aapko mile
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender receiver', 'name email')
        .populate('itemId', 'title image')
        .sort({ createdAt: -1 });

        const conversations = [];
        const seenChats = new Set();

        messages.forEach(msg => {
            // Agar item delete ho chuka ho toh skip karein
            if (!msg.itemId) return;

            // Pata lagayein ke doosra banda kaun hai
            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            
            // Aik item aur aik bande ke darmiyan aik hi "Chat Card" dikhana hai
            const chatKey = `${otherUser._id}-${msg.itemId._id}`;

            if (!seenChats.has(chatKey)) {
                seenChats.add(chatKey);
                conversations.push({
                    _id: msg._id,
                    otherUser,
                    lastMessage: msg.text,
                    item: msg.itemId,
                    createdAt: msg.createdAt
                });
            }
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Inbox Fetch Error: " + error.message });
    }
};

// Compatibility ke liye purana naam bhi export kar dete hain
exports.getConversations = exports.getUserInbox;