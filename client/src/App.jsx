const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Post');

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

// Naya Leaderboard Route (Isay hamesha specific ID route se upar rakhein)
router.get('/leaderboard/top', async (req, res) => {
  try {
    const leaderboard = await Item.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/post-item', upload.single('image'), async (req, res) => {
  try {
    const { title, location, description, type } = req.body;
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    const newItem = new Item({
      title,
      location,
      description,
      type: formattedType,
      image: req.file ? req.file.filename : null 
    });

    await newItem.save();
    res.status(201).json({ message: "Report Submitted Successfully!", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;