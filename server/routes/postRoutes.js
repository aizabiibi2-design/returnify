const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Post');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ye direct 'server/uploads' ko target karega
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Item Post karne ka Route
router.post('/post-item', upload.single('image'), async (req, res) => {
  try {
    console.log("Body:", req.body); // Terminal mein data dekhne ke liye
    console.log("File:", req.file); // Terminal mein file dekhne ke liye

    const { title, location, description, type } = req.body;
    
    const newItem = new Item({
      title,
      location,
      description,
      type,
      image: req.file ? req.file.filename : null // File ka naam DB mein jayega
    });

    await newItem.save();
    res.status(201).json({ message: "Report Submitted Successfully!", item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error: Data save nahi ho saka" });
  }
});

module.exports = router;