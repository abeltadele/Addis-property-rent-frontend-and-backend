// Contact model for MongoDB
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID']
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide agent ID']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Please provide property ID']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for user details
contactSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Virtual for agent details
contactSchema.virtual('agentDetails', {
  ref: 'User',
  localField: 'agent',
  foreignField: '_id',
  justOne: true
});

// Virtual for property details
contactSchema.virtual('propertyDetails', {
  ref: 'Property',
  localField: 'property',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Contact', contactSchema);