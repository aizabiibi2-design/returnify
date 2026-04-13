const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware'); // Aapka auth middleware

// Saare routes protected honge
router.post('/send', protect, sendMessage);
router.get('/history/:itemId/:otherUserId', protect, getChatHistory);

module.exports = router;