const ItemModel = require("../models/Item");
const User = require("../models/User");

exports.getAdminDashboard = async (req, res) => {
    try {
        console.log("🚀 ADMIN DASHBOARD REQUEST RECEIVED");

        const allPosts = await ItemModel.find().populate('user', 'name email').sort({ date: -1 });
        const allUsers = await User.find().select('-password').sort({ joinedAt: -1 });

        const lostItems = allPosts.filter(i => i.type === 'Lost');
        const foundItems = allPosts.filter(i => i.type === 'Found');

        const matches = [];
        lostItems.forEach(l => {
            foundItems.forEach(f => {
                const titleL = (l.title || "").toString().toLowerCase().trim();
                const titleF = (f.title || "").toString().toLowerCase().trim();

                // ID Card matching logic
                const isMatch = titleL.includes(titleF) || 
                                titleF.includes(titleL) || 
                                (titleL.includes("id") && titleF.includes("card")) ||
                                (titleL.includes("card") && titleF.includes("id"));

                if (isMatch) {
                    matches.push({
                        lostItem: { title: l.title, city: l.city || "Rawalpindi" },
                        foundItem: { title: f.title, city: f.city || "Rawalpindi" },
                        matchScore: titleL === titleF ? "100%" : "80%",
                        detectedAt: new Date(),
                        reporterL: l.user?.name || "User A",
                        reporterF: f.user?.name || "User B"
                    });
                }
            });
        });

        console.log("✅ Total Matches sent to Frontend:", matches.length);

        const heroes = allUsers.filter(u => u.points > 0).sort((a, b) => b.points - a.points);

        return res.status(200).json({
            success: true,
            stats: { 
                users: allUsers.length, 
                reports: allPosts.length, 
                lost: lostItems.length, 
                found: foundItems.length 
            },
            allPosts,
            allUsers,
            aiMatches: matches, // Frontend isi key ko render karta hai
            heroes
        });
    } catch (error) {
        console.error("❌ Dashboard Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};