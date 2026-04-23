const express = require('express');
const router = express.Router();
const adminController = require('../controllers/itemController'); // Check karein agar controller ka naam yehi hai
const { protect } = require('../middleware/authMiddleware');

// Dashboard & Discovery
router.get('/admin/dashboard', protect, adminController.getAdminDashboard);
router.get('/all-items', adminController.getAllItems);

// Action Routes
router.put('/admin/resolve/:id', protect, adminController.resolveItem);
router.delete('/delete/:id', protect, adminController.deleteItem); // Ye line missing thi!

module.exports = router;