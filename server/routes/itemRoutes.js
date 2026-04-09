const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// YE LINE ZAROORI HAI: Middleware ko import karein
const { protect } = require('../middleware/authMiddleware'); 

// Leaderboard ka rasta
router.get('/leaderboard/top', itemController.getLeaderboard);

// Admin Dashboard (Ab 'protect' error nahi dega)
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

// Claim karne ka rasta
router.post('/claim', itemController.claimItem);

module.exports = router;