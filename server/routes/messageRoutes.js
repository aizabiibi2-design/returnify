const express = require('express');
const router = express.Router();
const { 
    sendMessage, 
    getChatHistory, 
    getConversations 
} = require('../controllers/messageController'); // Path sahi check karein
const { protect } = require('../middleware/authMiddleware');

// Check karein ke koi bhi handle undefined na ho
router.post('/send', protect, sendMessage);
router.get('/history/:itemId/:otherUserId', protect, getChatHistory);
router.get('/conversations', protect, getConversations);

module.exports = router;