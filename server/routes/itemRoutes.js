const express = require('express');
const router = express.Router(); // Yeh line missing thi ya galat thi!
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// 1. Leaderboard
router.get('/leaderboard/top', itemController.getLeaderboard);

// 2. Admin Dashboard stats
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

// 3. Discovery Page data
router.get('/all-items', itemController.getAllItems);

// 4. Claiming functionality
router.post('/claim', protect, itemController.claimItem);

// 5. Post Item (Agar aap yahan se handle kar rahi hain)
router.post('/post-item', protect, itemController.postItem);

module.exports = router; 