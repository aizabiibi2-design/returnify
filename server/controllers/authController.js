const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// 1. Register User (With CNIC)
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, cnic, city, role, password } = req.body;
    if (!name || !email || !phone || !cnic || !city || !password) {
      return res.status(400).json({ message: "Sari fields fill karna lazmi hain" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Ye email pehle se register hai" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, phone, cnic, city, role, password: hashedPassword, points: 0 
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: { id: user._id, name: user.name, points: user.points } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Forgot Password (Sends Email)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aizabibi18@gmail.com',
        pass: 'afgt ydwa irxs nqsa' // Aapka 16-digit App Password
      }
    });

    const mailOptions = {
      from: 'Returnify Team',
      to: email,
      subject: 'Password Reset Link - Returnify',
      html: `<h3>Hey ${user.name},</h3><p>Click below to reset password:</p>
             <a href="http://localhost:5173/reset-password/${user._id}">Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Reset Password (Updates DB)
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };