const Message = require('../models/message');

// 1. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, itemId, text } = req.body;
        const sender = req.user.id; 
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

// 2. Get Chat History (Specific conversation between two users on one item)
exports.getChatHistory = async (req, res) => {
    try {
        const { itemId, otherUserId } = req.params;
        const messages = await Message.find({
            itemId,
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Conversations (Inbox list)
exports.getConversations = async (req, res) => {
    try {
      const userId = req.user.id;
      const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
      })
      .populate('sender receiver', 'name email')
      .populate('itemId', 'title') // Returns title of the wallet/mobile
      .sort({ createdAt: -1 });
  
      const conversations = [];
      const seenUsers = new Set();
  
      messages.forEach(msg => {
        // Agar item delete ho gaya ho toh skip karein (Critical fix)
        if (!msg.itemId) return;

        const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        const conversationKey = `${otherUser._id}-${msg.itemId._id}`;
  
        if (!seenUsers.has(conversationKey)) {
          seenUsers.add(conversationKey);
          conversations.push({
            otherUser,
            lastMessage: msg.text,
            item: msg.itemId,
            date: msg.createdAt
          });
        }
      });
  
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};