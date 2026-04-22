const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const ItemModel = require("../models/Item"); // Maine 'Item' ko 'ItemModel' kar dia hai

// Admin Dashboard Routes
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);
router.put('/admin/resolve/:id', protect, itemController.resolveItem);
router.delete('/:id', protect, itemController.deleteItem);

// Discovery Page: Public access
router.get('/all-items', async (req, res) => {
    try {
        // Niche bhi 'Item' ki jagah 'ItemModel' kar dia
        const items = await ItemModel.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;