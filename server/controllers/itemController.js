const User = require("../models/User");
const Item = require("../models/Item");

// 1. Admin Dashboard Stats
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: { $regex: /^lost$/i } });
    const foundItems = await Item.countDocuments({ type: { $regex: /^found$/i } });
    const allPosts = await Item.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalPosts, lostItems, foundItems },
      allPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Stats fetch failed" });
  }
};

// 2. Post Item (Required for postRoutes)
exports.postItem = async (req, res) => {
  try {
    const newItem = new Item({ ...req.body, user: req.user._id });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Post failed" });
  }
};

// 3. Get All Items (Required for postRoutes)
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// 4. Missing handlers for itemRoutes
exports.getLeaderboard = async (req, res) => res.json({ success: true, topUsers: [] });
exports.claimItem = async (req, res) => res.json({ success: true, message: "Claimed" });