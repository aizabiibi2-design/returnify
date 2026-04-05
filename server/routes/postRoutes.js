const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

// 1. Post Item - Reward points logic ke saath
router.post('/post-item', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, location, city, description, type } = req.body;
    
    const newItem = new Item({
      title,
      location,
      city: city || 'Rawalpindi',
      description,
      type,
      image: req.file ? req.file.filename : null,
      user: req.user.id 
    });

    await newItem.save();

    // Reward: Agar 'Found' item hai to user ko 10 points milenge
    if (type === 'Found') {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
    }

    res.status(201).json({ message: "Report Submitted Successfully!", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Fetch All Items - User details ke saath (Populate)
router.get('/all-items', async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name points').sort({ date: -1 }); 
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Leaderboard - Top Users display karne ke liye
router.get('/leaderboard/top', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('name points city');
    res.status(200).json(topUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;