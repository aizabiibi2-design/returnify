const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Post');
const User = require('../models/User'); // Points update karne ke liye
const { protect } = require('../middleware/authMiddleware'); // Security ke liye

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

// 1. Leaderboard Route (Points ke hisab se top users)
router.get('/leaderboard/top', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(5)
      .select('name points city'); // Sirf zaroori data bhejein
    res.status(200).json(topUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Post Item Route (With Protection & Points)
router.post('/post-item', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, location, description, type } = req.body;
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    const newItem = new Item({
      title,
      location,
      description,
      type: formattedType,
      image: req.file ? req.file.filename : null,
      user: req.user.id // Token se user ki ID nikal kar save ki
    });

    await newItem.save();

    // Reward Logic: Agar item "Found" hai to 10 points dein
    if (formattedType === 'Found') {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
    }

    res.status(201).json({ message: "Report Submitted Successfully!", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. All Items
router.get('/all-items', async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 }); 
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // .populate('user', 'name email') se user ki details bhi mil jayengi
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Single Item Details
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;