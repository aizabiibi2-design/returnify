const Message = require('../models/message');

exports.getUserInbox = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender receiver', 'name email')
        .populate('itemId', 'title image') // Ensure title and image are here
        .sort({ createdAt: -1 });

        const conversations = [];
        const seenChats = new Set();

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            
            // Safe check for itemId
            const itemKey = msg.itemId ? msg.itemId._id.toString() : "deleted";
            const chatKey = `${otherUser._id}-${itemKey}`;

            if (!seenChats.has(chatKey)) {
                seenChats.add(chatKey);
                conversations.push({
                    _id: msg._id,
                    otherUser: otherUser,
                    lastMessage: msg.text,
                    item: msg.itemId, // Frontend needs 'item'
                    createdAt: msg.createdAt
                });
            }
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Inbox Fetch Error: " + error.message });
    }
};

// Ensure other exports are correct
exports.sendMessage = async (req, res) => { /* existing code */ };
exports.getChatHistory = async (req, res) => { /* existing code */ };