// Import mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define the Property schema with the required fields
const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be a positive number']
  },
  location: {
    type: String,
    required: false,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Create and export the Property model
module.exports = mongoose.model('Property', PropertySchema);
