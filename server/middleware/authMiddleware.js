const jwt = require('jsonwebtoken');
// Agay diye gaye path mein 'User' ko apni file ke asal naam se badli karein
const User = require('../models/User'); 

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id ya decoded._id check karein jo aapne login mein sign kiya tha
      req.user = await User.findById(decoded.id || decoded._id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: "User exist nahi karta" });
      }

      next(); 
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = { protect };