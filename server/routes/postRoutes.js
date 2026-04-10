const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController'); 
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

// 1. Post an Item
router.post('/post-item', protect, upload.single('image'), itemController.postItem);

// 2. Discovery Page
router.get('/all-items', itemController.getAllItems);

// 3. Leaderboard/Admin Stats (Optional if you want it here too)
router.get('/admin/dashboard', protect, itemController.getAdminDashboard);

module.exports = router;