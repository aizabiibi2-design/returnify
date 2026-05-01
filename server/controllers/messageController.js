const Message = require('../models/message');

// 1. Get User Inbox (Aapka original logic)
exports.getUserInbox = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender receiver', 'name email')
        .populate('itemId', 'title image') 
        .sort({ createdAt: -1 });

        const conversations = [];
        const seenChats = new Set();

        messages.forEach(msg => {
            if (!msg.sender || !msg.receiver) return; // Safety check

            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            
            const itemKey = msg.itemId ? msg.itemId._id.toString() : "deleted";
            const chatKey = `${otherUser._id}-${itemKey}`;

            if (!seenChats.has(chatKey)) {
                seenChats.add(chatKey);
                conversations.push({
                    _id: msg._id,
                    otherUser: otherUser,
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

// 2. Send Message (Manual aur AI dono ke liye)
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, itemId, text } = req.body;
        const sender = req.user._id;

        if (!receiver || !itemId || !text) {
            return res.status(400).json({ message: "Data missing: receiver, itemId, or text required." });
        }

        const newMessage = new Message({
            sender,
            receiver,
            itemId,
            text
        });

        await newMessage.save();

        // Populate details for immediate frontend update
        const fullMessage = await Message.findById(newMessage._id)
            .populate('sender receiver', 'name email')
            .populate('itemId', 'title image');

        res.status(201).json(fullMessage);
    } catch (error) {
        console.error("Manual Send Error:", error);
        res.status(500).json({ message: "Message transmission failed: " + error.message });
    }
};

// 3. Get Chat History (Specific conversation load karne ke liye)
exports.getChatHistory = async (req, res) => {
    try {
        const { itemId, otherUserId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            itemId: itemId,
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
        .populate('sender receiver', 'name email')
        .sort({ createdAt: 1 }); // Oldest first for chat flow

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "History Sync Error: " + error.message });
    }
};