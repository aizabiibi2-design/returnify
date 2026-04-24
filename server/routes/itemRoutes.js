const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); 
const { protect } = require('../middleware/authMiddleware');

// 1. Discovery & All Items
router.get('/all-items', itemController.getAllItems);

// 2. Specific Item Details (VERY IMPORTANT for Chat & Details Page)
// Ye wo rasta hai jo "Item Not Found" ko theek karega
router.get('/details/:id', itemController.getItemById);

// 3. Admin & Action Routes
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);
router.put('/admin/resolve/:id', protect, itemController.resolveItem);
router.delete('/delete/:id', protect, itemController.deleteItem);

module.exports = router;