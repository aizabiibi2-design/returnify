const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); 
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// 1. DISCOVERY PORTAL (Isi se 0 Reports wala masla hal hoga)
// URL: http://localhost:5000/api/items/all-items
router.get('/all-items', itemController.getAllItems);

// 2. COMMUNITY HEROES (Leaderboard Fix)
// URL: http://localhost:5000/api/items/admin/dashboard
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

// --- NEW ROUTE FOR LEADERBOARD (As per documentation) ---
// URL: http://localhost:5000/api/items/actions/leaderboard/top
router.get('/actions/leaderboard/top', itemController.getTopHeroes);

// 3. POST ITEM (Image Upload Fix)
// Frontend URL: http://localhost:5000/api/items/post
router.post('/post', protect, upload.single('image'), itemController.postItem);

// 4. ITEM DETAILS
router.get('/details/:id', itemController.getItemById);

// 5. CLAIM ROUTE (AI Match Fix)
router.post('/claim', protect, itemController.claimItem);


// 6. ADMIN ACTIONS (Resolve & Delete)
router.put('/admin/resolve/:id', protect, itemController.resolveItem);
router.delete('/:id', protect, itemController.deleteItem);


module.exports = router;