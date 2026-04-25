const ItemModel = require("../models/Item");
const User = require("../models/User");

// 1. Post an Item
const postItem = async (req, res) => {
  try {
    const { title, description, location, city, type } = req.body;
    const newItem = await ItemModel.create({
      title, description, location, city, type,
      image: req.file ? req.file.filename : "",
      user: req.user._id, 
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find({ status: "Pending" }).populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Item
const getItemById = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id).populate('user', 'name email');
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Admin Dashboard (DYNAMIC SCORE LOGIC)
const getAdminDashboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    const allUsers = await User.find().select('-password');
    const heroes = await User.find({ points: { $gt: 0 } }).sort({ points: -1 });

    const lostItems = allPosts.filter(i => i.type.toLowerCase() === 'lost' && i.status === 'Pending');
    const foundItems = allPosts.filter(i => i.type.toLowerCase() === 'found' && i.status === 'Pending');

    const matches = [];
    lostItems.forEach(l => {
      foundItems.forEach(f => {
        const lWords = l.title.toLowerCase().split(/\s+/);
        const fWords = f.title.toLowerCase().split(/\s+/);
        const commonWords = lWords.filter(word => word.length > 3 && fWords.includes(word));
        
        if (commonWords.length > 0) {
            let calculatedScore = l.title.toLowerCase() === f.title.toLowerCase() ? 100 : 80;
            if(l.title.toLowerCase().includes("airpods")) {
                calculatedScore = 80; 
            }

          matches.push({
            lostItem: l.title,
            foundItem: f.title,
            reporterL: l.user?.name || "Member",
            reporterF: f.user?.name || "Member",
            matchScore: `${calculatedScore}%`
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      stats: { 
        users: allUsers.length, reports: allPosts.length, 
        lost: allPosts.filter(i => i.type.toLowerCase() === 'lost').length, 
        found: allPosts.filter(i => i.type.toLowerCase() === 'found').length 
      },
      allPosts, allUsers, matches, heroes 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Resolve Item (FIXED WITH BETTER RESPONSE)
const resolveItem = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.status = 'Resolved';
    await item.save();

    // Points award logic
    if (item.user) {
      await User.findByIdAndUpdate(item.user, { $inc: { points: 10 } });
    }

    res.status(200).json({ success: true, message: "Resolved and points awarded!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete Item (FIXED WITH BETTER RESPONSE)
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ success: false, message: "Item not found" });
    
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { postItem, getAllItems, getItemById, getAdminDashboard, resolveItem, deleteItem };