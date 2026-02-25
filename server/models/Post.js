const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  image: { type: String }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema); // Model ka naam 'Post' rakha hai