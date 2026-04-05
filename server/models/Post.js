const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  location: { type: String, required: true },
  
  city: {
    type: String,
    required: true,
    default: 'Rawalpindi'
  },
  description: { type: String, required: true },
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  image: { type: String }, 
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'Recovered', 'Archived'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Post', postSchema);