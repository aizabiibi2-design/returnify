const express = require('express');
const router = express.Router();

// Humne functions ko direct import kar liya hai
const { 
    sendMessage, 
    getChatHistory, 
    getUserInbox 
} = require('../controllers/messageController');

const { protect } = require('../middleware/authMiddleware');

// 1. Message bhejney ke liye
router.post('/send', protect, sendMessage);

// 2. Chat history dekhne ke liye (Specific Chat)
router.get('/history/:itemId/:otherUserId', protect, getChatHistory);

// 3. Inbox dekhne ke liye (Jahan sarey messages nazar ayenge)
// Yahan humne "messageController." hata diya hai kyunke function direct upar import hai
router.get('/inbox', protect, getUserInbox);
router.get('/conversations', protect, getUserInbox);

module.exports = router;