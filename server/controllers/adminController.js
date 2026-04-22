const User = require("../models/User");
const ItemModel = require("../models/Item");

// Function definition
const getAdminDashboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    const allUsers = await User.find().select('-password').sort({ createdAt: -1 });

    const lostItems = allPosts.filter(i => i.type.toLowerCase() === 'lost');
    const foundItems = allPosts.filter(i => i.type.toLowerCase() === 'found');

    const matches = [];
    lostItems.forEach(l => {
      foundItems.forEach(f => {
        if (l.title.toLowerCase().trim() === f.title.toLowerCase().trim()) {
          matches.push({
            lostItem: l.title,
            foundItem: f.title,
            reporterL: l.user?.name || "Aiza Pervaiz",
            reporterF: f.user?.name || "Aiza Bibi",
            matchScore: "100%" 
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      stats: { 
        users: allUsers.length, 
        reports: allPosts.length, 
        lost: lostItems.length, 
        found: foundItems.length 
      },
      allPosts,
      allUsers,
      matches 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CRITICAL: Yeh line check karein!
module.exports = { getAdminDashboard };