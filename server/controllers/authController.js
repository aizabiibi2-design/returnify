const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// 1. Register User (With Advanced Validation)
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, cnic, city, role, password } = req.body;

    // Supervisor Check: Basic field validation
    if (!name || !email || !phone || !cnic || !city || !password) {
      return res.status(400).json({ message: "All fields are required! 📝" });
    }

    // Advanced Check: Password length (Security best practice)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long! 🔐" });
    }

    // Advanced Check: CNIC format (Optional but impressive)
    if (cnic.length !== 13) {
      return res.status(400).json({ message: "Please enter a valid 13-digit CNIC number! 🪪" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This email is already registered! 📧" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Initializing points to 0 for the Reward System
    const user = await User.create({
      name, 
      email, 
      phone, 
      cnic, 
      city, 
      role: role || 'user', 
      password: hashedPassword, 
      points: 0 
    });

    res.status(201).json({ 
      success: true,
      message: "User registered successfully! Welcome to Returnify. 🎉" 
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
};

// 2. Login User (With Token)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password! ❌" });
    }

    // Generating JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ 
      success: true,
      message: "Login successful! 🚀", 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        points: user.points,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Forgot Password (Email Logic)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email! 🔍" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aizabibi18@gmail.com',
        pass: 'afgt ydwa irxs nqsa' // Your Secure App Password
      }
    });

    const mailOptions = {
      from: '"Returnify Support" <aizabibi18@gmail.com>',
      to: email,
      subject: 'Password Reset Request - Returnify',
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1a1a4b;">Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="http://localhost:5173/reset-password/${user._id}" 
             style="background: #ff007a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
             Reset My Password
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email! 📧" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email. Please check your connection." });
  }
};

// 4. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });
    
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Success! Your password has been updated. 🛡️" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };