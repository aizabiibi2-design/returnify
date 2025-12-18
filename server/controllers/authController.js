const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    // 1. Frontend se data nikalna
    const { name, email, phone, city, role, password } = req.body;

    // 2. Check karna ke sab kuch fill hai ya nahi
    if (!name || !email || !phone || !city || !password) {
      return res.status(400).json({ message: "Sari fields fill karna lazmi hain" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Ye email pehle se register hai" });
    }

    // 3. Password ko secure (hash) karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Database mein naya user save karna
    const user = await User.create({
      name,
      email,
      phone,
      city,
      role, // Ab role bhi save hoga
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      user: { name: user.name, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };