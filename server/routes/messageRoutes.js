const express = require('express');
const router = express.Router();
const { 
    sendMessage, 
    getChatHistory, 
    getConversations 
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Route for sending a message
router.post('/send', protect, sendMessage);

// Route for fetching specific history (Used in Chat.jsx)
// Frontend call: axios.get(`/api/messages/history/${itemId}/${otherUserId}`)
router.get('/history/:itemId/:otherUserId', protect, getChatHistory);

// Route for Inbox list (Used in Inbox/Dashboard)
router.get('/conversations', protect, getConversations);

module.exports = router;