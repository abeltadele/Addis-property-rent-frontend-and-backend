// Property controller for handling property-related operations
const Property = require('../models/Property');

/**
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  Public
 */
exports.getAllProperties = async (req, res, next) => {
  try {
    // Build query
    let query = {};

    // Add filtering options if they exist
    if (req.query.city) {
      query['location.city'] = req.query.city;
    }

    if (req.query.minPrice) {
      query['price.amount'] = { $gte: req.query.minPrice };
    }

    if (req.query.maxPrice) {
      query['price.amount'] = { ...query['price.amount'], $lte: req.query.maxPrice };
    }

    if (req.query.bedrooms) {
      query.bedrooms = req.query.bedrooms;
    }

    if (req.query.furnishing) {
      query.furnishing = req.query.furnishing;
    }

    // Execute query
    const properties = await Property.find(query)
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    // Return response with count
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single property
 * @route   GET /api/properties/:id
 * @access  Public
 */
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new property
 * @route   POST /api/properties
 * @access  Private (Agent/Admin)
 */
exports.createProperty = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Create property
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private (Agent/Admin who owns the property)
 */
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this property`
      });
    }

    // Update property
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (Agent/Admin who owns the property)
 */
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this property`
      });
    }

    await property.remove();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};