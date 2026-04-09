const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Leaderboard ka rasta
router.get('/leaderboard/top', itemController.getLeaderboard);
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

// Claim karne ka rasta
router.post('/claim', itemController.claimItem);

module.exports = router;