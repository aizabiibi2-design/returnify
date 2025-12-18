const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser, // Yahan 'l' small rakhein
} = require("../controllers/authController");

router.post("/register", registerUser);

// Yahan bhi 'loginUser' (small l) hona chahiye controller wala
router.post("/login", loginUser); 

module.exports = router;