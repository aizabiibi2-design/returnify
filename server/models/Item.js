const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
}, { 
    // Yeh line aapke MongoDB ke 'posts' collection se data fetch karegi
    collection: 'posts' 
});

module.exports = mongoose.model('Item', itemSchema);