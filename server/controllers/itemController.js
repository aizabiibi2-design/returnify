const ItemModel = require("../models/Item");
const User = require("../models/User");
const nodemailer = require("nodemailer"); 
const MessageModel = require("../models/message"); 

// 1. Post an Item
const postItem = async (req, res) => {
  try {
    const { title, description, location, city, type } = req.body;
    const newItem = await ItemModel.create({
      title, description, location, city, type,
      image: req.file ? req.file.filename : "",
      user: req.user._id,
      status: "Pending" 
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find({ status: "Pending" }).populate('user', 'name email').sort({ createdAt: -1 });
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


const getAdminDashboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    const allUsers = await User.find().select('-password');
    
    // UPDATE: Hum ne har qism ka filter hata diya hai
    // Ab Admin ho ya normal user, jis ke points hain wo show hoga
    const rawHeroes = await User.find().sort({ points: -1 }).lean();

    const heroes = rawHeroes.map(u => ({
      _id: u._id,
      name: u.name || "System User",
      email: u.email,
      points: u.points || 0,
      count: u.points || 0,
      role: u.role // Role bhi bhej rahe hain taake frontend ko asani ho
    }));

    // AI Matcher logic (No changes)
    const aiMatches = [];
    const lostItems = allPosts.filter(i => i.type.toLowerCase() === 'lost' && i.status !== 'Resolved');
    const foundItems = allPosts.filter(i => i.type.toLowerCase() === 'found' && i.status !== 'Resolved');

    lostItems.forEach(lost => {
      foundItems.forEach(found => {
        const lostText = `${lost.title} ${lost.description || ""} ${lost.city}`.toLowerCase();
        const foundText = `${found.title} ${found.description || ""} ${found.city}`.toLowerCase();
        const lostWords = lostText.split(/\s+/).filter(w => w.length > 2);
        const foundWords = foundText.split(/\s+/).filter(w => w.length > 2);
        const common = lostWords.filter(word => foundWords.includes(word));
        const score = common.length / Math.sqrt(lostWords.length * foundWords.length || 1);
        if (score >= 0.4) {
          aiMatches.push({
            lostItem: { _id: lost._id, title: lost.title, city: lost.city },
            foundItem: { _id: found._id, title: found.title, city: found.city },
            reporterL: lost.user?.name || "Anonymous",
            reporterF: found.user?.name || "Anonymous",
            matchScore: `${Math.round(score * 100)}%`,
            detectedAt: new Date()
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      stats: { 
        users: allUsers.length, 
        reports: allPosts.length,
        lost: allPosts.filter(i => i.type.toLowerCase() === 'lost').length, 
        found: allPosts.filter(i => i.type.toLowerCase() === 'found').length 
      },
      allPosts, 
      allUsers, 
      heroes, // Ab Admin ke 20 points bhi is list mein honge
      aiMatches 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. CLAIM ITEM
const claimItem = async (req, res) => {
  try {
    const { itemId, ownerEmail, itemName, ownerId, message } = req.body;
    const senderId = req.user._id;
    const claimMessage = message || `System Alert: A potential match has been claimed for your item "${itemName}".`;

    await MessageModel.create({
      sender: senderId,
      receiver: ownerId,
      message: claimMessage,
      text: claimMessage, 
      item: itemId,
      itemId: itemId 
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", port: 465, secure: true, 
      auth: { user: "aizabibi18@gmail.com", pass: "xjdodspszvcytoma" },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `"Returnify AI" <aizabibi18@gmail.com>`,
      to: ownerEmail,
      subject: 'Returnify - Someone Found Your Item! 🚀',
      html: `<p>Someone has claimed a match for your item: <strong>${itemName}</strong>.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Success! Notification sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Resolve Item
const resolveItem = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    
    item.status = 'Resolved';
    await item.save();
    
    if (item.user) {
      await User.findByIdAndUpdate(item.user, { $inc: { points: 10 } });
    }
    res.status(200).json({ success: true, message: "Resolved Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Delete Item
const deleteItem = async (req, res) => {
  try {
    await ItemModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Get Top Heroes
const getTopHeroes = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ points: -1 }).limit(10).select('name email points');
    const formattedUsers = topUsers.map(u => ({
      name: u.name,
      email: u.email,
      count: u.points || 0,
      points: u.points || 0 
    }));
    res.status(200).json({ success: true, topUsers: formattedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { postItem, getAllItems, getItemById, getAdminDashboard, resolveItem, deleteItem, claimItem, getTopHeroes };