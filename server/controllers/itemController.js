const User = require("../models/User");
const ItemModel = require("../models/Item");

// 1. Admin Dashboard Stats
exports.getAdminDashboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find().sort({ date: -1 });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      stats: { 
        totalUsers, 
        totalPosts: allPosts.length, 
        lostItems: allPosts.filter(i => i.type && i.type.toLowerCase() === 'lost').length, 
        foundItems: allPosts.filter(i => i.type && i.type.toLowerCase() === 'found').length 
      },
      allPosts,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Stats fetch failed" });
  }
};

// 2. Discovery Portal
exports.getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find().sort({ date: -1 }).populate('user', 'name');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// 3. Leaderboard (Updated according to Documentation Section 3.6)
exports.getLeaderboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find();
    const allUsers = await User.find();

    const topUsers = allUsers.map(user => {
      // Logic: 5 points per post (as per documentation reward system)
      const userPosts = allPosts.filter(p => p.user && p.user.toString() === user._id.toString());
      let points = userPosts.length * 5;

      // Bonus: 10 points if item is marked as 'returned' (Future logic)
      const returnedCount = userPosts.filter(p => p.status === 'returned').length;
      points += (returnedCount * 10);

      // Badge logic for visual recognition
      let badge = "New Member";
      if (points >= 50) badge = "Gold Guardian";
      else if (points >= 20) badge = "Silver Scout";
      else if (points > 0) badge = "Bronze Buddy";

      return {
        name: user.name,
        email: user.email,
        count: points, // Frontend display points
        badge: badge
      };
    })
    .filter(u => u.count > 0) // Sirf unhein dikhayein jinhon ne koi kaam kiya ho
    .sort((a, b) => b.count - a.count); // Highest points top par

    res.status(200).json({
      success: true,
      topUsers: topUsers
    });
  } catch (error) {
    console.error("Leaderboard Sync Error:", error);
    res.status(500).json({ message: "Leaderboard failed" });
  }
};

// 4. Post Item
exports.postItem = async (req, res) => {
  try {
    const newItem = new ItemModel({ 
        ...req.body, 
        user: req.user._id,
        image: req.file ? req.file.path : "",
        status: "active" // Default status
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Post failed" });
  }
};

// 5. Claim Item
exports.claimItem = async (req, res) => {
    res.status(200).json({ success: true, message: "Claim request submitted!" });
};