const ItemModel = require("../models/Item");
const User = require("../models/User");

exports.getAdminDashboard = async (req, res) => {
    try {
        // 1. Fetch data directly from 'posts' collection
        const allPosts = await ItemModel.find().populate('user', 'name email').sort({ date: -1 });
        const allUsers = await User.find().select('-password').sort({ joinedAt: -1 });

        // 2. Logic for Stats
        const lostItems = allPosts.filter(i => i.type === 'Lost');
        const foundItems = allPosts.filter(i => i.type === 'Found');

        // 3. Simple Title Matching for AI Engine
        const matches = [];
        lostItems.forEach(l => {
            foundItems.forEach(f => {
                if (l.title.toLowerCase().trim() === f.title.toLowerCase().trim()) {
                    matches.push({
                        lostItem: l.title,
                        foundItem: f.title,
                        reporterL: l.user?.name || "User A",
                        reporterF: f.user?.name || "User B"
                    });
                }
            });
        });

        // 4. Community Heroes - Unko dikhayein jin ke points > 0 hain
        const heroes = allUsers.filter(u => u.points > 0).sort((a, b) => b.points - a.points);

        res.status(200).json({
            success: true,
            stats: { users: allUsers.length, reports: allPosts.length, lost: lostItems.length, found: foundItems.length },
            allPosts, // Discovery Portal yahan se chalega
            allUsers,
            matches,
            heroes // Community Heroes yahan se chalenge
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resolveItem = async (req, res) => {
    try {
        const updatedItem = await ItemModel.findByIdAndUpdate(
            req.params.id,
            { status: "Resolved" },
            { new: true }
        );
        res.status(200).json({ success: true, item: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};