const mongoose = require('mongoose');
mongoose.set('debug', true);

// Define a Review Schema
const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

// Update HeroListSchema
const HeroListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  heroes: [String], // Array of hero identifiers (e.g., names or IDs) as stored in lowdb
  ratings: [Number], // You might want to remove this if you're using the new Review schema
  reviews: [ReviewSchema], // Adding reviews
  lastModified: {
    type: Date,
    default: Date.now
  }
});

const HeroList = mongoose.model("HeroList", HeroListSchema);

module.exports = HeroList;
