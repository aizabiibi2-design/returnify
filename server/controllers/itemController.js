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

// 4. Admin Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const allPosts = await ItemModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    const allUsers = await User.find().select('-password');
    const heroes = await User.find({ points: { $gt: 0 } }).sort({ points: -1 });

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
      heroes 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. CLAIM ITEM - THE UNIVERSAL FIX (Updated with your direct password)
const claimItem = async (req, res) => {
  try {
    const { itemId, ownerEmail, itemName, ownerId, message } = req.body;
    const senderId = req.user._id;

    const claimMessage = message || `System Alert: A potential match has been claimed for your item "${itemName}".`;

    // A. Inbox Entry (Validation Fix)
    await MessageModel.create({
      sender: senderId,
      receiver: ownerId,
      message: claimMessage,
      text: claimMessage, 
      item: itemId,
      itemId: itemId 
    });

    // B. Email Notification (DIRECT CREDENTIALS)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: "aizabibi18@gmail.com",
        pass: "xjdodspszvcytoma" 
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"Returnify AI" <aizabibi18@gmail.com>`,
      to: ownerEmail,
      subject: 'Returnify - Someone Found Your Item! 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #1a1a4b;">Returnify Notification</h2>
          <p>Good news! Someone has claimed a match for your item: <strong>${itemName}</strong>.</p>
          <p>Login to your <strong>Returnify Inbox</strong> to chat with the finder.</p>
          <hr>
          <p style="font-size: 11px; color: #777;">This is an automated system-generated alert.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: "Success! Notification sent to Owner's Inbox and Email." 
    });

  } catch (error) {
    console.error("Backend Claim Error:", error.message);
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
    res.status(200).json({ success: true, message: "Resolved!" });
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

module.exports = { postItem, getAllItems, getItemById, getAdminDashboard, resolveItem, deleteItem, claimItem };