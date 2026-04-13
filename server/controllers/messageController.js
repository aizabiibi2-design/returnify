const Message = require('../models/message');

// 1. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, itemId, text } = req.body;
        const sender = req.user.id; 

        if (!receiver || !text) {
            return res.status(400).json({ message: "Receiver and text are required" });
        }

        const newMessage = new Message({
            sender,
            receiver,
            itemId,
            text
        });

        await newMessage.save();
        
        // Populate sender and receiver details immediately after saving
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to send message", 
            error: error.message 
        });
    }
};

// 2. Get Chat History
exports.getChatHistory = async (req, res) => {
    try {
        const { itemId, otherUserId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({
            itemId: itemId,
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
        .populate('sender', 'name')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ 
            message: "Could not load chat history", 
            error: error.message 
        });
    }
};

// 3. Get All Conversations (For Inbox)
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender receiver', 'name')
        .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to load conversations" });
    }
};