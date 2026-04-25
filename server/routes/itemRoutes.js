const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); 
const { protect } = require('../middleware/authMiddleware');

// 1. Discovery & All Items
router.get('/all-items', itemController.getAllItems);

// 2. Specific Item Details
router.get('/details/:id', itemController.getItemById);

// 3. Admin & Action Routes
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

// RESOLVE ROUTE
router.put('/admin/resolve/:id', protect, itemController.resolveItem);

// DELETE ROUTE (Fixed: Removed /delete prefix to match frontend)
router.delete('/:id', protect, itemController.deleteItem);

module.exports = router;