const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// @route   POST /api/properties
// @desc    Create a new property
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Create a new property with the request body data
    const property = await Property.create(req.body);
    
    // Return the created property with status 201 (Created)
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all properties in the database
    const properties = await Property.find();
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Find property by ID
    const property = await Property.findById(req.params.id);
    
    // If property not found, return 404
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property by ID
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    // Find property by ID and update with request body data
    // { new: true } returns the updated document
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    // If property not found, return 404
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    // Find property by ID and delete
    const property = await Property.findByIdAndDelete(req.params.id);
    
    // If property not found, return 404
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
