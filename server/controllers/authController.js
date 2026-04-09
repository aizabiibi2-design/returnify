const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// 1. Register User (With Dash-friendly CNIC)
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, cnic, city, role, password } = req.body;

    if (!name || !email || !phone || !cnic || !city || !password) {
      return res.status(400).json({ message: "All fields are required! 📝" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long! 🔐" });
    }

    // UPDATED: Ab dashes walay CNIC (15 chars) bhi accept honge
    if (cnic.length !== 13 && cnic.length !== 15) {
      return res.status(400).json({ message: "Please enter a valid 13-digit CNIC number! 🪪" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This email is already registered! 📧" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, 
      email: email.toLowerCase(), // Email case-sensitivity fix
      phone, 
      cnic, 
      city, 
      role: role || 'user', 
      password: hashedPassword, 
      points: 0 
    });

    res.status(201).json({ 
      success: true,
      message: "User registered successfully! 🎉" 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// 2. Login User (Clean & Fast)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Email ko hamesha lowercase karke dhoondein
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ message: "Email not found! ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password! ❌" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ 
      success: true,
      token, 
      user: { id: user._id, name: user.name, points: user.points, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Forgot Password (Nodemailer)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "No account found! 🔍" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aizabibi18@gmail.com',
        pass: 'afgt ydwa irxs nqsa' // Ensure App Password is correct
      }
    });

    const mailOptions = {
      from: '"Returnify Support" <aizabibi18@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<h2>Reset Password</h2><p>Click <a href="http://localhost:5173/reset-password/${user._id}">here</a> to reset.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent! 📧" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};

// 4. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(200).json({ message: "Updated! 🛡️" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };