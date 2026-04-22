const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');

router.get('/leaderboard/top', async (req, res) => {
    try {
        const topUsers = await Item.aggregate([
            { $match: { status: "Resolved" } },
            { $group: { _id: "$user", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const populatedUsers = await Promise.all(topUsers.map(async (stat) => {
            const user = await User.findById(stat._id).select('name email');
            return {
                name: user?.name || "Member",
                email: user?.email || "",
                count: stat.count
            };
        }));

        res.status(200).json({ success: true, topUsers: populatedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; // Yeh line miss mat karna