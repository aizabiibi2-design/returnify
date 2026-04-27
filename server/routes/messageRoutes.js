const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController'); 
const { protect } = require('../middleware/authMiddleware');

// Verifying functions exist to prevent crash
router.post('/send', protect, messageController.sendMessage);
router.get('/history/:itemId/:otherUserId', protect, messageController.getChatHistory);
router.get('/inbox', protect, messageController.getUserInbox);

module.exports = router;