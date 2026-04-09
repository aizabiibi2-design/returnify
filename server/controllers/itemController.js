const Post = require('../models/Post'); 
const User = require('../models/User'); 

// 1. POST ITEM
exports.postItem = async (req, res) => {
    try {
        const { title, location, city, description, type } = req.body;
        const newItem = new Post({
            title,
            location,
            city: city || 'Rawalpindi',
            description,
            type,
            image: req.file ? req.file.filename : null,
            user: req.user.id 
        });

        await newItem.save();
        if (newItem.type === 'Found') {
            await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
        }
        res.status(201).json({ message: "Report Submitted Successfully!", item: newItem });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. DISCOVERY (With Location & Type Filtering)
exports.getAllItems = async (req, res) => {
    try {
        const { city, type, search } = req.query;
        let query = {};

        if (city && city !== 'All Cities') query.city = city;
        if (type && type !== 'All Types') query.type = type;
        if (search) query.title = { $regex: search, $options: 'i' };

        const items = await Post.find(query)
            .populate('user', 'name points')
            .sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. ADMIN DASHBOARD STATS (Zarori Function)
exports.getAdminDashboard = async (req, res) => {
    try {
        // Documentation Requirement: Fetching system-wide stats
        const totalPosts = await Post.countDocuments();
        const totalUsers = await User.countDocuments();
        const lostItems = await Post.countDocuments({ type: 'Lost' });
        const foundItems = await Post.countDocuments({ type: 'Found' });
        
        const allPosts = await Post.find().populate('user', 'name email');
        const allUsers = await User.find().select('-password'); 

        res.json({
            stats: { totalPosts, totalUsers, lostItems, foundItems },
            allPosts,
            allUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. CLAIM LOGIC
exports.claimItem = async (req, res) => {
    try {
        const { itemId } = req.body; 
        const item = await Post.findById(itemId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        item.status = 'Returned';
        await item.save();

        if (item.user) {
            await User.findByIdAndUpdate(item.user, { $inc: { points: 10 } });
            res.json({ success: true, message: "10 Points awarded! 🏆" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. LEADERBOARD
exports.getLeaderboard = async (req, res) => {
    try {
        const topHeroes = await User.find()
            .sort({ points: -1 })
            .limit(5)
            .select('name points city');
        res.json(topHeroes);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};