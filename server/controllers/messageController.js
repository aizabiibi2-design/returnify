const Message = require('../models/message');

// 1. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, itemId, text } = req.body;
        const sender = req.user.id; 
        if (!receiver || !text || !itemId) {
            return res.status(400).json({ message: "Missing details" });
        }
        const newMessage = new Message({ sender, receiver, itemId, text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Chat History (Yahi naam routes mein hona chahiye)
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

// 3. Get Conversations
exports.getConversations = async (req, res) => {
    try {
      const userId = req.user.id;
      // Un saaray messages ko dhoondo jahan user sender ya receiver ho
      const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
      })
      .populate('sender receiver', 'name email')
      .populate('itemId', 'title')
      .sort({ createdAt: -1 });
  
      // Conversations ko group karna taake aik hi banda bar bar nazar na aaye
      const conversations = [];
      const seenUsers = new Set();
  
      messages.forEach(msg => {
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