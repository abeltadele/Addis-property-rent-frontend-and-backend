// Property model for MongoDB
const mongoose = require('mongoose');

// Image sub-schema
const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
});

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a property title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a property description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['ETB', 'USD'],
      default: 'ETB'
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true
    },
    subcity: {
      type: String,
      required: [true, 'Please provide a subcity'],
      trim: true
    },
    kebele: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true
    },
    lat: Number,
    lng: Number
  },
  images: [imageSchema],
  bedrooms: {
    type: Number,
    required: [true, 'Please provide number of bedrooms'],
    min: [0, 'Number of bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide number of bathrooms'],
    min: [0, 'Number of bathrooms cannot be negative']
  },
  size: {
    type: Number,
    required: [true, 'Please provide property size'],
    min: [0, 'Size cannot be negative']
  },
  furnishing: {
    type: String,
    enum: ['furnished', 'unfurnished', 'semi-furnished'],
    default: 'unfurnished'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full price with currency
propertySchema.virtual('fullPrice').get(function() {
  return `${this.price.amount} ${this.price.currency}`;
});

// Virtual for agent details
propertySchema.virtual('agent', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

// Pre-save hook to set verified status based on user role
propertySchema.pre('save', function(next) {
  if (this.createdBy.role === 'admin') {
    this.verified = true;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);